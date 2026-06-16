import {
  faClockRotateLeft,
  faCodeBranch,
  faHouse,
  faMoon,
  faPalette,
  faShapes
} from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { type Command, CommandPalette } from './command-palette.js';

type Story = StoryObj;

Icon.register(faClockRotateLeft, faCodeBranch, faHouse, faMoon, faPalette, faShapes);

try {
  customElements.define('doc-command-palette', CommandPalette);
} catch {
  /* empty */
}

const commands: Command[] = [
  { id: 'home', label: 'Go to home', icon: 'far-house', keywords: ['start', 'index'] },
  { id: 'components', label: 'Browse components', icon: 'far-shapes' },
  { id: 'tokens', label: 'Design tokens', icon: 'far-palette' },
  { id: 'theme', label: 'Toggle theme', icon: 'far-moon', keywords: ['dark', 'light'] },
  {
    id: 'github',
    label: 'Open on GitHub',
    icon: 'far-code-branch',
    keywords: ['repository', 'source']
  },
  {
    id: 'changelog',
    label: 'View changelog',
    icon: 'far-clock-rotate-left',
    keywords: ['releases']
  }
];

export default {
  title: 'Command palette',
  render: () => html`
    <button
      @click=${(e: Event) =>
        ((e.target as HTMLElement).nextElementSibling as CommandPalette).show()}>
      Open command palette (or press ⌘K)
    </button>
    <doc-command-palette .commands=${commands}></doc-command-palette>
  `
} satisfies Meta;

export const Basic: Story = {};
