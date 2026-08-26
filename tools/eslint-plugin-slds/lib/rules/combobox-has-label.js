import {
  checkTemplateForLabel,
  hasAttribute,
  isNestedHtmlTemplate
} from '../label-rule-helpers.js';

const hasRawLabelAttribute = (attributes, attributeName) => {
  const escapedAttributeName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = attributes.match(
    new RegExp(`(?:^|\\s)${escapedAttributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i')
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
    // Join static template parts and insert a fixed placeholder for expressions.
    // This lets us still catch unlabeled comboboxes when other dynamic text is present,
    // and still treat dynamic aria-label values as labels because the quoted attribute stays intact.
    return node.quasis
      .map((quasi, index) => {
        const value = quasi.value.cooked ?? '';

        return index < node.expressions.length ? `${value}__EXPR__` : value;
      })
      .join('');
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
    return;
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
        if (isNestedHtmlTemplate(node, context)) {
          return;
        }

        checkTemplateForLabel({
          context,
          node,
          elementName: 'sl-combobox',
          hasLabel(element, analyzer, sourceCode) {
            return hasAttribute(element, analyzer, sourceCode, 'aria-label', 'aria-labelledby');
          }
        });
      },
      'AssignmentExpression[left.type="MemberExpression"][left.property.name="innerHTML"]'(node) {
        const rawHtml = getRawTemplateContent(node.right);

        if (!rawHtml || !/<sl-combobox/i.test(rawHtml)) {
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

        if (!rawHtml || !/<sl-combobox/i.test(rawHtml)) {
          return;
        }

        reportRawComboboxesWithoutLabel(rawHtml, rawHtmlArgument, context);
      }
    };
  }
};
