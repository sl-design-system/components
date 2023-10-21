import type { PropertyValues, TemplateResult } from 'lit';
import type { AsyncValidatorFn, ValidatorFn } from '../validators.js';
import type { Signal } from '@lit-labs/preact-signals';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/text-input/register.js';
import { computed, watch } from '@lit-labs/preact-signals';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormControl } from '../form-control.js';
import { Validators } from '../validators.js';
import '../../register.js';

class ControlForm extends LitElement {
  name!: FormControl<string>;
  errors!: Signal<string>;

  @property({ type: String, attribute: 'initial-value' }) initialValue?: string;
  @property({ type: String }) value?: string;
  @property({ attribute: false }) validators?: ValidatorFn[];
  @property({ attribute: false }) asyncValidators?: AsyncValidatorFn[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.name = new FormControl(this, this.initialValue ?? '', this.validators);
    this.errors = computed(() => JSON.stringify(this.name.errors.value));
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
      <p>Errors: ${watch(this.errors)}</p>
      <p>Valid: ${watch(this.name.valid)}</p>
      <p>Invalid: ${watch(this.name.invalid)}</p>
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
    value: undefined,
    validators: undefined,
    asyncValidators: undefined
  },
  render: ({ initialValue, value, validators, asyncValidators }) =>
    html`
      <control-form
        .initialValue=${initialValue}
        .value=${value}
        .validators=${validators}
        .asyncValidators=${asyncValidators}
      ></control-form>
    `
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
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(5)]
  }
};

export const AsyncValidation: Story = {
  args: {
    validators: [
      Validators.required,
      async value => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(value.value === 'Foo' ? null : { invalid: true });
          }, 1000);
        });
      }
    ]
  }
};
