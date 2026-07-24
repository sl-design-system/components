import { RuleTester } from 'eslint';
import { switchHasLabel } from '../../../lib/rules/switch-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('switch-has-label', switchHasLabel, {
  valid: [
    { code: 'html`<sl-switch>Enable feature</sl-switch>`;' },
    { code: 'html`<sl-switch><span>Enable feature</span></sl-switch>`;' },
    { code: 'html`<sl-switch>${label}</sl-switch>`;' },
    { code: 'html`<sl-switch aria-label="Enable feature"></sl-switch>`;' },
    { code: 'html`<sl-switch aria-labelledby="switch-label"></sl-switch>`;' },
    {
      code: 'html`<sl-form-field label="Enable feature"><sl-switch></sl-switch></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Enable feature</sl-label><sl-switch></sl-switch></sl-form-field>`;'
    },
    {
      code: 'html`<sl-switch>Enable feature<sl-infotip slot="infotip">Info</sl-infotip></sl-switch>`;'
    },
    { code: 'const template = `<sl-switch></sl-switch>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-switch></sl-switch>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-switch>   </sl-switch>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-switch><span></span></sl-switch>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-switch><sl-infotip slot="infotip">Info</sl-infotip></sl-switch>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-switch aria-label=" "></sl-switch>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-switch></sl-switch></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-switch></sl-switch></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-switch></sl-switch></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
