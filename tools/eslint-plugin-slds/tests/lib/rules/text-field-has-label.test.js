import { RuleTester } from 'eslint';
import { textFieldHasLabel } from '../../../lib/rules/text-field-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('text-field-has-label', textFieldHasLabel, {
  valid: [
    { code: 'html`<sl-text-field aria-label="First name"></sl-text-field>`;' },
    { code: 'html`<sl-text-field aria-labelledby="first-name-label"></sl-text-field>`;' },
    {
      code: 'html`<sl-form-field label="First name"><sl-text-field></sl-text-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field .label=${label}><sl-text-field></sl-text-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">First name</sl-label><sl-text-field></sl-text-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field label="First name"><div><sl-text-field></sl-text-field></div></sl-form-field>`;'
    },
    { code: 'const template = `<sl-text-field></sl-text-field>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-text-field></sl-text-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-text-field aria-label=" "></sl-text-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-text-field></sl-text-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-text-field></sl-text-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-text-field></sl-text-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<div><sl-text-field></sl-text-field><sl-form-field label="Valid"><sl-text-field></sl-text-field></sl-form-field></div>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
