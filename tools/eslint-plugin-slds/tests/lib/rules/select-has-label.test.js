import { RuleTester } from 'eslint';
import { selectHasLabel } from '../../../lib/rules/select-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('select-has-label', selectHasLabel, {
  valid: [
    { code: 'html`<sl-select aria-label="Choose an option"></sl-select>`;' },
    { code: 'html`<sl-select aria-labelledby="select-label"></sl-select>`;' },
    {
      code: 'html`<sl-form-field label="Choose an option"><sl-select></sl-select></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Choose an option</sl-label><sl-select></sl-select></sl-form-field>`;'
    },
    { code: 'const template = `<sl-select></sl-select>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-select></sl-select>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-select aria-label=" "></sl-select>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-select></sl-select></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-select></sl-select></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-select></sl-select></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
