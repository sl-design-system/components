import { RuleTester } from 'eslint';
import { textAreaHasLabel } from '../../../lib/rules/text-area-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('text-area-has-label', textAreaHasLabel, {
  valid: [
    { code: 'html`<sl-textarea aria-label="Description"></sl-textarea>`;' },
    { code: 'html`<sl-textarea aria-labelledby="description-label"></sl-textarea>`;' },
    {
      code: 'html`<sl-form-field label="Description"><sl-textarea></sl-textarea></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field .label=${label}><sl-textarea></sl-textarea></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Description</sl-label><sl-textarea></sl-textarea></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field label="Description"><div><sl-textarea></sl-textarea></div></sl-form-field>`;'
    },
    { code: 'const template = `<sl-textarea></sl-textarea>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-textarea></sl-textarea>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-textarea aria-label=" "></sl-textarea>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-textarea></sl-textarea></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-textarea></sl-textarea></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-textarea></sl-textarea></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<div><sl-textarea></sl-textarea><sl-form-field label="Valid"><sl-textarea></sl-textarea></sl-form-field></div>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
