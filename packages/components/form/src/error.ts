import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './error.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-error': Error;
  }
}

export type ErrorSize = 'sm' | 'md' | 'lg';

/**
 * Component for displaying an error message for a form control.
 *
 * @slot error-text - The error message to display.
 */
export class Error extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The light DOM slot. */
  #slot?: HTMLSlotElement;

  /** The size at which the error is displayed. */
  @property({ reflect: true }) size: ErrorSize = 'md';

  override connectedCallback(): void {
    super.connectedCallback();

    this.#slot ??= document.createElement('slot');
    this.#slot.name = 'error-text';
    this.append(this.#slot);

    // Make sure the error doesn't end up in the default slot
    if (this.parentElement?.tagName === 'SL-FORM-FIELD') {
      this.slot = 'error';
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-icon name="circle-exclamation-solid"></sl-icon>
      <slot></slot>
    `;
  }
}
