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
      missingText: 'sl-button elements must have text content or aria-label for accessibility',
      mustBeAriaRelationLabel: "for the tooltip directive ariaRelation must be 'label'"
    }
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (!isHtmlTaggedTemplate(node, context)) {
          return;
        }

        // Tooltip with ariaRelation: 'label' variant
        const templateSource = context.sourceCode.getText(node),
          hasTooltip = /tooltip\s*\(/.test(templateSource),
          hasTooltipWithAriaRelationLabel =
            /tooltip\s*\([^)]*ariaRelation\s*:\s*['"]label['"]/.test(templateSource);

        const analyzer = TemplateAnalyzer.create(node);

        // Collect the ids of elements labelled by an <sl-tooltip for="..."> in the same
        // template. A tooltip without type="description" labels its anchor at runtime
        // (via ariaLabelledByElements), so it counts as an accessible name at lint time.
        const tooltipLabelledIds = new Set();
        analyzer.traverse({
          enterElement(element) {
            if (element.name === 'sl-tooltip') {
              const attribs = element.attribs ?? {},
                forId = (attribs['for'] ?? '').trim();

              if (forId && (attribs['type'] ?? 'label').trim() !== 'description') {
                tooltipLabelledIds.add(forId);
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
              hasTooltipWithAriaRelationLabel ||
              hasTooltipLabel ||
              hasTooltipSibling
            ) {
              return;
            }

            const loc =
              analyzer.resolveLocation(element.sourceCodeLocation.startTag, context.sourceCode) ||
              node.loc;

            if (loc) {
              if (hasTooltip && !hasTooltipWithAriaRelationLabel) {
                context.report({ loc, messageId: 'mustBeAriaRelationLabel' });
              } else if (!hasAccessibleName(element)) {
                context.report({ loc, messageId: 'missingText' });
              }
            }
          }
        });
      }
    };
  }
};
