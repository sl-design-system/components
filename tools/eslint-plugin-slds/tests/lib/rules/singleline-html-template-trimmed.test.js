import { RuleTester } from 'eslint';
import { singlelineHtmlTemplateTrimmed } from '../../../lib/rules/singleline-html-template-trimmed.js';

// Configure rule tester with flat config format for ESLint v9
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

// Run tests
ruleTester.run('singleline-html-template-trimmed', singlelineHtmlTemplateTrimmed, {
  valid: [
    { code: "html`<h1>Hello world</h1>`;" },
    { code: "html`<sl-button>Click me</sl-button>`;" },
    { code: "html`<div>Single line content</div>`;" },
    { code: "someOtherTag` Space is allowed here `;" },
    { code: "html`\n<h1>Hello world</h1>\n`;" },
    { code: "html`<h1>\nHello world\n</h1>`;" },
    { code: "html`${firstName} ${lastName}`" },
    { code: "html`${study} &middot; ${perStudy[0].schoolPeriodCode}`;" },
    { code: "html`${prefix}<span>content</span>${suffix}`;" }
  ],
  invalid: [
    {
      code: "html` <h1>Hello world</h1>`;" ,
      errors: [{ messageId: 'unnecessaryWhitespace' }],
      output: "html`<h1>Hello world</h1>`;"
    },
    {
      code: "html`<h1>Hello world</h1> `;" ,
      errors: [{ messageId: 'unnecessaryWhitespace' }],
      output: "html`<h1>Hello world</h1>`;"
    },
    {
      code: "html` <h1>Hello world</h1> `;" ,
      errors: [{ messageId: 'unnecessaryWhitespace' }],
      output: "html`<h1>Hello world</h1>`;"
    },
    {
      code: "html`   <sl-button>Click me</sl-button>   `;" ,
      errors: [{ messageId: 'unnecessaryWhitespace' }],
      output: "html`<sl-button>Click me</sl-button>`;"
    },
    {
      code: "html` ${firstName}`;",
      errors: [{ messageId: 'unnecessaryWhitespace' }],
      output: "html`${firstName}`;"
    },
    {
      code: "html`${lastName} `;",
      errors: [{ messageId: 'unnecessaryWhitespace' }],
      output: "html`${lastName}`;"
    },
    {
      code: "html` ${firstName} ${lastName} `;",
      errors: [{ messageId: 'unnecessaryWhitespace' }],
      output: "html`${firstName} ${lastName}`;"
    }
  ]
});
