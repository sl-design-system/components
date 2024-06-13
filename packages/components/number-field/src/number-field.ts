import { msg } from '@lit/localize';
import { TextField } from '@sl-design-system/text-field';
import { type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './number-field.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-number-field': NumberField;
  }
}

export class NumberField extends TextField {
  /** @internal */
  static override styles = [TextField.styles, styles];

  /** The amount by which a step should be made. */
  @property({ type: Number }) step?: number;

  /** Will show stepper buttons when true. */
  @property({ type: Boolean, reflect: true }) stepper?: boolean;

  get valueAsNumber(): number {
    return typeof this.value === 'string' ? parseFloat(this.value) : NaN;
  }

  /** The value, as a number. */
  @property({ type: Number })
  set valueAsNumber(value: number | undefined) {
    this.value = value?.toString() ?? '';
  }

  override renderSuffix(): TemplateResult | typeof nothing {
    return this.stepper
      ? html`
          <div class="stepper-buttons">
            <button @click=${this.#onStepUp} aria-label=${msg('Step up')}>
              <sl-icon name="chevron-up" size="xs"></sl-icon>
            </button>
            <button @click=${this.#onStepDown} aria-label=${msg('Step down')}>
              <sl-icon name="chevron-down" size="xs"></sl-icon>
            </button>
          </div>
        `
      : nothing;
  }

  #onStepUp(): void {
    this.valueAsNumber += this.step ?? 1;
  }

  #onStepDown(): void {
    this.valueAsNumber -= this.step ?? 1;
  }
}
