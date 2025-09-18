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
    // Returns only the element's start tag text (up to and including '>') without scanning past it,
    // used to detect inline tooltip config safely.
    const getStartTagSlice = (element) => {
      const startTagLocation = element.sourceCodeLocation?.startTag;

      if (!startTagLocation) {
        return '';
      }

      const text = context.sourceCode.text;

      let i = startTagLocation.startOffset;
      while (i < text.length && text[i] !== '>') {
        i++;
      }
      if (text[i] === '>') { // include '>'
        i++;
      }
      return text.slice(startTagLocation.startOffset, i);
    }

    const hasTooltipWithLabel = (element) => {
      const tag = getStartTagSlice(element);

      if (!tag || !tag.includes('tooltip')) {
        return false;
      }

      // Match when 'tooltip' appears before `ariaRelation: 'label'` (any chars between).
      return /tooltip[\s\S]*?ariaRelation\s*:\s*['"]label['"]/.test(tag);
    }

    const hasExplicitAriaRelationLabel = (element) => {
      return element.attributes?.some(a => a.name === 'ariaRelation' && a.value === 'label');
    }

    return {
      TaggedTemplateExpression(node) {
        if (!isHtmlTaggedTemplate(node, context)) {
          return;
        }

        const analyzer = TemplateAnalyzer.create(node);

        analyzer.traverse({
          enterElement(element) {
            if (element.name !== 'sl-button') {
              return;
            }

            if (
              hasTextContent(element) ||
              hasAccessibleName(element) ||
              hasExplicitAriaRelationLabel(element) ||
              hasTooltipWithLabel(element)
            ) {
              return;
            }

            const loc = analyzer.resolveLocation(
              element.sourceCodeLocation.startTag,
              context.sourceCode
            ) || node.loc;

            if (loc) {
              context.report({ loc, messageId: 'missingText' });
            }
          }
        });
      }
    };
  }
};
