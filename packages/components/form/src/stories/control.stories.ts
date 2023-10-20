import type { PropertyValues, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-input/register.js';
import { watch } from '@lit-labs/preact-signals';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormControl } from '../form-control.js';
import '../../register.js';

class ControlForm extends LitElement {
  name = new FormControl<string>(this, '');

  @property() value?: string;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      this.name.setValue(this.value ?? '');
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-text-input ${this.name.bind()}></sl-text-input>

      <p>Value: ${watch(this.name.value)}</p>
    `;
  }
}

try {
  customElements.define('control-form', ControlForm);
} catch {}

type Story = StoryObj<ControlForm>;

export default {
  title: 'Form/Control',
  args: {
    value: undefined
  },
  render: ({ value }) => html`<control-form .value=${value}></control-form>`
} satisfies Meta<ControlForm>;

export const Blank: Story = {};

export const InitialValue: Story = {
  args: {
    value: 'Hello, world!'
  }
};
