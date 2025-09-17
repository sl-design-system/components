import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';
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
              // console.log('element', element.name);
              if (element.name === 'sl-button') {
                // const hasAriaRelationLabel =
                //   element.attributes?.some(
                //     attr => attr.name === 'ariaRelation' && attr.value === 'label'
                //   );

                const hasAriaRelationLabel = (
                  element.attributes?.some(attr => attr.name === 'ariaRelation' && attr.value === 'label')
                  ||
                  (() => {
                    if (!element.sourceCodeLocation?.startTag) return false;
                    const { startOffset, endOffset } = element.sourceCodeLocation.startTag;
                    const startTagSource = context.sourceCode.text.slice(startOffset, endOffset);
                    return /ariaRelation\s*:\s*['"]label['"]/.test(startTagSource);
                  })()
                );

                console.log('hasAriaRelationLabel', hasAriaRelationLabel);

                if (hasTextContent(element) || hasAccessibleName(element) || hasAriaRelationLabel) {
                  return;
                }

                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    context.sourceCode,
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
