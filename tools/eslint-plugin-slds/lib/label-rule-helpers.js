import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';

const EXPRESSION_PLACEHOLDER_REGEX = /^\{\{__Q:(\d+)__\}\}$/,
  labeledInterpolationFactoryNamesCache = new WeakMap();

const traverseNode = (node, visitor, parent = null) => {
  if (!node || typeof node.type !== 'string') {
    return;
  }

  if (visitor(node, parent) === false) {
    return;
  }

  Object.entries(node).forEach(([key, value]) => {
    if (key === 'loc' || key === 'range' || key === 'parent') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(child => traverseNode(child, visitor, node));
    } else if (value && typeof value.type === 'string') {
      traverseNode(value, visitor, node);
    }
  });
};

const getPropertyName = key => {
  if (!key) {
    return undefined;
  }

  if (key.type === 'Identifier') {
    return key.name;
  }

  if (key.type === 'Literal' && typeof key.value === 'string') {
    return key.value;
  }

  return undefined;
};

const getExpressionFromPlaceholder = (textNode, templateNode) => {
  const match = textNode.data.trim().match(EXPRESSION_PLACEHOLDER_REGEX);

  if (!match) {
    return null;
  }

  return templateNode.quasi.expressions[Number(match[1])] ?? null;
};

const collectRenderableFactoryNames = (expression, names = new Set()) => {
  if (!expression) {
    return names;
  }

  switch (expression.type) {
    case 'Identifier':
      names.add(expression.name);
      break;
    case 'CallExpression':
      if (expression.callee.type === 'Identifier') {
        names.add(expression.callee.name);
      } else {
        collectRenderableFactoryNames(expression.callee, names);
      }
      break;
    case 'ChainExpression':
      collectRenderableFactoryNames(expression.expression, names);
      break;
    case 'LogicalExpression':
      collectRenderableFactoryNames(expression.left, names);
      collectRenderableFactoryNames(expression.right, names);
      break;
    case 'ConditionalExpression':
      collectRenderableFactoryNames(expression.consequent, names);
      collectRenderableFactoryNames(expression.alternate, names);
      break;
    case 'SequenceExpression':
      collectRenderableFactoryNames(expression.expressions.at(-1), names);
      break;
    case 'AwaitExpression':
      collectRenderableFactoryNames(expression.argument, names);
      break;
    default:
      break;
  }

  return names;
};

const collectDirectNestedHtmlTemplates = (expression, context) => {
  const templates = [];

  traverseNode(expression, node => {
    if (
      node !== expression &&
      node.type === 'TaggedTemplateExpression' &&
      isHtmlTaggedTemplate(node, context)
    ) {
      templates.push(node);
      return false;
    }

    return true;
  });

  return templates;
};

const matchesBoundFactoryName = (parent, valueNode, names) => {
  if (!parent) {
    return false;
  }

  if (parent.type === 'Property' && parent.value === valueNode) {
    const propertyName = getPropertyName(parent.key);

    return propertyName ? names.has(propertyName) : false;
  }

  if (
    parent.type === 'VariableDeclarator' &&
    parent.init === valueNode &&
    parent.id.type === 'Identifier'
  ) {
    return names.has(parent.id.name);
  }

  if (parent.type === 'AssignmentExpression' && parent.right === valueNode) {
    if (parent.left.type === 'Identifier') {
      return names.has(parent.left.name);
    }

    if (
      parent.left.type === 'MemberExpression' &&
      !parent.left.computed &&
      parent.left.property.type === 'Identifier'
    ) {
      return names.has(parent.left.property.name);
    }
  }

  return false;
};

const isWithinLabeledFormField = (parent, parentMap, analyzer, sourceCode) => {
  let ancestor = parent?.type === 'tag' ? parent : undefined;

  while (ancestor) {
    if (ancestor.name === 'sl-form-field' && hasFormFieldLabel(ancestor, analyzer, sourceCode)) {
      return true;
    }

    ancestor = parentMap.get(ancestor);
  }

  return false;
};

const getLabeledInterpolationFactoryNames = context => {
  const cached = labeledInterpolationFactoryNamesCache.get(context.sourceCode.ast);

  if (cached) {
    return cached;
  }

  const names = new Set();

  traverseNode(context.sourceCode.ast, node => {
    if (node.type !== 'TaggedTemplateExpression' || !isHtmlTaggedTemplate(node, context)) {
      return true;
    }

    const analyzer = TemplateAnalyzer.create(node),
      parentMap = new WeakMap();

    analyzer.traverse({
      enterElement(element, parent) {
        if (parent?.type === 'tag') {
          parentMap.set(element, parent);
        }
      },
      enterTextNode(textNode, parent) {
        const expression = getExpressionFromPlaceholder(textNode, node);

        if (
          !expression ||
          !isWithinLabeledFormField(parent, parentMap, analyzer, context.sourceCode)
        ) {
          return;
        }

        collectRenderableFactoryNames(expression).forEach(name => names.add(name));
      }
    });

    return false;
  });

  labeledInterpolationFactoryNamesCache.set(context.sourceCode.ast, names);

  return names;
};

const inheritsLabeledFormFieldContext = (node, context) => {
  const names = getLabeledInterpolationFactoryNames(context);

  if (!names.size) {
    return false;
  }

  const ancestors = context.sourceCode.getAncestors(node);

  for (let index = ancestors.length - 1; index >= 0; index -= 1) {
    const ancestor = ancestors[index];

    if (ancestor.type === 'ArrowFunctionExpression' || ancestor.type === 'FunctionExpression') {
      return matchesBoundFactoryName(ancestors[index - 1], ancestor, names);
    }
  }

  return matchesBoundFactoryName(ancestors.at(-1), node, names);
};

export const isNonEmptyAttributeValue = value => typeof value !== 'string' || value.trim() !== '';

export const hasAttribute = (element, analyzer, sourceCode, ...attributeNames) => {
  return attributeNames.some(attributeName => {
    const value = analyzer.getAttributeValue(element, attributeName, sourceCode);

    return value !== null && isNonEmptyAttributeValue(value);
  });
};

export const hasAttributeValue = (element, analyzer, sourceCode, attributeName, expectedValue) => {
  const value = analyzer.getAttributeValue(element, attributeName, sourceCode);

  if (value === null) {
    return false;
  }

  return typeof value === 'string' ? value.trim() === expectedValue : true;
};

export const hasMeaningfulContent = (node, analyzer, sourceCode) => {
  if (node.type === 'text') {
    return node.data.trim() !== '';
  }

  if (node.type !== 'tag') {
    return true;
  }

  if (hasAttribute(node, analyzer, sourceCode, 'slot')) {
    return false;
  }

  return node.childNodes.some(child => hasMeaningfulContent(child, analyzer, sourceCode));
};

export const hasLabelSlotChild = (formField, analyzer, sourceCode) => {
  return formField.childNodes.some(child => {
    if (child.type !== 'tag') {
      return false;
    }

    const isLabelSlot = hasAttributeValue(child, analyzer, sourceCode, 'slot', 'label');

    return (
      isLabelSlot &&
      child.childNodes.some(grandchild => hasMeaningfulContent(grandchild, analyzer, sourceCode))
    );
  });
};

const hasDirectSlLabelChild = (formField, analyzer, sourceCode) => {
  return formField.childNodes.some(child => {
    if (child.type !== 'tag' || child.name !== 'sl-label') {
      return false;
    }

    return child.childNodes.some(grandchild =>
      hasMeaningfulContent(grandchild, analyzer, sourceCode)
    );
  });
};

export const hasFormFieldLabel = (formField, analyzer, sourceCode) => {
  return (
    hasAttribute(formField, analyzer, sourceCode, 'label', '.label') ||
    hasLabelSlotChild(formField, analyzer, sourceCode) ||
    hasDirectSlLabelChild(formField, analyzer, sourceCode)
  );
};

export const isNestedHtmlTemplate = (node, context) => {
  return context.sourceCode
    .getAncestors(node)
    .some(
      ancestor =>
        ancestor.type === 'TaggedTemplateExpression' && isHtmlTaggedTemplate(ancestor, context)
    );
};

export const checkTemplateForLabel = ({
  context,
  node,
  elementName,
  hasLabel,
  inheritedFormFieldLabel = inheritsLabeledFormFieldContext(node, context),
  messageId = 'missingLabel'
}) => {
  if (!isHtmlTaggedTemplate(node, context)) {
    return;
  }

  const analyzer = TemplateAnalyzer.create(node),
    parentMap = new WeakMap();

  analyzer.traverse({
    enterElement(element, parent) {
      if (parent?.type === 'tag') {
        parentMap.set(element, parent);
      }

      if (element.name !== elementName) {
        return;
      }

      if (hasLabel(element, analyzer, context.sourceCode) || inheritedFormFieldLabel) {
        return;
      }

      let ancestor = parentMap.get(element);

      while (ancestor && ancestor.name !== 'sl-form-field') {
        ancestor = parentMap.get(ancestor);
      }

      if (ancestor && hasFormFieldLabel(ancestor, analyzer, context.sourceCode)) {
        return;
      }

      const loc =
        analyzer.resolveLocation(element.sourceCodeLocation.startTag, context.sourceCode) ||
        node.loc;

      if (loc) {
        context.report({ loc, messageId });
      }
    },
    enterTextNode(textNode, parent) {
      const expression = getExpressionFromPlaceholder(textNode, node);

      if (!expression) {
        return;
      }

      const nestedTemplates = collectDirectNestedHtmlTemplates(expression, context);

      if (!nestedTemplates.length) {
        return;
      }

      const nestedInheritedFormFieldLabel =
        inheritedFormFieldLabel ||
        isWithinLabeledFormField(parent, parentMap, analyzer, context.sourceCode);

      nestedTemplates.forEach(templateNode => {
        checkTemplateForLabel({
          context,
          node: templateNode,
          elementName,
          hasLabel,
          inheritedFormFieldLabel: nestedInheritedFormFieldLabel,
          messageId
        });
      });
    }
  });
};
