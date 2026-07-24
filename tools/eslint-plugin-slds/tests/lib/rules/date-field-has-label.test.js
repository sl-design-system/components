import { RuleTester } from 'eslint';
import { dateFieldHasLabel } from '../../../lib/rules/date-field-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('date-field-has-label', dateFieldHasLabel, {
  valid: [
    { code: 'html`<sl-date-field aria-label="Date"></sl-date-field>`;' },
    { code: 'html`<sl-date-field aria-labelledby="date-label"></sl-date-field>`;' },
    {
      code: 'html`<sl-form-field label="Date"><sl-date-field></sl-date-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field .label=${label}><sl-date-field></sl-date-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Date</sl-label><sl-date-field></sl-date-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field label="Date"><div><sl-date-field></sl-date-field></div></sl-form-field>`;'
    },
    {
      code: 'html`<label for="date-field">Select Date</label><sl-date-field id="date-field"></sl-date-field>`;'
    },
    {
      code: 'html`<sl-date-field id="date-field"></sl-date-field><label for="date-field">Select Date</label>`;'
    },
    { code: 'const template = `<sl-date-field></sl-date-field>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-date-field></sl-date-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-date-field aria-label=" "></sl-date-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-date-field></sl-date-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-date-field></sl-date-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-date-field></sl-date-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<label for="date-field"></label><sl-date-field id="date-field"></sl-date-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<label for="other-field">Select Date</label><sl-date-field id="date-field"></sl-date-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
