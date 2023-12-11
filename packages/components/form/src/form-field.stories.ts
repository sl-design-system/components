import type { FormField } from './form-field.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/tooltip/register.js';
import { type TemplateResult, html } from 'lit';
import '../register.js';

type Props = Pick<FormField, 'hint' | 'label'> & {
  customValidity?: string;
  slot?: TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Form Field',
  argTypes: {
    slot: {
      table: {
        disable: true
      }
    }
  },
  render: ({ customValidity, hint, label, slot }) => {
    // Force the text field to report its validity when the story is loaded
    setTimeout(() => document.querySelector('sl-text-field')?.reportValidity());

    return html`
      <sl-form-field .hint=${hint} .label=${label}>
        ${slot ?? html`<sl-text-field .customValidity=${customValidity}></sl-text-field>`}
      </sl-form-field>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    label: 'Label'
  }
};

export const Error: Story = {
  args: {
    ...Basic.args,
    slot: html`<sl-text-field required show-valid></sl-text-field>`
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
    customValidity: 'This is an error',
    hint: 'This is a hint'
  }
};

export const CustomError: Story = {
  args: {
    ...Basic.args,
    slot: html`
      <sl-text-field required></sl-text-field>
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
      <sl-label>
        This is a <em>custom</em> label
        <span aria-describedby="tooltip" tabindex="-1">
          <sl-icon name="info"></sl-icon>
        </span>
        <sl-tooltip id="tooltip">Some information about this field</sl-tooltip>
      </sl-label>
      <sl-text-field></sl-text-field>
    `
  }
};
