import '@sl-design-system/button/register.js';
import { Tooltip2 } from './tooltip2.js';

try {
  customElements.define('sl-tooltip2', Tooltip2);
} catch {
  /* empty */
}

export default {
  title: 'Overlay/Tooltip2',
  parameters: {
    layout: 'centered'
  },
  render: () => {
    return `
      <sl-button id="button">Hover me</sl-button>
      <sl-tooltip2 for="button">Tooltip content</sl-tooltip2>
    `;
  }
};

export const Basic = {};
