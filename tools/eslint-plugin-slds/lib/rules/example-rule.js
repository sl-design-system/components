/**
 * @fileoverview Example rule for SLDS components
 * @author SLDS Team
 */

/** @type {import('eslint').Rule.RuleModule} */
export const exampleRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Example rule for SLDS components',
      recommended: true
    },
    fixable: null,
    schema: [] // no options
  },
  create(context) {
    return {
      // Example visitor functions for AST nodes
      // This is just a placeholder - replace with actual rule logic
      Literal(node) {
        if (node.value === 'example-violation') {
          context.report({
            node,
            message: 'Avoid using the string "example-violation"'
          });
        }
      }
    };
  }
};
