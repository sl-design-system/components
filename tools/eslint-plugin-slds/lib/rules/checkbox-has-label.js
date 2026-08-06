import {
  checkTemplateForLabel,
  hasAttribute,
  hasMeaningfulContent,
  isNestedHtmlTemplate
} from '../label-rule-helpers.js';

const hasCheckboxLabel = (element, analyzer, sourceCode) => {
  return element.childNodes.some(child => hasMeaningfulContent(child, analyzer, sourceCode));
};

const collectTooltipLabelledIds = analyzer => {
  const tooltipLabelledIds = new Set();

  analyzer.traverse({
    enterElement(element) {
      if (element.name !== 'sl-tooltip') {
        return;
      }

      const attribs = element.attribs ?? {},
        forIds = (attribs['for'] ?? '').trim().split(/\s+/).filter(Boolean);

      if ((attribs['type'] ?? 'label').trim() !== 'description') {
        forIds.forEach(id => tooltipLabelledIds.add(id));
      }
    }
  });

  return tooltipLabelledIds;
};

/** @type {import('eslint').Rule.RuleModule} */
export const checkboxHasLabel = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure sl-checkbox elements have text content, aria-label/aria-labelledby, or are inside a labeled sl-form-field',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingLabel:
        'sl-checkbox elements must have text content, aria-label or aria-labelledby, or be inside a labeled sl-form-field with a label'
    }
  },
  create(context) {
    const tooltipLabelledIdsByAnalyzer = new WeakMap();

    const getTooltipLabelledIds = analyzer => {
      const cachedIds = tooltipLabelledIdsByAnalyzer.get(analyzer);

      if (cachedIds) {
        return cachedIds;
      }

      const tooltipLabelledIds = collectTooltipLabelledIds(analyzer);
      tooltipLabelledIdsByAnalyzer.set(analyzer, tooltipLabelledIds);

      return tooltipLabelledIds;
    };

    return {
      TaggedTemplateExpression(node) {
        if (isNestedHtmlTemplate(node, context)) {
          return;
        }

        checkTemplateForLabel({
          context,
          node,
          elementName: 'sl-checkbox',
          hasLabel(element, analyzer, sourceCode) {
            const elementId = (analyzer.getAttributeValue(element, 'id', sourceCode) ?? '').trim();
            const tooltipLabelledIds = getTooltipLabelledIds(analyzer);

            return (
              hasCheckboxLabel(element, analyzer, sourceCode) ||
              hasAttribute(element, analyzer, sourceCode, 'aria-label', 'aria-labelledby') ||
              (elementId !== '' && tooltipLabelledIds.has(elementId))
            );
          }
        });
      }
    };
  }
};
