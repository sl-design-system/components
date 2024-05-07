import { FocusGroupController } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { AccordionItem } from './accordion-item.js';
import styles from './accordion.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-accordion': Accordion;
  }
}

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

  /** Manage the keyboard navigation. */
  #focusGroupController = new FocusGroupController<AccordionItem>(this, {
    elements: () => this.items || [],
    focusInIndex: (elements: AccordionItem[]) => elements.findIndex(el => !el.disabled),
    isFocusableElement: (el: AccordionItem) => !el.disabled
  });

  /** The slotted accordion items. */
  @queryAssignedElements({ flatten: true }) items?: AccordionItem[];

  /** Whether only one accordion item can be opened at once. By default, multiple accordion items can be opened. */
  @property({ type: Boolean, reflect: true }) single?: boolean;

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${() => this.#focusGroupController.clearElementCache()} @sl-toggle=${this.#onToggle}></slot>
    `;
  }

  #onToggle(event: SlToggleEvent<boolean>): void {
    // Do nothing if we allow multiple items to be opened at once
    // or if the event is about an item being closed
    if (!this.single || !event.detail) {
      return;
    }

    const item = event.composedPath().find((et): et is AccordionItem => et instanceof AccordionItem);

    this.items?.filter(i => i !== item && i.open).forEach(i => i.toggle());
  }
}
