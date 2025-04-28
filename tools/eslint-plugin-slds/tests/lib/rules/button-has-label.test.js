import { RuleTester } from 'eslint';
import { buttonHasLabel } from '../../../lib/rules/button-has-label.js';

// Configure rule tester with flat config format for ESLint v9
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

// Run tests
ruleTester.run('button-has-label', buttonHasLabel, {
  valid: [
    { code: "html`<sl-button>Click me</sl-button>`;" },
    { code: "html`<sl-button aria-label='Label'></sl-button>`;" },
    { code: "html`<sl-button aria-labelledby='label'></sl-button>`;" },
    { code: "html`<sl-button>${buttonText}</sl-button>`;" },
    { code: "html`<sl-button>Click <strong>here</strong></sl-button>`;" },
    { code: "html`<sl-button>&nbsp;Space</sl-button>`;" },
    { code: "html`<sl-button><slot></slot></sl-button>`;" },
    { code: "html`<sl-button><sl-foo></sl-foo></sl-button>`;" },
    { code: "const template = `<sl-button></sl-button>`;" },
    { code: "html`<div><sl-button>First</sl-button><sl-button>Second</sl-button></div>`;" }
  ],
  invalid: [
    {
      code: "html`<sl-button></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: "html`<sl-button><img /></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: "html`<sl-button><svg></svg></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: "html`<sl-button><sl-icon></sl-icon></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: "html`<sl-button>  </sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: "html`<div><sl-button></sl-button><sl-button>Valid</sl-button><sl-button></sl-button></div>`;",
      errors: [
        { messageId: 'missingText' },
        { messageId: 'missingText' }
      ]
    },
    {
      code: "html`<sl-button><span></span></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    {
      code: "html`<sl-button variant=\"primary\" class=\"my-button\"></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    }
  ]
});
