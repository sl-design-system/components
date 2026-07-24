import {
  checkTemplateForLabel,
  hasAttribute,
  hasMeaningfulContent,
  isNestedHtmlTemplate
} from '../label-rule-helpers.js';

const hasCheckboxLabel = (element, analyzer, sourceCode) => {
  return element.childNodes.some(child => hasMeaningfulContent(child, analyzer, sourceCode));
};

/** @type {import('eslint').Rule.RuleModule} */
export const checkboxHasLabel = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure sl-checkbox elements have text content, aria-label/aria-labelledby, or are inside a labeled sl-form-field',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingLabel:
        'sl-checkbox elements must have text content, aria-label or aria-labelledby, or be inside a labeled sl-form-field with a label'
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
          elementName: 'sl-checkbox',
          hasLabel(element, analyzer, sourceCode) {
            return (
              hasCheckboxLabel(element, analyzer, sourceCode) ||
              hasAttribute(element, analyzer, sourceCode, 'aria-label', 'aria-labelledby')
            );
          }
        });
      }
    };
  }
};
