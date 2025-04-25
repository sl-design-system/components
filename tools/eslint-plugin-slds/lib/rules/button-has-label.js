import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';
import { getContextSourceCode } from 'eslint-plugin-lit-a11y/lib/utils/getContextSourceCode.js';
import { hasAccessibleName } from 'eslint-plugin-lit-a11y/lib/utils/hasAccessibleName.js';
import { hasTextContent } from '../utils.js';

/** @type {import('eslint').Rule.RuleModule} */
export const buttonHasLabel = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure sl-button elements have a label for accessibility',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingText: 'sl-button elements must have text content or aria-label for accessibility'
    }
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (element.name === 'sl-button') {
                if (hasTextContent(element) || hasAccessibleName(element)) {
                  return;
                }

                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({ loc, messageId: 'missingText' });
                }
              }
            }
          });
        }
      }
    };
  }
};
