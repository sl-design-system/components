import type { FormField } from './form-field.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-field/register.js';
import { type TemplateResult, html } from 'lit';
import '../register.js';

type Props = Pick<FormField, 'error' | 'hint' | 'label'> & { slot?: TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Form/Form Field',
  render: ({ error, hint, label, slot }) => html`
    <sl-form-field .error=${error} .hint=${hint} .label=${label}>
      ${slot ?? html`<sl-text-field></sl-text-field>`}
    </sl-form-field>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    label: 'Label'
  }
};

export const Error: Story = {
  args: {
    ...Basic.args,
    error: 'This is an error'
  }
};

export const Hint: Story = {
  args: {
    ...Basic.args,
    hint: 'This is a hint'
  }
};

export const Both: Story = {
  args: {
    ...Basic.args,
    error: 'This is an error',
    hint: 'This is a hint'
  }
};

export const BuiltInError: Story = {
  args: {
    ...Basic.args,
    slot: html`<sl-text-field minlength="3" required></sl-text-field>`
  }
};

export const CustomError: Story = {
  args: {
    ...Basic.args,
    slot: html`
      <sl-text-field></sl-text-field>
      <sl-error>This is a <strong>custom</strong> error</sl-error>
    `
  }
};

export const CustomHint: Story = {
  args: {
    ...Basic.args,
    slot: html`
      <sl-text-field></sl-text-field>
      <sl-hint>This is a <strong>custom</strong> hint</sl-hint>
    `
  }
};

export const CustomLabel: Story = {
  args: {
    slot: html`
      <sl-label>This is a <em>custom</em> label</sl-label>
      <sl-text-field></sl-text-field>
    `
  }
};
