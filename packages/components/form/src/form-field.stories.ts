import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-field/register.js';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Form/Form Field'
};

export const Basic: StoryObj = {
  render: () => html`
    <sl-form-field>
      <sl-label for="textField">Label</sl-label>
      <sl-text-field id="textField"></sl-text-field>
    </sl-form-field>
  `
};
