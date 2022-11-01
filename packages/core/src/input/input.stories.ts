import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Input'
};

export const API: StoryObj = {
  args: {
    disabled: false,
    placeholder: 'This is placeholder',
    prefix: '',
    required: false,
    suffix: '',
    value: ''
  },
  render: ({ disabled, placeholder, prefix, required, suffix, value }) => html`
    <sl-input ?disabled=${disabled} ?required=${required} .placeholder=${placeholder} .value=${value}>
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : ''}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : ''}
    </sl-input>
  `
};

export const InputValidation: StoryObj = {
  render: () => html`
    <style>
      label {
        font-size: 14px;
      }
    </style>
    <p>Input required and of minimum 3 characters</p>
    <label for="my-input7">Label</label>
    <sl-input
      id="my-input7"
      validate-on-change
      custom-error-display
      type="text"
      required
      minlength="3"
      content-tooShort="Type at least 3 characters, please"
      content-valueMissing="This field is required"
    >
    </sl-input>
  `
};

export const InputValidationInForm: StoryObj = {
  render: () => {
    const onSubmit = (event: Event): void => event.preventDefault();

    return html`
      <style>
        label {
          font-size: 14px;
        }

        button {
          margin-top: 12px;
        }
      </style>
      <h3>Validation on form submit</h3>
      <p>Input required and of minimum 5 characters</p>
      <form id="formId5">
        <label for="my-input5">Label in form</label>
        <sl-input
          id="my-input5"
          custom-error-display
          type="text"
          required
          content-valueMissing="This field is required"
          minlength="5"
          content-tooShort="Type at least 5 characters"
        >
        </sl-input>
        <button type="submit" @submit="${onSubmit}">Send</button>
      </form>
    `;
  }
};
