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
import {
  faBold as fasBold,
  faItalic as fasItalic,
  faUnderline as fasUnderline
} from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-group/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

type Props = Pick<ToolBar, 'disabled' | 'noBorder'> & { items?(): TemplateResult; width?: string };
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
  faUnderline,
  fasBold,
  fasItalic,
  fasUnderline
);

export default {
  title: 'Components/Tool bar',
  tags: ['draft'],
  args: {
    disabled: false,
    noBorder: false
  },
  argTypes: {
    items: {
      table: { disable: true }
    }
  },
  render: ({ disabled, items, noBorder, width }) => {
    return html`
      <sl-tool-bar ?disabled=${disabled} ?no-border=${noBorder} style="inline-size: ${width ?? 'auto'}">
        ${items?.()}
      </sl-tool-bar>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    items: () => html`
      <sl-button-group>
        <sl-toggle-button aria-label="Bold">
          <sl-icon name="far-bold"></sl-icon>
          <sl-icon name="fas-bold" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Italic">
          <sl-icon name="far-italic"></sl-icon>
          <sl-icon name="fas-italic" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Underline">
          <sl-icon name="far-underline"></sl-icon>
          <sl-icon name="fas-underline" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-button-group>

      <sl-button-group>
        <sl-button aria-label="Align left">
          <sl-icon name="far-align-left"></sl-icon>
        </sl-button>
        <sl-button aria-label="Align center">
          <sl-icon name="far-align-center"></sl-icon>
        </sl-button>
        <sl-button aria-label="Align right">
          <sl-icon name="far-align-right"></sl-icon>
        </sl-button>
        <sl-button aria-label="Align justify">
          <sl-icon name="far-align-justify"></sl-icon>
        </sl-button>
      </sl-button-group>

      <sl-tool-bar-divider></sl-tool-bar-divider>

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

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Empty: Story = {};

export const FitContent: Story = {
  args: {
    items: () => html`<sl-button>Simple</sl-button>`,
    width: 'fit-content'
  }
};

export const NoBorder: Story = {
  args: {
    ...Basic.args,
    noBorder: true
  }
};

export const Overflow: Story = {
  args: {
    ...Basic.args,
    width: '48px'
  }
};
