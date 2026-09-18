import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const allowedNameMappings = ['𝐓 - Label -> aria-label'];

function normalizeName(name) {
  return name
    .replace(/#[^\s]+/g, '')
    .replace(/^[^a-zA-Z0-9]+ - /, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function readSource(filePath) {
  try {
    return readFileSync(resolve(process.cwd(), filePath), 'utf8');
  } catch {
    return '';
  }
}

function mappingKey(figmaName, attribute) {
  return `${normalizeName(figmaName)}->${attribute}`;
}

function normalizeAllowedNameMapping(mapping) {
  const [figmaName, attribute] = mapping.split('->').map(part => part.trim());
  return figmaName && attribute ? mappingKey(figmaName, attribute) : mapping;
}

const normalizedAllowedNameMappings = new Set(
  allowedNameMappings.map(mapping => normalizeAllowedNameMapping(mapping))
);

function getStringLiteralValue(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
    ? node.text
    : undefined;
}

function getIdentifierName(node) {
  if (ts.isIdentifier(node)) return node.text;
  if (ts.isPrefixUnaryExpression(node) && ts.isIdentifier(node.operand)) return node.operand.text;
}

function getLookupName(node) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    /^check(?:String|Boolean)Property$/.test(node.expression.text)
  ) {
    const checkedName = node.arguments[1] ? getStringLiteralValue(node.arguments[1]) : undefined;
    return checkedName ?? getLookupName(node.arguments[0]);
  }

  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    /^get(?:String|Boolean)$/.test(node.expression.name.text)
  ) {
    return node.arguments[0] ? getStringLiteralValue(node.arguments[0]) : undefined;
  }
}

function getTemplateAttributeUsage(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    const attribute = node.text.trim().match(/^([a-z][a-z0-9-]*)/)?.[1];
    return attribute ? { attribute } : undefined;
  }

  if (ts.isTemplateExpression(node)) {
    const attribute = node.head.text.trim().match(/^([a-z][a-z0-9-]*)=/)?.[1],
      variable = node.templateSpans.find(span => ts.isIdentifier(span.expression))?.expression.text;

    return attribute ? { attribute, variable } : undefined;
  }
}

function findLookupVariables(source) {
  const lookups = new Map(),
    sourceFile = ts.createSourceFile(
      'mapping.ts',
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const lookupName = getLookupName(node.initializer);
      if (lookupName) {
        lookups.set(node.name.text, lookupName);
      } else if (ts.isBinaryExpression(node.initializer)) {
        const sourceVariable = getIdentifierName(node.initializer.left);
        if (sourceVariable && lookups.has(sourceVariable)) {
          lookups.set(node.name.text, lookups.get(sourceVariable));
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return lookups;
}

function findAttributeUsages(source) {
  const usages = [],
    sourceFile = ts.createSourceFile(
      'mapping.ts',
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

  function visit(node) {
    if (ts.isConditionalExpression(node)) {
      const usage = getTemplateAttributeUsage(node.whenTrue),
        variable = usage?.variable ?? getIdentifierName(node.condition);

      if (usage?.attribute && variable) usages.push({ variable, attribute: usage.attribute });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return usages;
}

export function validateMappingNames(filePath) {
  const source = readSource(filePath),
    lookups = findLookupVariables(source),
    warnings = [];

  for (const { variable, attribute } of findAttributeUsages(source)) {
    const figmaName = lookups.get(variable);
    if (!figmaName) continue;

    const normalizedFigmaName = normalizeName(figmaName);
    if (
      normalizedFigmaName === attribute ||
      normalizedAllowedNameMappings.has(mappingKey(figmaName, attribute))
    )
      continue;

    warnings.push(`Figma property "${figmaName}" is emitted as code attribute "${attribute}"`);
  }

  return [...new Set(warnings)];
}
