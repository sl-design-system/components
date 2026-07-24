import { RuleTester } from 'eslint';
import { comboboxHasLabel } from '../../../lib/rules/combobox-has-label.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
});

ruleTester.run('combobox-has-label', comboboxHasLabel, {
  valid: [
    { code: 'html`<sl-combobox aria-label="Choose an option"></sl-combobox>`;' },
    { code: 'html`<sl-combobox aria-labelledby="combobox-label"></sl-combobox>`;' },
    {
      code: 'html`<sl-form-field label="Choose an option"><sl-combobox></sl-combobox></sl-form-field>`;'
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label">Choose an option</sl-label><sl-combobox></sl-combobox></sl-form-field>`;'
    },
    {
      code: 'dialog.innerHTML = `<sl-combobox aria-label="Choose an option"></sl-combobox>`;'
    },
    {
      code: 'element.insertAdjacentHTML("beforeend", `<sl-combobox aria-labelledby="combobox-label"></sl-combobox>`);'
    },
    { code: 'const template = `<sl-combobox></sl-combobox>`;' }
  ],
  invalid: [
    {
      code: 'html`<sl-combobox></sl-combobox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-combobox aria-label=" "></sl-combobox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-combobox></sl-combobox></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field label=""><sl-combobox></sl-combobox></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'html`<sl-form-field><sl-label slot="label"></sl-label><sl-combobox></sl-combobox></sl-form-field>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'dialog.innerHTML = `<sl-combobox></sl-combobox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'element.insertAdjacentHTML("beforeend", `<sl-combobox multiple></sl-combobox>`);',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'dialog.innerHTML = `<sl-combobox data-aria-label="Choose an option"></sl-combobox>`;',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'element.insertAdjacentHTML("beforeend", `<sl-combobox data-aria-labelledby="combobox-label"></sl-combobox>`);',
      errors: [{ messageId: 'missingLabel' }]
    },
    {
      code: 'dialog.innerHTML = `<sl-combobox></sl-combobox><sl-combobox></sl-combobox>`;',
      errors: [{ messageId: 'missingLabel' }]
    }
  ]
});
