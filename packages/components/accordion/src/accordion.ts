import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
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

  /** Whether only one accordion item can be opened at once. By default, multiple accordion items can be opened. */
  @property({ type: Boolean, reflect: true }) single?: boolean;

  /** @private The slotted accordion items. */
  @queryAssignedElements() items!: AccordionItem[];

  override updated(changes: PropertyValues<this>): void {
    if (changes.get('single') === false) {
      this.items
        .filter(item => item.renderRoot.querySelector('details')?.hasAttribute('open'))
        .forEach(item => {
          item.renderRoot.querySelector('summary')?.click();
        });
    }
  }

  override render(): TemplateResult {
    return html`<slot @click=${this.#onClick}></slot>`;
  }

  #onClick(event: Event): void {
    if (!this.single || event.defaultPrevented) {
      // No toggling when no `single` or the user prevents it.
      return;
    }

    this.items
      .filter(item => {
        return item !== event.target && item.renderRoot.querySelector('details')?.hasAttribute('open');
      })
      .forEach(item => {
        item.renderRoot.querySelector('summary')?.click();
      });
  }
}
