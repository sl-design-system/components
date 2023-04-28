import type { Input } from './input.js';
import type { ValidationValue, Validator } from '@sl-design-system/shared';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/label/register.js';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Input'
};

export const API: StoryObj = {
  args: {
    disabled: false,
    hint: '',
    placeholder: 'Type something here',
    prefix: '',
    required: false,
    suffix: '',
    value: ''
  },
  argTypes: {
    maxLength: { type: 'number' },
    minLength: { type: 'number' }
  },
  render: ({ disabled, hint, maxLength, minLength, placeholder, prefix, required, suffix, value }) => html`
    <sl-input
      ?disabled=${disabled}
      ?required=${required}
      .hint=${hint}
      .maxLength=${maxLength}
      .minLength=${minLength}
      .placeholder=${placeholder}
      .value=${value}
    >
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : ''}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : ''}
    </sl-input>
  `
};

export const Disabled: StoryObj = {
  render: () => html`<sl-input disabled value="I am disabled"></sl-input>`
};

export const Label: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input">What is your name?</sl-label>
      <sl-input id="input"></sl-input>
    </form>
  `
};

export const Hint: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input">Nickname</sl-label>
      <sl-input id="input" hint="What would you like people to call you?"></sl-input>
    </form>
  `
};

export const RichLabelHint: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input">
        <label slot="label">Custom <i>label</i></label>
      </sl-label>
      <sl-input id="input">
        <div slot="hint">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-input>
    </form>
  `
};

export const PrefixSuffix: StoryObj = {
  render: () => html`
    <sl-input>
      <span slot="prefix">prefix</span>
      <span slot="suffix">suffix</span>
    </sl-input>
  `
};

export const MinMaxLength: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Input)?.reportValidity();
    };

    return html`
      <sl-input minlength="3" maxlength="5" placeholder="Min 3 and max 5 chars" required></sl-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const Pattern: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Input)?.reportValidity();
    };

    return html`
      <sl-input pattern=".{3,5}" placeholder="Min 3 and max 5 chars using pattern" required></sl-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const CustomInput: StoryObj = {
  render: () => html`
    <sl-label for="custom">Custom input</sl-label>
    <sl-input id="custom">
      <input id="foo" slot="input" placeholder="I am a custom input" />
    </sl-input>
  `
};

export const CustomValidation: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as Input)?.reportValidity();
    };

    const validator: Validator = {
      message: 'Enter "SLDS"',
      isValid: (_: HTMLElement, value: ValidationValue): boolean => value === 'SLDS'
    };

    return html`
      <sl-input required="true" .validators=${[validator]}></sl-input>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};
