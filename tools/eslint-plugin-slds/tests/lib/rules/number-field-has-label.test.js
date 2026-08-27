import { RuleTester } from 'eslint';
import { numberFieldHasLabel } from '../../../lib/rules/number-field-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('number-field-has-label', numberFieldHasLabel, {
  valid: [
    { code: 'html`<sl-number-field aria-label="Number"></sl-number-field>`;' },
    { code: 'html`<sl-number-field aria-labelledby="number-label"></sl-number-field>`;' },
    {
      code: 'html`<sl-form-field label="Number"><sl-number-field></sl-number-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field .label=${label}><sl-number-field></sl-number-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Number</sl-label><sl-number-field></sl-number-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field label="Number"><div><sl-number-field></sl-number-field></div></sl-form-field>`;'
    },
    { code: 'const template = `<sl-number-field></sl-number-field>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-number-field></sl-number-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-number-field aria-label=" "></sl-number-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-number-field></sl-number-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-number-field></sl-number-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-number-field></sl-number-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
