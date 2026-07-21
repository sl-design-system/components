import { RuleTester } from 'eslint';
import { timeFieldHasLabel } from '../../../lib/rules/time-field-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('time-field-has-label', timeFieldHasLabel, {
  valid: [
    { code: 'html`<sl-time-field aria-label="Appointment time"></sl-time-field>`;' },
    { code: 'html`<sl-time-field aria-labelledby="time-label"></sl-time-field>`;' },
    {
      code: 'html`<sl-form-field label="Appointment time"><sl-time-field></sl-time-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field .label=${label}><sl-time-field></sl-time-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Appointment time</sl-label><sl-time-field></sl-time-field></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field label="Appointment time"><div><sl-time-field></sl-time-field></div></sl-form-field>`;'
    },
    { code: 'const template = `<sl-time-field></sl-time-field>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-time-field></sl-time-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-time-field aria-label=" "></sl-time-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-time-field></sl-time-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-time-field></sl-time-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-time-field></sl-time-field></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<div><sl-time-field></sl-time-field><sl-form-field label="Valid"><sl-time-field></sl-time-field></sl-form-field></div>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
