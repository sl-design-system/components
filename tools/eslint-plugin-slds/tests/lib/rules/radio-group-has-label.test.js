import { RuleTester } from 'eslint';
import { radioGroupHasLabel } from '../../../lib/rules/radio-group-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('radio-group-has-label', radioGroupHasLabel, {
  valid: [
    { code: 'html`<sl-radio-group aria-label="Options"></sl-radio-group>`;' },
    { code: 'html`<sl-radio-group aria-labelledby="group-label"></sl-radio-group>`;' },
    {
      code: 'html`<sl-form-field label="Options"><sl-radio-group></sl-radio-group></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Options</sl-label><sl-radio-group></sl-radio-group></sl-form-field>`;'
    },
    { code: 'const template = `<sl-radio-group></sl-radio-group>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-radio-group></sl-radio-group>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-radio-group aria-label=" "></sl-radio-group>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-radio-group></sl-radio-group></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-radio-group></sl-radio-group></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-radio-group></sl-radio-group></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
