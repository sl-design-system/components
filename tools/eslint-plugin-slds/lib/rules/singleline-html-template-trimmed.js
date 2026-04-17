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
          const firstQuasi = quasis[0]?.value.raw ?? '';
          const lastQuasi = quasis.at(-1)?.value.raw ?? '';

          // Skip multiline templates - this rule only applies to single-line templates
          if (quasis.some(templateElement => templateElement.value.raw.includes('\n'))) {
            return;
          }

          // Only the outermost template segments can introduce unnecessary
          // surrounding whitespace. Inner quasis may legitimately contain
          // spaces between expressions, e.g. html`${first} ${last}`.
          const hasLeadingWhitespace = /^\s+/.test(firstQuasi);
          const hasTrailingWhitespace = /\s+$/.test(lastQuasi);

          if (hasLeadingWhitespace || hasTrailingWhitespace) {
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
