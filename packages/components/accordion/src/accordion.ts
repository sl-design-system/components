import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './accordion.scss.js';
import { AccordionItem } from './accordion-item.js';

/**
 * An accordion component that can contain accordion-items
 *
 * ```html
 *   <sl-accordionn>...</sl-accordion>
 * ```
 *
 * @slot default - The place for multiple <sl-accordion-item>
 */
export class Accordion extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-accordion-item': AccordionItem
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether only one accordion item can be opened at once. By default, multiple accordion items can be opened. */
  @property({ type: Boolean, reflect: true }) single?: boolean;

  /** @private The slotted accordion items. */
  @queryAssignedElements() items!: AccordionItem[];

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.get('single') === false) {
      this.items.forEach(item => {
        if (item.renderRoot.querySelector('details')?.hasAttribute('open')) {
          item.renderRoot.querySelector('details')?.removeAttribute('open');
        }
      });
    }
  }

  override render(): TemplateResult {
    return html` <slot @click=${this.#onClick}></slot> `;
  }

  #onClick(event: Event): void {
    if (!this.single || event.defaultPrevented) {
      // No toggling when no `single` or the user prevents it.
      return;
    }

    this.items.forEach(item => {
      if (item !== event.target) {
        if (item.renderRoot.querySelector('details')?.hasAttribute('open')) {
          item.renderRoot.querySelector('details')?.removeAttribute('open');
        }
      }
    });
  }
}
