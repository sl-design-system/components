import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button/register.js';
import '../label/register.js';
import './register.js';

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
      div {
        display: flex;
        flex-direction: column;
      }
    </style>
    <div>
      <sl-label for="input">What is your name?</sl-label>
      <sl-input id="input"></sl-input>
    </div>
  `
};

export const Hint: StoryObj = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
      }
    </style>
    <div>
      <sl-label for="input">Nickname</sl-label>
      <sl-input id="input" hint="What would you like people to call you?"></sl-input>
    </div>
  `
};

export const RichLabelHint: StoryObj = {
  render: () => html`
    <style>
      div:not([slot]) {
        display: flex;
        flex-direction: column;
      }
    </style>
    <div>
      <sl-label for="input">
        <label slot="label">Custom <i>label</i></label>
      </sl-label>
      <sl-input id="input">
        <div slot="hint">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-input>
    </div>
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
  render: () => html`<sl-input maxlength="5" minlength="3" placeholder="Min 3, max 5 chars"></sl-input>`
};

export const Required: StoryObj = {
  render: () => html`<sl-input placeholder="I am required" required></sl-input>`
};

export const CustomInput: StoryObj = {
  render: () => html`
    <sl-label for="custom">Custom input</sl-label>
    <sl-input id="custom">
      <input id="foo" slot="input" placeholder="I am a custom input" />
    </sl-input>
  `
};
