import type { FormField } from './form-field.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-field/register.js';
import { html } from 'lit';
import '../register.js';

type Props = Pick<FormField, 'errorText' | 'hintText'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Form Field',
  render: ({ errorText, hintText }) => html`
    <sl-form-field .errorText=${errorText} .hintText=${hintText}>
      <sl-label for="textField">Label</sl-label>
      <sl-text-field id="textField"></sl-text-field>
    </sl-form-field>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Hint: Story = {
  args: {
    hintText: 'This is a hint'
  }
};

export const Error: Story = {
  args: {
    errorText: 'This is an error'
  }
};

export const CustomHint: Story = {
  render: () => html`
    <sl-form-field>
      <sl-label for="textField">Label</sl-label>
      <sl-text-field id="textField"></sl-text-field>
      <sl-hint slot="hint">This is a <strong>custom</strong> hint</sl-hint>
    </sl-form-field>
  `
};

export const CustomError: Story = {
  render: () => html`
    <sl-form-field>
      <sl-label for="textField">Label</sl-label>
      <sl-text-field id="textField"></sl-text-field>
      <sl-error slot="error">This is a <strong>custom</strong> error</sl-hint>
    </sl-form-field>
  `
};
