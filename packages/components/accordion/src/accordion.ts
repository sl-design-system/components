import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { AccordionItem } from './accordion-item.js';
import styles from './accordion.scss.js';

/**
 * An accordion component that can contain accordion-items
 *
 * ```html
 *   <sl-accordion>...</sl-accordion>
 * ```
 *
 * @slot default - The place for multiple `<sl-accordion-item>`
 */
export class Accordion extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The slotted accordion items. */
  @state() items?: AccordionItem[];

  /** Whether only one accordion item can be opened at once. By default, multiple accordion items can be opened. */
  @property({ type: Boolean, reflect: true }) single?: boolean;

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange} @sl-toggle=${this.#onToggle}></slot>`;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.items = Array.from(event.target.assignedElements({ flatten: true })).filter(
      (el): el is AccordionItem => el instanceof AccordionItem
    );
  }

  #onToggle(event: CustomEvent<boolean>): void {
    // Do nothing if we allow multiple items to be opened at once
    // or if the event is about an item being closed
    if (!this.single || !event.detail) {
      return;
    }

    const item = event.composedPath().find((et): et is AccordionItem => et instanceof AccordionItem);

    this.items?.filter(i => i !== item && i.open).forEach(i => i.toggle());
  }
}
