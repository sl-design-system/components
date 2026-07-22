import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';

const isNonEmptyAttributeValue = value => typeof value !== 'string' || value.trim() !== '';

const hasAttribute = (element, analyzer, sourceCode, ...attributeNames) => {
  return attributeNames.some(attributeName => {
    const value = analyzer.getAttributeValue(element, attributeName, sourceCode);

    return value !== null && isNonEmptyAttributeValue(value);
  });
};

const hasAttributeValue = (element, analyzer, sourceCode, attributeName, expectedValue) => {
  const value = analyzer.getAttributeValue(element, attributeName, sourceCode);

  if (value === null) {
    return false;
  }

  return typeof value === 'string' ? value.trim() === expectedValue : true;
};

const hasMeaningfulContent = (node, analyzer, sourceCode) => {
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

const hasLabelSlotChild = (formField, analyzer, sourceCode) => {
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

const hasFormFieldLabel = (formField, analyzer, sourceCode) => {
  return (
    hasAttribute(formField, analyzer, sourceCode, 'label', '.label') ||
    hasLabelSlotChild(formField, analyzer, sourceCode)
  );
};

const hasRawLabelAttribute = (attributes, attributeName) => {
  const match = attributes.match(
    new RegExp(`${attributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i')
  );

  if (!match) {
    return false;
  }

  const value = match[1] ?? match[2] ?? '';

  return value.trim() !== '';
};

const getRawTemplateContent = node => {
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }

  if (node.type === 'TemplateLiteral') {
    // Join static parts and ignore expressions to support typical innerHTML templates.
    return node.quasis.map(quasi => quasi.value.cooked ?? '').join('');
  }

  return null;
};

const reportRawComboboxesWithoutLabel = (rawHtml, reportNode, context) => {
  const comboboxRegex = /<sl-combobox\b([^>]*)>/gi;
  let match;

  while ((match = comboboxRegex.exec(rawHtml)) !== null) {
    const attributes = match[1] ?? '';

    if (
      hasRawLabelAttribute(attributes, 'aria-label') ||
      hasRawLabelAttribute(attributes, 'aria-labelledby')
    ) {
      continue;
    }

    context.report({ node: reportNode, messageId: 'missingLabel' });
  }
};

/** @type {import('eslint').Rule.RuleModule} */
export const comboboxHasLabel = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure sl-combobox elements have aria-label/aria-labelledby or are inside a labeled sl-form-field',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingLabel:
        'sl-combobox elements must have aria-label or aria-labelledby, or be inside an sl-form-field with a label'
    }
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
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

            if (element.name !== 'sl-combobox') {
              return;
            }

            if (
              hasAttribute(element, analyzer, context.sourceCode, 'aria-label', 'aria-labelledby')
            ) {
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
              context.report({ loc, messageId: 'missingLabel' });
            }
          }
        });
      },
      'AssignmentExpression[left.type="MemberExpression"][left.property.name="innerHTML"]'(node) {
        const rawHtml = getRawTemplateContent(node.right);

        if (!rawHtml || !rawHtml.includes('<sl-combobox')) {
          return;
        }

        reportRawComboboxesWithoutLabel(rawHtml, node.right, context);
      },
      'CallExpression[callee.type="MemberExpression"][callee.property.name="insertAdjacentHTML"]'(
        node
      ) {
        const rawHtmlArgument = node.arguments[1];

        if (!rawHtmlArgument) {
          return;
        }

        const rawHtml = getRawTemplateContent(rawHtmlArgument);

        if (!rawHtml || !rawHtml.includes('<sl-combobox')) {
          return;
        }

        reportRawComboboxesWithoutLabel(rawHtml, rawHtmlArgument, context);
      }
    };
  }
};
