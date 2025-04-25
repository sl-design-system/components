/**
 * @fileoverview Tests for example-rule
 * @author SLDS Team
 */

import { RuleTester } from 'eslint';
import { exampleRule } from '../../../lib/rules/example-rule.js';

// Configure rule tester with flat config format for ESLint v9
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

// Run tests
ruleTester.run('example-rule', exampleRule, {
  valid: [
    // Valid test cases - these should pass the rule
    "const validString = 'this is fine';",
    "const anotherValidString = 'not a violation';"
  ],
  invalid: [
    // Invalid test cases - these should trigger the rule
    {
      code: "const invalidString = 'example-violation';",
      errors: [
        {
          message: 'Avoid using the string "example-violation"',
          type: 'Literal'
        }
      ]
    },
    {
      code: "function testFunction() { return 'example-violation'; }",
      errors: [
        {
          message: 'Avoid using the string "example-violation"',
          type: 'Literal'
        }
      ]
    }
  ]
});
