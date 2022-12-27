import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './label.scss.js';

export class Label extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #label?: HTMLLabelElement;

  /** The DOM id of the form control this is linked to. */
  @property() for?: string;

  override updated(changes: PropertyValues<this>): void {
    if (changes.has('for')) {
      if (this.for) {
        this.#label?.setAttribute('for', this.for);
      } else {
        this.#label?.removeAttribute('for');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange} style="display: none"></slot>
      <slot name="label"></slot>
    `;
  }

  #onSlotchange({ target }: Event & { target: HTMLSlotElement }): void {
    const nodes = target.assignedNodes({ flatten: true });

    this.#label ??= document.createElement('label');
    this.#label.htmlFor = this.for ?? '';
    this.#label.append(...nodes);
  }
}
