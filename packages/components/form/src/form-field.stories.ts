import type { FormField } from './form-field.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/textarea/register.js';
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
  args: {
    hint: 'This is a hint',
    label: 'Label'
  },
  argTypes: {
    slot: {
      table: {
        disable: true
      }
    }
  },
  render: ({ customValidity, hint, label, slot }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('form')?.reportValidity();
    };

    return html`
      <style>
        sl-button-bar {
          margin-block-start: 1rem;
        }
      </style>
      <form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot ?? html`<sl-text-field .customValidity=${customValidity}></sl-text-field>`}
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </form>
    `;
  }
} satisfies Meta<Props>;

export const Checkbox: Story = {
  args: {
    slot: html`<sl-checkbox required>Checkbox</sl-checkbox>`
  }
};

export const CheckboxGroup: Story = {
  args: {
    slot: html`
      <sl-checkbox-group required>
        <sl-checkbox>Checkbox 1</sl-checkbox>
        <sl-checkbox>Checkbox 2</sl-checkbox>
        <sl-checkbox>Checkbox 3</sl-checkbox>
      </sl-checkbox-group>
    `
  }
};

export const RadioGroup: Story = {
  args: {
    slot: html`
      <sl-radio-group required>
        <sl-radio value="1">Radio 1</sl-radio>
        <sl-radio value="2">Radio 2</sl-radio>
        <sl-radio value="3">Radio 3</sl-radio>
      </sl-radio-group>
    `
  }
};

export const Textarea: Story = {
  args: {
    slot: html`<sl-textarea required></sl-textarea>`
  }
};

export const TextField: Story = {
  args: {
    slot: html`<sl-text-field required></sl-text-field>`
  }
};

export const CustomError: Story = {
  args: {
    slot: html`
      <sl-text-field required></sl-text-field>
      <sl-error>This is a <strong>custom</strong> error</sl-error>
    `
  }
};

export const CustomHint: Story = {
  args: {
    hint: undefined,
    slot: html`
      <sl-text-field></sl-text-field>
      <sl-hint>This is a <strong>custom</strong> hint</sl-hint>
    `
  }
};

export const CustomLabel: Story = {
  args: {
    label: undefined,
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
