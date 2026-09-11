import { RuleTester } from 'eslint';
import { radioHasLabel } from '../../../lib/rules/radio-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('radio-has-label', radioHasLabel, {
  valid: [
    { code: 'html`<sl-radio>Option 1</sl-radio>`;' },
    { code: 'html`<sl-radio><span>Option 1</span></sl-radio>`;' },
    { code: 'html`<sl-radio>${label}</sl-radio>`;' },
    {
      code: 'html`<sl-radio>Option 1<sl-infotip slot="infotip">Info</sl-infotip></sl-radio>`;'
    },
    {
      code: 'html`<sl-radio><slot></slot></sl-radio>`;',
      name: 'bare default slot forwards host light DOM content'
    },
    { code: 'const template = `<sl-radio></sl-radio>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-radio></sl-radio>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-radio>   </sl-radio>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-radio><span></span></sl-radio>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-radio><slot name="label"></slot></sl-radio>`;',
      errors: [{ messageId: 'missingLabel' }],
      name: 'named slot does not provide accessible name'
    },
    {
      code: 'html`<sl-radio><sl-infotip slot="infotip">Info</sl-infotip></sl-radio>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
