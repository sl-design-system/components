import { msg } from '@lit/localize';
import { EventsController } from '@sl-design-system/shared';
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

  /** Event controller. */
  #events = new EventsController(this, { keydown: this.#onKeydown });

  /** Hides the step buttons if set. */
  @property({ type: Boolean, reflect: true, attribute: 'no-step-buttons' }) noStepButtons?: boolean;

  /** The amount by which a step should be made. */
  @property({ type: Number }) step?: number;

  get valueAsNumber(): number {
    return typeof this.value === 'string' ? parseFloat(this.value) : NaN;
  }

  /** The value, as a number. */
  @property({ type: Number })
  set valueAsNumber(value: number | undefined) {
    this.value = value?.toString() ?? '';
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.input.setAttribute('inputmode', this.inputMode || 'numeric');
  }

  override renderSuffix(): TemplateResult | typeof nothing {
    return this.noStepButtons
      ? nothing
      : html`
          <div class="step-buttons">
            <button @click=${() => this.stepUp()} aria-label=${msg('Step up')}>
              <sl-icon name="chevron-up" size="xs"></sl-icon>
            </button>
            <button @click=${() => this.stepDown()} aria-label=${msg('Step down')}>
              <sl-icon name="chevron-down" size="xs"></sl-icon>
            </button>
          </div>
        `;
  }

  stepDown(decrement: number = this.step ?? 1): void {
    this.valueAsNumber -= decrement;
  }

  stepUp(increment: number = this.step ?? 1): void {
    this.valueAsNumber += increment;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();

      this.stepUp();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();

      this.stepDown();
    }
  }
}
