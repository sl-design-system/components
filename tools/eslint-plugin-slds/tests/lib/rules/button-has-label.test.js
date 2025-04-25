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
    // Button with direct text content
    {
      code: "html`<sl-button>Click me</sl-button>`;"
    },
    // Button with an aria-label
    {
      code: "html`<sl-button aria-label='Label'></sl-button>`;"
    },
    // Button with an aria-labelledby
    {
      code: "html`<sl-button aria-labelledby='label'></sl-button>`;"
    },
    // Button with expression for text content
    {
      code: "html`<sl-button>${buttonText}</sl-button>`;"
    },
    // Button with mixed content
    {
      code: "html`<sl-button>Click <strong>here</strong></sl-button>`;"
    },
    // Button with HTML entity
    {
      code: "html`<sl-button>&nbsp;Space</sl-button>`;"
    },
    // Button with slot
    {
      code: "html`<sl-button><slot></slot></sl-button>`;"
    },
    // Not a Lit html template
    {
      code: "const template = `<sl-button></sl-button>`;"
    },
    // Multiple buttons with text
    {
      code: "html`<div><sl-button>First</sl-button><sl-button>Second</sl-button></div>`;"
    }
  ],
  invalid: [
    // Empty button
    {
      code: "html`<sl-button></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    // Button with icon
    {
      code: "html`<sl-button><sl-icon></sl-icon></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    // Button with only whitespace
    {
      code: "html`<sl-button>  </sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    // Multiple empty buttons
    {
      code: "html`<div><sl-button></sl-button><sl-button>Valid</sl-button><sl-button></sl-button></div>`;",
      errors: [
        { messageId: 'missingText' },
        { messageId: 'missingText' }
      ]
    },
    // Button with empty HTML tags
    {
      code: "html`<sl-button><span></span></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    },
    // Button with attributes but no content
    {
      code: "html`<sl-button variant=\"primary\" class=\"my-button\"></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    }
  ]
});
