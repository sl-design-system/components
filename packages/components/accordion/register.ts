import { AccordionItem } from './src/accordion-item.js';
import { Accordion } from './src/accordion.js';

customElements.define('sl-accordion', Accordion);
customElements.define('sl-accordion-item', AccordionItem);

declare global {
  interface HTMLElementTagNameMap {
    'sl-accordion': Accordion;
    'sl-accordion-item': AccordionItem;
  }
}
