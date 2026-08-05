import { RuleTester } from 'eslint';
import { checkboxHasLabel } from '../../../lib/rules/checkbox-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('checkbox-has-label', checkboxHasLabel, {
  valid: [
    { code: 'html`<sl-checkbox>Accept terms</sl-checkbox>`;' },
    { code: 'html`<sl-checkbox><span>Accept terms</span></sl-checkbox>`;' },
    { code: 'html`<sl-checkbox>${label}</sl-checkbox>`;' },
    { code: 'html`<sl-checkbox aria-label="Accept terms"></sl-checkbox>`;' },
    { code: 'html`<sl-checkbox aria-labelledby="checkbox-label"></sl-checkbox>`;' },
    {
      code: 'html`<sl-form-field label="Accept terms"><sl-checkbox></sl-checkbox></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Accept terms</sl-label><sl-checkbox></sl-checkbox></sl-form-field>`;'
    },
    {
      code: 'html`<sl-checkbox>Accept terms<sl-infotip slot="infotip">Info</sl-infotip></sl-checkbox>`;'
    },
    { code: 'const template = `<sl-checkbox></sl-checkbox>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-checkbox></sl-checkbox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-checkbox>   </sl-checkbox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-checkbox><span></span></sl-checkbox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-checkbox><sl-infotip slot="infotip">Info</sl-infotip></sl-checkbox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-checkbox aria-label=" "></sl-checkbox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-checkbox></sl-checkbox></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-checkbox></sl-checkbox></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-checkbox></sl-checkbox></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
