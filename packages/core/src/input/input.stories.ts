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
  argTypes: {
    maxLength: { type: 'number' },
    minLength: { type: 'number' }
  },
  render: ({ disabled, maxLength, minLength, placeholder, prefix, required, suffix, value }) => html`
    <sl-input
      ?disabled=${disabled}
      ?required=${required}
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

export const RequiredCustomValidation: StoryObj = {
  render: () => html`
    <sl-input required>
      <div slot="validation-message">This is a custom validation message for the input.</div>
    </sl-input>
  `
};
