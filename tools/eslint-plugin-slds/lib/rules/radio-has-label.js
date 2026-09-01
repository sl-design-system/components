import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';

const hasMeaningfulContent = (node, analyzer, sourceCode) => {
  if (node.type === 'text') {
    return node.data.trim() !== '';
  }

  if (node.type !== 'tag') {
    return true;
  }

  if (analyzer.getAttributeValue(node, 'slot', sourceCode) !== null) {
    return false;
  }

  // A bare default `<slot>` re-projects the host's light DOM content, which is assumed
  // to provide an accessible name, so treat it as meaningful even though it has no children.
  if (node.name === 'slot' && analyzer.getAttributeValue(node, 'name', sourceCode) === null) {
    return true;
  }

  return node.childNodes.some(child => hasMeaningfulContent(child, analyzer, sourceCode));
};

const hasRadioLabel = (element, analyzer, sourceCode) => {
  return element.childNodes.some(child => hasMeaningfulContent(child, analyzer, sourceCode));
};

/** @type {import('eslint').Rule.RuleModule} */
export const radioHasLabel = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure sl-radio elements have text content for accessibility',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingLabel: 'sl-radio elements must have text content for accessibility'
    }
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (!isHtmlTaggedTemplate(node, context)) {
          return;
        }

        const analyzer = TemplateAnalyzer.create(node);

        analyzer.traverse({
          enterElement(element) {
            if (element.name !== 'sl-radio') {
              return;
            }

            if (hasRadioLabel(element, analyzer, context.sourceCode)) {
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
      }
    };
  }
};
