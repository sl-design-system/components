import type { CSSResultGroup, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { Icon } from '@sl-design-system/icon';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
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

  /**
   * If true, the error icon won't be displayed. Useful for form controls that show
   * the icon inline, like text-field.
   */
  @property({ type: Boolean, attribute: 'no-icon' }) noIcon?: boolean;

  /** The size at which the error is displayed. */
  @property({ reflect: true }) size: ErrorSize = 'md';

  constructor() {
    super();

    const slot = document.createElement('slot');
    slot.name = 'error-text';

    this.append(slot);
  }

  override render(): TemplateResult {
    return html`
      ${this.noIcon ? nothing : html`<sl-icon .size=${this.size} name="triangle-exclamation-solid"></sl-icon>`}
      <slot @slotchange=${this.#onSlotchange}></slot>
    `;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true });

    this.toggleAttribute('hidden', assignedElements.length === 0);
  }
}
