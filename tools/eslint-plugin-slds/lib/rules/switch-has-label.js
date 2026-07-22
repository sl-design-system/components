import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from 'eslint-plugin-lit-a11y/lib/utils/isLitHtmlTemplate.js';

const isNonEmptyAttributeValue = value => typeof value !== 'string' || value.trim() !== '';

const hasAttribute = (element, analyzer, sourceCode, ...attributeNames) => {
  return attributeNames.some(attributeName => {
    const value = analyzer.getAttributeValue(element, attributeName, sourceCode);

    return value !== null && isNonEmptyAttributeValue(value);
  });
};

const hasAttributeValue = (element, analyzer, sourceCode, attributeName, expectedValue) => {
  const value = analyzer.getAttributeValue(element, attributeName, sourceCode);

  if (value === null) {
    return false;
  }

  return typeof value === 'string' ? value.trim() === expectedValue : true;
};

const hasMeaningfulContent = (node, analyzer, sourceCode) => {
  if (node.type === 'text') {
    return node.data.trim() !== '';
  }

  if (node.type !== 'tag') {
    return true;
  }

  if (hasAttribute(node, analyzer, sourceCode, 'slot')) {
    return false;
  }

  return node.childNodes.some(child => hasMeaningfulContent(child, analyzer, sourceCode));
};

const hasLabelSlotChild = (formField, analyzer, sourceCode) => {
  return formField.childNodes.some(child => {
    if (child.type !== 'tag') {
      return false;
    }

    const isLabelSlot = hasAttributeValue(child, analyzer, sourceCode, 'slot', 'label');

    return (
      isLabelSlot &&
      child.childNodes.some(grandchild => hasMeaningfulContent(grandchild, analyzer, sourceCode))
    );
  });
};

const hasFormFieldLabel = (formField, analyzer, sourceCode) => {
  return (
    hasAttribute(formField, analyzer, sourceCode, 'label', '.label') ||
    hasLabelSlotChild(formField, analyzer, sourceCode)
  );
};

const hasSwitchLabel = (element, analyzer, sourceCode) => {
  return element.childNodes.some(child => hasMeaningfulContent(child, analyzer, sourceCode));
};

/** @type {import('eslint').Rule.RuleModule} */
export const switchHasLabel = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure sl-switch elements have text content, aria-label/aria-labelledby, or are inside a labeled sl-form-field',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      missingLabel:
        'sl-switch elements must have text content, aria-label or aria-labelledby, or be inside an sl-form-field with a label'
    }
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (!isHtmlTaggedTemplate(node, context)) {
          return;
        }

        const analyzer = TemplateAnalyzer.create(node),
          parentMap = new WeakMap();

        analyzer.traverse({
          enterElement(element, parent) {
            if (parent?.type === 'tag') {
              parentMap.set(element, parent);
            }

            if (element.name !== 'sl-switch') {
              return;
            }

            if (
              hasSwitchLabel(element, analyzer, context.sourceCode) ||
              hasAttribute(element, analyzer, context.sourceCode, 'aria-label', 'aria-labelledby')
            ) {
              return;
            }

            let ancestor = parentMap.get(element);

            while (ancestor && ancestor.name !== 'sl-form-field') {
              ancestor = parentMap.get(ancestor);
            }

            if (ancestor && hasFormFieldLabel(ancestor, analyzer, context.sourceCode)) {
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
