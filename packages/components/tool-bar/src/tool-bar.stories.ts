import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBold,
  faCopy,
  faItalic,
  faPaste,
  faScissors,
  faUnderline
} from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/select/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

type Props = Pick<ToolBar, 'disabled'> & { items?(): TemplateResult };
type Story = StoryObj<Props>;

Icon.register(
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBold,
  faCopy,
  faItalic,
  faPaste,
  faScissors,
  faUnderline
);

export default {
  title: 'Components/Tool bar',
  tags: ['draft'],
  args: {
    disabled: false
  },
  argTypes: {
    items: {
      table: { disable: true }
    }
  },
  render: ({ disabled, items }) => {
    return html`<sl-tool-bar ?disabled=${disabled}>${items?.()}</sl-tool-bar>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    items: () => html`
      <sl-tool-bar-group>
        <sl-button aria-label="Bold" fill="ghost">
          <sl-icon name="far-bold"></sl-icon>
        </sl-button>
        <sl-button aria-label="Italic" fill="ghost">
          <sl-icon name="far-italic"></sl-icon>
        </sl-button>
        <sl-button aria-label="Underline" fill="ghost">
          <sl-icon name="far-underline"></sl-icon>
        </sl-button>
      </sl-tool-bar-group>

      <sl-tool-bar-group>
        <sl-button aria-label="Align left" fill="ghost">
          <sl-icon name="far-align-left"></sl-icon>
        </sl-button>
        <sl-button aria-label="Align center" fill="ghost">
          <sl-icon name="far-align-center"></sl-icon>
        </sl-button>
        <sl-button aria-label="Align right" fill="ghost">
          <sl-icon name="far-align-right"></sl-icon>
        </sl-button>
        <sl-button aria-label="Align justify" fill="ghost">
          <sl-icon name="far-align-justify"></sl-icon>
        </sl-button>
      </sl-tool-bar-group>

      <sl-button fill="outline">
        <sl-icon name="far-scissors"></sl-icon>
        Cut
      </sl-button>
      <sl-button fill="outline">
        <sl-icon name="far-copy"></sl-icon>
        Copy
      </sl-button>
      <sl-button fill="outline">
        <sl-icon name="far-paste"></sl-icon>
        Paste
      </sl-button>
    `
  }
};
