import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';
import { hasAccessibleName } from 'eslint-plugin-lit-a11y/lib/utils/hasAccessibleName.js';
import { hasTextContent, isElement, isTextContent } from '../utils.js';

/**
 * Whether the content of the button is just an icon. Mirrors the `icon-only` state in sl-button:
 * the content must be a single sl-icon, or a single element wrapping nothing but an sl-icon.
 */
function isIconOnly(element) {
  const nodes = element.children.filter(child => isElement(child) || isTextContent(child));

  if (nodes.length !== 1 || !isElement(nodes[0])) {
    return false;
  }

  const child = nodes[0],
    grandChildren = (child.children ?? []).filter(node => isElement(node) || isTextContent(node));

  return (
    child.name === 'sl-icon' || (grandChildren.length === 1 && grandChildren[0].name === 'sl-icon')
  );
}

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
        if (!isHtmlTaggedTemplate(node, context)) {
          return;
        }

        const analyzer = TemplateAnalyzer.create(node);

        // Collect the ids of elements labelled by an <sl-tooltip for="..."> in the same
        // template. A tooltip without type="description" labels its anchor at runtime
        // (via ariaLabelledByElements), so it counts as an accessible name at lint time.
        // `for` takes a space separated list of ids, so a single tooltip can label
        // several elements.
        const tooltipLabelledIds = new Set();
        analyzer.traverse({
          enterElement(element) {
            if (element.name === 'sl-tooltip') {
              const attribs = element.attribs ?? {},
                forIds = (attribs['for'] ?? '').trim().split(/\s+/).filter(Boolean);

              if ((attribs['type'] ?? 'label').trim() !== 'description') {
                forIds.forEach(id => tooltipLabelledIds.add(id));
              }
            }
          }
        });

        analyzer.traverse({
          enterElement(element) {
            if (element.name !== 'sl-button') {
              return;
            }

            // The `tooltip` attribute on sl-button provides the accessible label for icon-only
            // buttons at runtime, so it counts as an accessible name at lint time. For any other
            // button the tooltip becomes the description instead, and does not name the button.
            const attribs = element.attribs ?? {},
              hasTooltipLabel = (attribs['tooltip'] ?? '').trim() !== '' && isIconOnly(element),
              hasTooltipSibling = tooltipLabelledIds.has((attribs['id'] ?? '').trim());

            if (
              hasTextContent(element) ||
              hasAccessibleName(element) ||
              hasTooltipLabel ||
              hasTooltipSibling
            ) {
              return;
            }

            const loc =
              analyzer.resolveLocation(element.sourceCodeLocation.startTag, context.sourceCode) ||
              node.loc;

            if (loc) {
              context.report({ loc, messageId: 'missingText' });
            }
          }
        });
      }
    };
  }
};
