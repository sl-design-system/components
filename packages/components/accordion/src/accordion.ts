import { FocusGroupController } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { AccordionItem } from './accordion-item.js';
import styles from './accordion.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-accordion': Accordion;
  }
}

export type AccordionIconType = 'chevron' | 'plusminus';

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
  /**
   * This determines the icons used in the accordion. You can change this to
   * `chevron` for all accordions.
   */
  static iconType: AccordionIconType = 'plusminus';

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Manage the keyboard navigation. */
  #focusGroupController = new FocusGroupController<AccordionItem>(this, {
    elements: () => this.items || [],
    focusInIndex: (elements: AccordionItem[]) => elements.findIndex(el => !el.disabled),
    isFocusableElement: (el: AccordionItem) => !el.disabled
  });

  /**
   * The icon type used in the accordion. Use this to only change the icon type for this accordion.
   * Alternatively, you can set `Accordion.iconType` to change the default for all accordions.
   */
  @property({ attribute: 'icon-type' }) iconType?: AccordionIconType = Accordion.iconType;

  /** The slotted accordion items. */
  @queryAssignedElements({ flatten: true }) items?: AccordionItem[];

  /** Whether only one accordion item can be opened at once. By default, multiple accordion items can be opened. */
  @property({ type: Boolean, reflect: true }) single?: boolean;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('iconType')) {
      this.items?.forEach(item => (item.iconType = this.iconType ?? Accordion.iconType));
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange} @sl-toggle=${this.#onToggle}></slot>`;
  }

  #onSlotChange(): void {
    this.items?.forEach(item => (item.iconType = this.iconType ?? Accordion.iconType));

    this.#focusGroupController.clearElementCache();
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
