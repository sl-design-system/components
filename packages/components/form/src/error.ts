import type { CSSResultGroup, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './error.scss.js';

export type ErrorSize = 'sm' | 'md' | 'lg';

/**
 * Component for displaying an error message for a form control.
 *
 * @slot error-text - The error message to display.
 */
export class Error extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The light DOM slot. */
  #slot?: HTMLSlotElement;

  /**
   * Whether the icon should be hidden. This can be useful when the form control
   * already shows an icon inside the component itself.
   */
  @property({ type: Boolean, reflect: true, attribute: 'no-icon' }) noIcon?: boolean;

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
      ${this.noIcon ? nothing : html`<sl-icon name="triangle-exclamation-solid" size="lg"></sl-icon>`}
      <slot></slot>
    `;
  }
}
