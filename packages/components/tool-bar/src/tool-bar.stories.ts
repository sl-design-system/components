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
  faAlignCenter as fasAlignCenter,
  faAlignJustify as fasAlignJustify,
  faAlignLeft as fasAlignLeft,
  faAlignRight as fasAlignRight,
  faBold as fasBold,
  faItalic as fasItalic,
  faUnderline as fasUnderline
} from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

type Props = Pick<ToolBar, 'align' | 'disabled' | 'noBorder'> & { items?(): TemplateResult; width?: string };
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
  fasAlignCenter,
  fasAlignJustify,
  fasAlignLeft,
  fasAlignRight,
  fasBold,
  fasItalic,
  fasUnderline
);

export default {
  title: 'Components/Tool bar',
  tags: ['draft'],
  args: {
    noBorder: false
  },
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'end']
    },
    disabled: {
      control: 'boolean'
    },
    items: {
      table: { disable: true }
    }
  },
  render: ({ align, disabled, items, noBorder, width }) => {
    return html`
      <sl-tool-bar
        align=${ifDefined(align)}
        .disabled=${disabled}
        ?no-border=${noBorder}
        style="inline-size: ${width ?? 'auto'}"
      >
        ${items?.()}
      </sl-tool-bar>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    items: () => html`
      <sl-toggle-group multiple>
        <sl-toggle-button aria-label="Bold">
          <sl-icon name="far-bold" slot="default"></sl-icon>
          <sl-icon name="fas-bold" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Italic">
          <sl-icon name="far-italic" slot="default"></sl-icon>
          <sl-icon name="fas-italic" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Underline">
          <sl-icon name="far-underline" slot="default"></sl-icon>
          <sl-icon name="fas-underline" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>

      <sl-toggle-group>
        <sl-toggle-button aria-label="Align left">
          <sl-icon name="far-align-left" slot="default"></sl-icon>
          <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Align center">
          <sl-icon name="far-align-center" slot="default"></sl-icon>
          <sl-icon name="fas-align-center" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Align right">
          <sl-icon name="far-align-right" slot="default"></sl-icon>
          <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
        </sl-toggle-button>
        <sl-toggle-button aria-label="Align justify">
          <sl-icon name="far-align-justify" slot="default"></sl-icon>
          <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
        </sl-toggle-button>
      </sl-toggle-group>

      <sl-tool-bar-divider></sl-tool-bar-divider>

      <sl-button disabled fill="outline">
        <sl-icon name="far-scissors"></sl-icon>
        Cut
      </sl-button>
      <sl-button disabled fill="outline">
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

export const AlignEnd: Story = {
  args: {
    ...Basic.args,
    align: 'end'
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
    width: '100px'
  }
};
