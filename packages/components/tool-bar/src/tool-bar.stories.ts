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
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

type Props = Pick<ToolBar, 'align' | 'disabled' | 'noBorder'> & {
  description?: string;
  items?(): TemplateResult;
  resize?: boolean;
  width?: string;
};
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
  title: 'Actions/Tool bar',
  tags: ['draft'],
  args: {
    noBorder: false,
    resize: true
  },
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'end']
    },
    description: {
      table: { disable: true }
    },
    disabled: {
      control: 'boolean'
    },
    items: {
      table: { disable: true }
    },
    resize: {
      table: { disable: true }
    }
  },
  render: ({ align, description, disabled, items, noBorder, resize, width }) => {
    return html`
      ${description ? html`<p>${description}</p>` : nothing}
      <style>
        ${resize ? 'sl-tool-bar { overflow: auto; resize: horizontal; }' : nothing}
      </style>
      <sl-tool-bar
        align=${ifDefined(align)}
        ?disabled=${disabled}
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
    description:
      'This example shows a typical tool bar with text formatting options. You can resize the tool bar by dragging the right edge. This showcases how the tool bar can adapt to different widths and overflow items in a menu.',
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
    align: 'end',
    description: 'This example shows a tool bar with items aligned to the end.'
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    description: 'This example shows a disabled tool bar. It cannot be interacted with.',
    disabled: true
  }
};

export const Empty: Story = {
  args: {
    description: 'This example shows an empty tool bar. It should not take up any space.'
  }
};

export const FitContent: Story = {
  args: {
    description: 'This example shows a tool bar with a single button that fits its content.',
    items: () => html`<sl-button>Simple</sl-button>`,
    width: 'fit-content'
  }
};

export const NoBorder: Story = {
  args: {
    ...Basic.args,
    description:
      'This example shows a tool bar without a border. Without a border, it also does not have any inline padding. Please make sure that the focus outlines of the buttons are still visible.',
    noBorder: true,
    resize: false
  }
};

export const Overflow: Story = {
  args: {
    ...Basic.args,
    description:
      'This example shows a tool bar with many items that overflow into a menu. You can resize the tool bar by dragging the right edge.',
    width: '100px'
  }
};

export const Combination: Story = {
  render: () => html`
    <style>
      .container {
        align-items: center;
        border: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
        border-radius: var(--sl-size-borderRadius-default);
        display: flex;
        gap: var(--sl-size-100);
        inline-size: 400px;
        overflow: auto;
        padding-inline: var(--sl-size-100);
        resize: horizontal;

        sl-tool-bar {
          flex: 1 1 0;
          min-inline-size: 0;
        }

        > span {
          flex-shrink: 0;
        }
      }
    </style>
    <p>
      This example shows a tool bar with a combination of other elements and styles. The container has a max inline
      size, which the tool bar should respect.
    </p>
    <div class="container">
      <span>Some text in front</span>
      <sl-tool-bar no-border>
        <sl-button>Button 1</sl-button>
        <sl-button>Button 2</sl-button>
        <sl-button>Button 3</sl-button>
        <sl-button>Button 4</sl-button>
        <sl-button>Button 5</sl-button>
        <sl-button>Button 6</sl-button>
        <sl-button>Button 7</sl-button>
      </sl-tool-bar>
    </div>
  `
};
