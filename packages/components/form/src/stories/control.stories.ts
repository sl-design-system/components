import type { PropertyValues, TemplateResult } from 'lit';
import type { ValidatorFn } from '../validators.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-input/register.js';
import { watch } from '@lit-labs/preact-signals';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormControl } from '../form-control.js';
import { Validators } from '../validators.js';
import '../../register.js';

class ControlForm extends LitElement {
  name!: FormControl<string>;

  @property({ type: String, attribute: 'initial-value' }) initialValue?: string;
  @property({ attribute: false }) validators?: ValidatorFn[];
  @property({ type: String }) value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.name = new FormControl(this, this.initialValue ?? '', this.validators);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      this.name.setValue(this.value);
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
    initialValue: undefined,
    validators: undefined,
    value: undefined
  },
  render: ({ initialValue, validators, value }) =>
    html`<control-form .initialValue=${initialValue} .validators=${validators} .value=${value}></control-form>`
} satisfies Meta<ControlForm>;

export const Blank: Story = {};

export const InitialValue: Story = {
  args: {
    initialValue: 'Hello, world!'
  }
};

export const Value: Story = {
  args: {
    initialValue: 'Foo',
    value: 'Bar'
  }
};

export const Validation: Story = {
  args: {
    validators: [Validators.required]
  }
};
