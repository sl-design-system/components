import { Story } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import './register.js';
import { useArgs } from '@storybook/client-api';
import {Input} from "./input";

export default {
  title: 'Input'
};

export const API: Story = {
  args: {
    label: 'Label',
    placeholder: 'This is placeholder'
  },
  render: ({ label, placeholder }) => html`
    <form>
        <label id="input-1" for="input-2">${label}</label>
          <sl-input id="input-2" placeholder="${placeholder}"></sl-input>
    </form>
  `
};

export const InputValidation = () => {
  return html`
    <style>
      label {
        font-size: 14px;
      }
    </style>
    <p>Input required and of minimum 3 characters</p>
    <label for="my-input7">Label</label>
    <sl-input id="my-input7"
              validate-on-change
              custom-error-display
              type="text"
              required
              minlength="3"
              content-tooShort="Type at least 3 characters, please"
              content-valueMissing="This field is required">
    </sl-input>
  `
};


export const InputValidationInForm = () => {
  const [_] = useArgs(),
    onSubmit = (event: Event) => {
      event.preventDefault();
    };

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
      <sl-input id="my-input5"
                custom-error-display
                type="text"
                required
                content-valueMissing="This field is required"
                minlength="5"
                content-tooShort="Type at least 5 characters">
      </sl-input>
      <button type="submit" @submit="${onSubmit}">Send</button>
    </form>
  `
};
