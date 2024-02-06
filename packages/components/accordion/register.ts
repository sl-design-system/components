import { Accordion } from './src/accordion.js';

customElements.define('sl-accordion', Accordion);

declare global {
  interface HTMLElementTagNameMap {
    'sl-accordion': Accordion;
  }
}
