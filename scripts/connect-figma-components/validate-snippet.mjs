import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..', '..'),
  // Attributes every element may have, regardless of the component's own API.
  globalAttributes = new Set([
    'slot',
    'class',
    'style',
    'id',
    'part',
    'hidden',
    'role',
    'tabindex'
  ]),
  isGlobalAttribute = name =>
    globalAttributes.has(name) || name.startsWith('aria-') || name.startsWith('data-');

let declarations = null,
  tagAttributes = null,
  typeAliasValues = null;

function getAttributeMap(declaration) {
  const attributes = new Map();
  for (const member of declaration.members ?? []) {
    if (member.attribute) attributes.set(member.attribute, member.type?.text);
  }

  return attributes;
}

function loadDeclarations() {
  if (declarations) return declarations;

  declarations = new Map();

  const manifests = globSync(resolve(repoRoot, 'packages/components/*/custom-elements.json'));

  for (const manifestPath of manifests) {
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    } catch {
      continue;
    }

    for (const module of manifest.modules ?? []) {
      for (const declaration of module.declarations ?? []) {
        if (declaration.name) declarations.set(declaration.name, declaration);
      }
    }
  }

  return declarations;
}

function getInheritedAttributeMap(declaration, visited = new Set()) {
  const attributes = new Map();

  if (declaration.superclass?.name && !visited.has(declaration.superclass.name)) {
    const superclass = loadDeclarations().get(declaration.superclass.name);
    if (superclass) {
      visited.add(declaration.superclass.name);
      for (const [name, type] of getInheritedAttributeMap(superclass, visited)) {
        attributes.set(name, type);
      }
    }
  }

  for (const [name, type] of getAttributeMap(declaration)) {
    attributes.set(name, type);
  }

  return attributes;
}

function loadTagAttributes() {
  if (tagAttributes) return tagAttributes;

  tagAttributes = new Map();

  for (const declaration of loadDeclarations().values()) {
    if (declaration.tagName)
      tagAttributes.set(declaration.tagName, getInheritedAttributeMap(declaration));
  }

  return tagAttributes;
}

// Custom Elements Manifest doesn't resolve named union type aliases (e.g. `ButtonFill`), so
// scan the component source for `export type <Name> = '...' | '...';` declarations to resolve them.
function loadTypeAliasValues() {
  if (typeAliasValues) return typeAliasValues;

  typeAliasValues = new Map();

  const files = globSync(resolve(repoRoot, 'packages/components/*/src/*.ts'));
  const aliasRe = /export type (\w+) =\s*((?:'[^']*'\s*\|?\s*)+);/g;

  for (const file of files) {
    let content;
    try {
      content = readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    for (const match of content.matchAll(aliasRe)) {
      const [, name, union] = match,
        values = [...union.matchAll(/'([^']*)'/g)].map(m => m[1]);

      typeAliasValues.set(name, values);
    }
  }

  return typeAliasValues;
}

function resolveEnumValues(typeText) {
  if (!typeText) return null;

  const inline = [...typeText.matchAll(/'([^']*)'/g)].map(m => m[1]);
  if (inline.length > 0) return inline;

  const alias = typeText.replace(/\s*\|\s*undefined/, '').trim();
  return loadTypeAliasValues().get(alias) ?? null;
}

function parseElements(html) {
  const elements = [],
    tagRe = /<([a-z][a-z0-9-]*)((?:\s+[^<>]*?)?)\/?>/g;

  for (const match of html.matchAll(tagRe)) {
    const [, tag, rawAttributes] = match,
      attributes = new Map();

    for (const attrMatch of rawAttributes.matchAll(/([a-zA-Z-]+)(?:="([^"]*)")?/g)) {
      const [, name, value] = attrMatch;
      attributes.set(name, value ?? '');
    }

    elements.push({ tag, attributes });
  }

  return elements;
}

/**
 * Validates that a rendered mapping snippet only uses attributes that exist on the real design
 * system component, and that their values match the component's declared type. Returns an array of
 * human-readable issue strings (empty if the snippet is valid).
 */
export function validateSnippet(html) {
  const attributesByTag = loadTagAttributes(),
    issues = [];

  for (const { tag, attributes } of parseElements(html)) {
    if (!tag.startsWith('sl-')) continue;

    const knownAttributes = attributesByTag.get(tag);
    if (!knownAttributes) {
      issues.push(`Unknown component <${tag}>: not found in package custom-elements.json files`);
      continue;
    }

    for (const [name, value] of attributes) {
      if (isGlobalAttribute(name)) continue;

      if (!knownAttributes.has(name)) {
        issues.push(`<${tag}> has no property/attribute "${name}" (renamed, removed, or typo?)`);
        continue;
      }

      const typeText = knownAttributes.get(name);

      if (typeText?.startsWith('boolean') && value !== '') {
        issues.push(
          `<${tag} ${name}="${value}"> is a boolean attribute and shouldn't have a value`
        );
        continue;
      }

      const enumValues = resolveEnumValues(typeText);
      if (enumValues && value !== '' && !enumValues.includes(value)) {
        issues.push(
          `<${tag} ${name}="${value}"> is not a valid value. Expected one of: ${enumValues.join(', ')}`
        );
      }
    }
  }

  return issues;
}
