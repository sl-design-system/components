import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';

/** @type {import('eslint').Rule.RuleModule} */
export const singlelineHtmlTemplateTrimmed = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce trimmed whitespace in single-line HTML template literals',
      recommended: true,
      url: null
    },
    fixable: 'code',
    schema: [],
    messages: {
      unnecessaryWhitespace: 'Single-line HTML template literals should not have unnecessary whitespace at the beginning or end'
    }
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const { quasi } = node;
          const { quasis } = quasi;

          // Get the raw template content
          const templateContent = quasis.map(q => q.value.raw).join('');

          // Skip multiline templates - this rule only applies to single-line templates
          if (templateContent.includes('\n')) {
            return;
          }

          // Skip templates that only contain expressions with spaces between them
          // For example: html`${firstName} ${lastName}`
          if (templateContent.trim() === '' && quasi.expressions.length > 0) {
            return;
          }

          // Check if the template has leading or trailing whitespace
          const hasSurroundingWhitespace = /^\s+|\s+$/.test(templateContent);

          if (hasSurroundingWhitespace) {
            const templateText = context.sourceCode.getText(quasi);

            context.report({
              node,
              messageId: 'unnecessaryWhitespace',
              fix(fixer) {
                // Replace the template content with trimmed version
                // We need to preserve the backticks and expressions
                const newTemplateText = templateText.replace(/`\s+/, '`').replace(/\s+`$/, '`');
                return fixer.replaceText(quasi, newTemplateText);
              }
            });
          }
        }
      }
    };
  }
};