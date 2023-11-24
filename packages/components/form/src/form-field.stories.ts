import type { FormField } from './form-field.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-field/register.js';
import { html } from 'lit';
import '../register.js';

type Props = Pick<FormField, 'hint'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Form Field',
  render: ({ hint }) => html`
    <sl-form-field .hint=${hint}>
      <sl-label for="textField">Label</sl-label>
      <sl-text-field id="textField"></sl-text-field>
    </sl-form-field>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Hint: Story = {
  args: {
    hint: 'This is a hint'
  }
};
