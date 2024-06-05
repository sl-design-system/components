import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { type Combobox } from './combobox.js';

type Props = Pick<Combobox, 'disabled' | 'placeholder' | 'readonly'> & { options?(): TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Form/Combobox',
  tags: ['draft'],
  render: ({ disabled, options, placeholder, readonly }) => {
    return html`
      <sl-combobox ?disabled=${disabled} ?readonly=${readonly} .placeholder=${placeholder}>
        ${options ? html`<div slot="options">${options?.()}</div>` : nothing}
      </sl-combobox>
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
