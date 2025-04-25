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
      // Look for tagged template expressions where the tag is 'html'
      TaggedTemplateExpression(node) {
        if (node.tag.type === 'Identifier' && node.tag.name === 'html') {
          // Get the raw template string
          const quasis = node.quasi.quasis;
          const rawTemplate = quasis.map(quasi => quasi.value.raw).join('${expr}');

          // Pattern to find all sl-button tags with their attributes and content
          const buttonPattern = /<sl-button([^>]*)>(.*?)<\/sl-button>/gs;
          let match;
          let emptyButtonCount = 0;

          // Check each button instance in the template
          while ((match = buttonPattern.exec(rawTemplate)) !== null) {
            const attributes = match[1] || '';
            const content = match[2].trim();

            // Check if button has accessibility attributes
            const hasAriaLabel = attributes.includes('aria-label');
            const hasAriaLabelledby = attributes.includes('aria-labelledby');

            // Skip if button has aria-label or aria-labelledby
            if (hasAriaLabel || hasAriaLabelledby) {
              continue;
            }

            // Button has direct content
            if (content.length > 0) {
              // Check if content is just empty elements
              if (content.match(/^<[^>]*>\s*<\/[^>]*>$/g) &&
                  !content.includes('<slot') &&
                  !content.includes('${expr}')) {
                emptyButtonCount++;
              }
            } else {
              // Empty button
              emptyButtonCount++;
            }
          }

          // Report an error for each empty button found
          for (let i = 0; i < emptyButtonCount; i++) {
            context.report({
              node,
              messageId: 'missingText'
            });
          }
        }
      }
    };
  }
};
