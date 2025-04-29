import { RuleTester } from 'eslint';
import { multilineHtmlTemplate } from '../../../lib/rules/multiline-html-template.js';

// Configure rule tester with flat config format for ESLint v9
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

// Run tests
ruleTester.run('multiline-html-template', multilineHtmlTemplate, {
  valid: [
    { code: "html`<h1>Hello world</h1>`;" },
    { code: "html`\n<h1>Hello world</h1>\n`;" },
    { code: "html`\n<sl-button>Click me</sl-button>\n`;" },
    { code: "someOtherTag`\nno newlines required`;" },
    { code: "html`<div>Single line content</div>`;" }
  ],
  invalid: [
    {
      code: "html`\n<sl-button></sl-button>`;",
      errors: [{ messageId: 'missingNewlineEnd' }],
      output: "html`\n<sl-button></sl-button>\n`;"
    },
    {
      code: "html`<sl-button>\n</sl-button>`;",
      errors: [{ messageId: 'missingNewlineStart' }, { messageId: 'missingNewlineEnd' }],
      output: "html`\n<sl-button>\n</sl-button>\n`;"
    },
    {
      code: "html`<sl-button>\n</sl-button>\n`;",
      errors: [{ messageId: 'missingNewlineStart' }],
      output: "html`\n<sl-button>\n</sl-button>\n`;"
    }
  ]
});
