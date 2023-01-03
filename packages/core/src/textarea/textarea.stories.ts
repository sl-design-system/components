import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../label/register.js';
import './register.js';

export default {
  title: 'Textarea'
};

export const API: StoryObj = {
  args: {
    disabled: false,
    placeholder: 'Type here',
    required: false,
    value: ''
  },
  render: ({ disabled, placeholder, required, value }) =>
    html`
      <sl-textarea
        .disabled=${disabled}
        .placeholder=${placeholder}
        .required=${required}
        .value=${value}
      ></sl-textarea>
    `
};
