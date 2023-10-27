import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './error.scss.js';

export type ErrorSize = 'sm' | 'md' | 'lg';

export class Error extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The size at which the error is displayed. */
  @property({ reflect: true }) size: ErrorSize = 'md';

  constructor() {
    super();

    const slot = document.createElement('slot');
    slot.name = 'error-text';

    this.append(slot);
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true });

    this.toggleAttribute('hidden', assignedElements.length === 0);
  }
}
