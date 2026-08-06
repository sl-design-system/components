import {
  checkTemplateForLabel,
  hasAttribute,
  isNestedHtmlTemplate
} from '../label-rule-helpers.js';

/** @type {import('eslint').Rule.RuleModule} */
export const selectHasLabel = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure sl-select elements have aria-label/aria-labelledby or are inside a labeled sl-form-field',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingLabel:
        'sl-select elements must have aria-label or aria-labelledby, or be inside an sl-form-field with a label'
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
          elementName: 'sl-select',
          hasLabel(element, analyzer, sourceCode) {
            return hasAttribute(element, analyzer, sourceCode, 'aria-label', 'aria-labelledby');
          }
        });
      }
    };
  }
};
