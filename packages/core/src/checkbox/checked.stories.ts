import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Checkbox'
};

export const API: StoryObj = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    text: 'Toggle me',
    value: '12345'
  },
  render: ({ checked, disabled, indeterminate, text, value }) => html`
    <sl-checkbox ?checked=${checked} ?disabled=${disabled} .indeterminate=${indeterminate} .value=${value}
      >${text}</sl-checkbox
    >
  `
};
