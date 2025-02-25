import '@sl-design-system/listbox/register.js';
import { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Form/Combobox POC',
  render: () => {
    return html`
      <style>
        input::placeholder {
          color: transparent;
        }
      </style>
      <sl-combobox-poc>
        <input slot="input" />
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox-poc>
    `;
  }
};

export const Basic: Story = {};
