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
    { code: "html`<div><sl-button>First</sl-button><sl-button>Second</sl-button></div>`;" },
    { code: "html`<sl-button ${tooltip('Toolip example', { ariaRelation: 'label' })}><sl-icon name='face-smile'></sl-icon></sl-button>`;" },
    { code: "html`<sl-button ${tooltip('Tiooltip example', { position: 'bottom-start', ariaRelation: 'label' })}><sl-icon name='face-smile'></sl-icon></sl-button>`;" },
    { code: "html`<sl-button ${tooltip('My tooltip example', { ariaRelation: 'label', position: 'bottom-start', maxWidth: 100 })}><sl-icon name='face-smile' size='lg'></sl-icon></sl-button>`;" },
    { code: "html`<sl-button variant=\"primary\" fill=\"solid\" ${tooltip('My tooltip example', { ariaRelation: 'label', position: 'bottom-start', maxWidth: 100 })}>\n`;" }
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
    },
    {
      code: "html`<sl-button ${tooltip('Tip', { position: 'bottom-start' })}><sl-icon name='face-smile'></sl-icon></sl-button>`;",
      errors: [{ messageId: 'missingText' }]
    }
  ]
});
