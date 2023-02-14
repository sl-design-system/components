import { Tooltip } from './tooltip.js';

customElements.define('sl-tooltip', Tooltip);

declare global {
  interface HTMLElementTagNameMap {
    'sl-tooltip': Tooltip;
  }
}
