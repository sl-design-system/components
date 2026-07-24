import { RuleTester } from 'eslint';
import { checkboxGroupHasLabel } from '../../../lib/rules/checkbox-group-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('checkbox-group-has-label', checkboxGroupHasLabel, {
  valid: [
    { code: 'html`<sl-checkbox-group aria-label="Options"></sl-checkbox-group>`;' },
    { code: 'html`<sl-checkbox-group aria-labelledby="group-label"></sl-checkbox-group>`;' },
    {
      code: 'html`<sl-form-field label="Options"><sl-checkbox-group></sl-checkbox-group></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Options</sl-label><sl-checkbox-group></sl-checkbox-group></sl-form-field>`;'
    },
    {
      code: 'const render = ({ label, slot }) => html`<sl-form-field .label=${label}>${slot?.()}</sl-form-field>`; const story = { args: { slot: () => html`<sl-checkbox-group required></sl-checkbox-group>` } };'
    },
    { code: 'const template = `<sl-checkbox-group></sl-checkbox-group>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-checkbox-group></sl-checkbox-group>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-checkbox-group aria-label=" "></sl-checkbox-group>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-checkbox-group></sl-checkbox-group></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-checkbox-group></sl-checkbox-group></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-checkbox-group></sl-checkbox-group></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'const render = ({ slot }) => html`<sl-form-field>${slot?.()}</sl-form-field>`; const story = { args: { slot: () => html`<sl-checkbox-group required></sl-checkbox-group>` } };',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
