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
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    },
    text: {
      control: 'text'
    }
  },
  args: {
    text: 'Tooltip text'
  },
  render: ({ position, text }: { position: string; text: string }) => {
    return `
      <sl-button id="button">Hover me</sl-button>
      <sl-tooltip2 for="button" style="${position ? `position-area: ${position}` : ''}">${text}</sl-tooltip2>
    `;
  }
};

export const Basic = {};
