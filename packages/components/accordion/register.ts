import { Accordion } from './src/accordion.js';
import { AccordionItem } from './src/accordion-item.js';

customElements.define('sl-accordion', Accordion);
customElements.define('sl-accordion-item', AccordionItem);

declare global {
  interface HTMLElementTagNameMap {
    'sl-accordion': Accordion;
    'sl-accordion-item': AccordionItem;
  }
}
