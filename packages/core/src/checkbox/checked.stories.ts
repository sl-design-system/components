import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export default {
  title: 'Checkbox'
};

export const API: StoryObj = {
  args: {
    checked: false,
    disabled: false,
    text: 'Toggle me',
    value: '12345'
  },
  render: ({ checked, disabled, text, value }) => html`
    <sl-checkbox ?checked=${checked} ?disabled=${disabled} .value=${value}>${text}</sl-checkbox>
  `
};
