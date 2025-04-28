import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';

/** @type {import('eslint').Rule.RuleModule} */
export const multilineHtmlTemplate = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce proper formatting for multiline HTML template literals',
      recommended: true,
      url: null
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingNewlineStart: 'Multiline HTML template literals should have a newline after the opening backtick',
      missingNewlineEnd: 'Multiline HTML template literals should have a newline before the closing backtick'
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

          // Check if template spans multiple lines
          if (templateContent.includes('\n')) {
            const sourceCode = context.getSourceCode();
            const templateText = sourceCode.getText(quasi);

            // Check if there's a newline after the opening backtick
            const hasNewlineAfterBacktick = /^`\s*\n/.test(templateText);

            // Check if there's a newline before the closing backtick
            const hasNewlineBeforeBacktick = /\n\s*`$/.test(templateText);

            if (!hasNewlineAfterBacktick && !hasNewlineBeforeBacktick) {
              // Both newlines are missing
              context.report({
                node,
                messageId: 'missingNewlineStart',
                fix(fixer) {
                  // Add newlines after the opening backtick and before the closing backtick
                  return fixer.replaceText(
                    quasi,
                    templateText.replace(/^`/, '`\n').replace(/`$/, '\n`')
                  );
                }
              });

              context.report({
                node,
                messageId: 'missingNewlineEnd'
                // No fix here, it's handled in the combined fix above
              });
            } else if (!hasNewlineAfterBacktick) {
              // Only missing newline after opening backtick
              context.report({
                node,
                messageId: 'missingNewlineStart',
                fix(fixer) {
                  // Add a newline after the opening backtick
                  return fixer.replaceText(
                    quasi,
                    templateText.replace(/^`/, '`\n')
                  );
                }
              });
            } else if (!hasNewlineBeforeBacktick) {
              // Only missing newline before closing backtick
              context.report({
                node,
                messageId: 'missingNewlineEnd',
                fix(fixer) {
                  // Add a newline before the closing backtick
                  return fixer.replaceText(
                    quasi,
                    templateText.replace(/`$/, '\n`')
                  );
                }
              });
            }
          }
        }
      }
    };
  }
};