import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './hint.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-hint': Hint;
  }
}

export type HintSize = 'sm' | 'md' | 'lg';

/**
 * Component for displaying a hint for a form control.
 *
 * @slot hint-text - The hint to display.
 */
export class Hint extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The light DOM slot. */
  #slot?: HTMLSlotElement;

  /** The size at which the hint is displayed. */
  @property({ reflect: true }) size: HintSize = 'md';

  override connectedCallback(): void {
    super.connectedCallback();

    this.#slot ??= document.createElement('slot');
    this.#slot.name = 'hint-text';
    this.prepend(this.#slot);

    // Make sure the hint doesn't end up in the default slot
    if (this.parentElement?.tagName === 'SL-FORM-FIELD') {
      this.slot = 'hint';
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
