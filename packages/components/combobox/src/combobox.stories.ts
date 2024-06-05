import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { type Combobox } from './combobox.js';

type Props = Pick<Combobox, 'disabled' | 'placeholder' | 'readonly' | 'required' | 'value'> & {
  hint?: string;
  label?: string;
  options?(): TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Combobox',
  tags: ['draft'],
  args: {
    disabled: false,
    label: 'Label',
    placeholder: 'Placeholder',
    readonly: false,
    required: false
  },
  render: ({ disabled, hint, label, options, placeholder, readonly, required, value }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-combobox
            ?disabled=${disabled}
            ?readonly=${readonly}
            ?required=${required}
            .placeholder=${placeholder}
            .value=${value}
          >
            ${options ? html`<div slot="options">${options?.()}</div>` : nothing}
          </sl-combobox>
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    options: () => html`
      <sl-option>Lorem</sl-option>
      <sl-option>Ipsum</sl-option>
      <sl-option>Dolar</sl-option>
      <sl-option>Sit</sl-option>
      <sl-option>Amet</sl-option>
    `
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Readonly: Story = {
  args: {
    readonly: true
  }
};
