import type { AsyncValidatorFn, ValidatorFn } from '../validators.js';
import type { PropertyValues, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/text-input/register.js';
import { type Signal, computed, effect, watch } from '@lit-labs/preact-signals';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormArray } from '../form-array.js';
import { FormControl } from '../form-control.js';
import '../../register.js';

class ArrayForm extends LitElement {
  array!: FormArray<FormControl<string>>;
  errors!: Signal<string>;

  @property({ attribute: false }) initialValue?: string[];
  @property({ attribute: false }) value?: string[];
  @property({ attribute: false }) validators?: ValidatorFn[];
  @property({ attribute: false }) asyncValidators?: AsyncValidatorFn[];
  @property() placeholder?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.array = new FormArray(this, [new FormControl(this, '')], {
      validators: this.validators,
      asyncValidators: this.asyncValidators
    });
    this.errors = computed(() => JSON.stringify(this.array.errors.value));

    // This is a workaround for a bug in @lit-labs/preact-signals
    effect(() => {
      if (this.array.controls.value) {
        this.requestUpdate();
      }
    });

    effect(() => console.log(this.array.value.value));
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      this.array.setValue(this.value as unknown as any);
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.#onAdd} variant="primary" style="margin-block-end: 1rem">Add</sl-button>

      ${this.array.controls.value.map(
        (control, index) =>
          html`
            <sl-text-input
              ${control.bind()}
              placeholder="Control ${index}"
              style="margin-block-end: 0.5rem"
            ></sl-text-input>
          `
      )}

      <p>Value: ${watch(this.array.value)}</p>
      <p>Errors: ${watch(this.errors)}</p>
      <p>Valid: ${watch(this.array.valid)}</p>
      <p>Invalid: ${watch(this.array.invalid)}</p>

      <sl-button @click=${this.#onValidate} fill="outline">Report validity</sl-button>
    `;
  }

  #onAdd(): void {
    this.array.append(new FormControl(this, ''));
  }

  #onValidate(): void {
    this.renderRoot.querySelector('sl-text-input')?.reportValidity();
  }
}

try {
  customElements.define('array-form', ArrayForm);
} catch {}

type Story = StoryObj<ArrayForm>;

export default {
  title: 'Form/Array',
  args: {
    initialValue: [],
    value: undefined,
    validators: undefined,
    asyncValidators: undefined
  },
  render: ({ initialValue, value, validators, asyncValidators }) => html`
    <array-form
      .initialValue=${initialValue}
      .value=${value}
      .validators=${validators}
      .asyncValidators=${asyncValidators}
    ></array-form>
  `
} satisfies Meta<ArrayForm>;

export const Basic: Story = {};
