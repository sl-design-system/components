/* eslint-disable slds/button-has-label */
import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faArrowDownWideShort,
  faArrowTurnLeftDown,
  faBarsFilter,
  faBold,
  faBoxArchive,
  faCopy,
  faFont,
  faGear,
  faItalic,
  faPaperPlane,
  faPaste,
  faPen,
  faScissors,
  faTrash,
  faUnderline,
  faUniversalAccess
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
import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import { tooltip } from '@sl-design-system/tooltip';
import '@sl-design-system/tooltip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

type Props = Pick<ToolBar, 'align' | 'contained' | 'disabled' | 'inverted' | 'type'> & {
  description?: string | TemplateResult;
  items?(): TemplateResult;
  resizable?: boolean;
  width?: string;
};
type Story = StoryObj<Props>;

Icon.register(
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faArrowDownWideShort,
  faArrowTurnLeftDown,
  faBarsFilter,
  faBold,
  faBoxArchive,
  faCopy,
  faFont,
  faGear,
  faItalic,
  faPaperPlane,
  faPaste,
  faPen,
  faScissors,
  faTrash,
  faUnderline,
  fasAlignCenter,
  fasAlignJustify,
  fasAlignLeft,
  fasAlignRight,
  fasBold,
  fasItalic,
  fasUnderline,
  faUniversalAccess
);

export default {
  title: 'Actions/Tool bar',
  tags: ['draft'],
  args: {
    resizable: true
  },
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'end']
    },
    contained: {
      control: 'boolean'
    },
    description: {
      table: { disable: true }
    },
    disabled: {
      control: 'boolean'
    },
    inverted: {
      control: 'boolean'
    },
    items: {
      table: { disable: true }
    },
    resizable: {
      control: 'boolean'
    },
    type: {
      control: 'inline-radio',
      options: ['ghost', 'outline']
    }
  },
  render: ({ align, contained, description, disabled, inverted, items, resizable, type, width }) => {
    return html`
      ${description ? html`<p>${description}</p>` : nothing}
      <style>
        ${inverted && !contained
          ? '.container { background: var(--sl-color-background-primary-bold); padding: 1.2rem; }'
          : nothing}
        ${resizable ? '.container { overflow: auto; resize: horizontal; }' : nothing}
        ${!contained ? 'sl-tool-bar { margin:  6px; }' : nothing}
      </style>
      <div class="container">
        <sl-tool-bar
          ?contained=${contained}
          ?disabled=${disabled}
          ?inverted=${inverted}
          align=${ifDefined(align)}
          type=${ifDefined(type)}
          style="inline-size: ${width ?? 'auto'}"
        >
          ${items?.()}
        </sl-tool-bar>
      </div>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    description:
      'This example shows a typical tool bar with buttons and menus. You can resize the tool bar by dragging the right edge. This showcases how the tool bar can adapt to different widths and overflow items in a menu. This example shows a typical tool bar with buttons and menus. You can resize the tool bar by dragging the right edge. This showcases how the tool bar can adapt to different widths and overflow items in a menu.\n' +
      '    By default a tool bar does not have any padding and has no border. Please make sure that the focus outlines of the buttons are still visible.',
    items: () => html`
      <sl-button fill="outline" size="md">Button</sl-button>
      <sl-button fill="outline">
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
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-menu-button>
        <div slot="button">Edit</div>
        <sl-menu-item>
          <sl-icon name="far-pen"></sl-icon>
          Rename...
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-trash"></sl-icon>
          Delete...
        </sl-menu-item>
      </sl-menu-button>
      <sl-menu-button fill="outline">
        <div slot="button">More</div>
        <sl-menu-item>
          <sl-icon name="far-copy"></sl-icon>
          Duplicate
        </sl-menu-item>
        <sl-menu-item disabled>
          <sl-icon name="far-trash"></sl-icon>
          Remove (disabled)
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-paste"></sl-icon>
          Paste special...
        </sl-menu-item>
      </sl-menu-button>
    `
  }
};

export const Contained: Story = {
  args: {
    ...Basic.args,
    description:
      'This example shows a contained tool bar with a border and padding. The border and spacing help distinguish the tool bar from the surrounding content.',
    contained: true
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
    description: 'This example shows an empty (contained) tool bar. It should not take up any space.',
    contained: true
  }
};

export const FitContent: Story = {
  args: {
    description: 'This example shows a tool bar with a single button that fits its content.',
    items: () => html`<sl-button fill="outline">Simple</sl-button>`,
    width: 'fit-content',
    contained: true
  }
};

export const Inverted: Story = {
  args: {
    description: html`
      This example shows a tool bar with inverted buttons. You have to set the
      <code>inverted</code> attribute on the tool bar, otherwise the menu button will not be inverted.
    `,
    inverted: true,
    items: () => html`
      <sl-button fill="outline" variant="inverted">Action 1</sl-button>
      <sl-button fill="outline" variant="inverted">Action 2</sl-button>
      <sl-tool-bar-divider inverted></sl-tool-bar-divider>
      <sl-button fill="outline" variant="inverted">Action 3</sl-button>
      <sl-button fill="outline" variant="inverted">Action 4</sl-button>
      <sl-button fill="outline" variant="inverted">Action 5</sl-button>
      <sl-button fill="outline" variant="inverted">Action 6</sl-button>
    `,
    width: '400px'
  }
};

export const InvertedContained: Story = {
  args: {
    contained: true,
    description: html`
      This example shows a contained tool bar with inverted buttons. You have to set the
      <code>inverted</code> attribute on the tool bar, otherwise the menu button will not be inverted.
    `,
    inverted: true,
    items: () => html`
      <sl-button fill="outline" variant="inverted">Action 1</sl-button>
      <sl-button fill="outline" variant="inverted">Action 2</sl-button>
      <sl-button fill="outline" variant="inverted">Action 3</sl-button>
      <sl-button fill="outline" variant="inverted">Action 4</sl-button>
      <sl-button fill="outline" variant="inverted">Action 5</sl-button>
      <sl-button fill="outline" variant="inverted">Action 6</sl-button>
    `,
    width: '400px'
  }
};

export const Overflow: Story = {
  args: {
    ...Basic.args,
    contained: true,
    description:
      'This example shows a tool bar with many items that overflow into a menu. You can resize the tool bar by dragging the right edge.',
    width: '100px'
  }
};

export const State: Story = {
  args: {
    description:
      'This example shows a how the tool bar automatically updates when the disabled state of buttons changes.',
    items: () => {
      const onClick = (event: Event) => {
        const buttons = (event.target as HTMLElement).parentElement?.querySelectorAll<Button>(
          'sl-button:not(:first-child)'
        );

        buttons?.forEach(button => {
          button.disabled = !button.disabled;
        });
      };

      return html`
        <sl-button @click=${onClick} fill="outline">Toggle disabled</sl-button>
        <sl-button fill="outline">Action 1</sl-button>
        <sl-button fill="outline">Action 2</sl-button>
        <sl-button fill="outline">Action 3</sl-button>
      `;
    }
  }
};

export const Tooltips: Story = {
  args: {
    description: 'This example shows a tool bar with different tooltip techniques on the buttons.',
    items: () => html`
      <sl-button aria-describedby="tooltip-bold" fill="outline">
        <sl-icon name="far-bold"></sl-icon>
      </sl-button>
      <sl-tooltip id="tooltip-bold">Bold</sl-tooltip>

      <sl-button ${tooltip('Italic')} fill="outline">
        <sl-icon name="far-italic"></sl-icon>
      </sl-button>

      <sl-button aria-disabled="true" ${tooltip('Underline (disabled)')} fill="outline">
        <sl-icon name="far-underline"></sl-icon>
      </sl-button>
    `
  }
};

export const IconOnly: Story = {
  render: ({ align, contained, disabled, inverted, resizable, type, width }) => {
    return html`
      <style>
        ${inverted && !contained
          ? '.container { background: var(--sl-color-background-primary-bold); padding: 1.2rem; }'
          : nothing}
        ${resizable ? '.container { overflow: auto; resize: horizontal; }' : nothing}
      </style>
      <p>This example shows a tool bar with icon only buttons / menu buttons with tooltips.</p>
      <div class="container">
        <sl-tool-bar
          ?contained=${contained}
          ?disabled=${disabled}
          ?inverted=${inverted}
          align=${ifDefined(align)}
          type=${ifDefined(type)}
          style="inline-size: ${width ?? 'auto'}"
        >
          <sl-button aria-describedby="tooltip-bold" fill="outline">
            <sl-icon name="far-bold"></sl-icon>
          </sl-button>
          <sl-tooltip id="tooltip-bold">Bold</sl-tooltip>

          <sl-button aria-describedby="tooltip-italic" fill="outline">
            <sl-icon name="far-italic"></sl-icon>
          </sl-button>
          <sl-tooltip id="tooltip-italic">Italic</sl-tooltip>

          <sl-button aria-disabled="true" aria-describedby="tooltip-underline-disabled" fill="outline">
            <sl-icon name="far-underline"></sl-icon>
          </sl-button>
          <sl-tooltip id="tooltip-underline-disabled">Underline (disabled)</sl-tooltip>

          <sl-button aria-describedby="tooltip-underline" fill="outline">
            <sl-icon name="far-underline"></sl-icon>
          </sl-button>
          <sl-tooltip id="tooltip-underline">Underline</sl-tooltip>

          <sl-menu-button aria-describedby="tooltip-settings" fill="outline">
            <sl-icon name="far-gear" slot="button"></sl-icon>
            <sl-menu-item>
              <sl-icon name="far-pen"></sl-icon>
              Rename...
            </sl-menu-item>
            <sl-menu-item>
              <sl-icon name="far-trash"></sl-icon>
              Delete...
            </sl-menu-item>
          </sl-menu-button>
          <sl-tooltip id="tooltip-settings">Settings</sl-tooltip>

          <sl-menu-button aria-describedby="tooltip-edit" fill="outline">
            <sl-icon name="far-pen" slot="button"></sl-icon>
            <sl-menu-item>
              <sl-icon name="far-pen"></sl-icon>
              Rename...
            </sl-menu-item>
            <sl-menu-item>
              <sl-icon name="far-trash"></sl-icon>
              Delete...
            </sl-menu-item>
          </sl-menu-button>
          <sl-tooltip id="tooltip-edit">Edit</sl-tooltip>
        </sl-tool-bar>
      </div>

      <p>This example shows a tool bar with icon only buttons / menu buttons with aria-label.</p>
      <div class="container">
        <sl-tool-bar
          ?contained=${contained}
          ?disabled=${disabled}
          ?inverted=${inverted}
          align=${ifDefined(align)}
          type=${ifDefined(type)}
          style="inline-size: ${width ?? 'auto'}"
        >
          <sl-button aria-label="Bold" fill="outline">
            <sl-icon name="far-bold"></sl-icon>
          </sl-button>

          <sl-button aria-label="Italic" fill="outline">
            <sl-icon name="far-italic"></sl-icon>
          </sl-button>

          <sl-button aria-disabled="true" aria-label="Underline (disabled)" fill="outline">
            <sl-icon name="far-underline"></sl-icon>
          </sl-button>

          <sl-button aria-label="Underline" fill="outline">
            <sl-icon name="far-underline"></sl-icon>
          </sl-button>

          <sl-menu-button aria-label="Settings" fill="outline">
            <sl-icon name="far-gear" slot="button"></sl-icon>
            <sl-menu-item>
              <sl-icon name="far-pen"></sl-icon>
              Rename...
            </sl-menu-item>
            <sl-menu-item>
              <sl-icon name="far-trash"></sl-icon>
              Delete...
            </sl-menu-item>
          </sl-menu-button>

          <sl-menu-button aria-label="Edit" fill="outline">
            <sl-icon name="far-pen" slot="button"></sl-icon>
            <sl-menu-item>
              <sl-icon name="far-pen"></sl-icon>
              Rename...
            </sl-menu-item>
            <sl-menu-item>
              <sl-icon name="far-trash"></sl-icon>
              Delete...
            </sl-menu-item>
          </sl-menu-button>
        </sl-tool-bar>
      </div>
    `;
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
      <sl-tool-bar align="end">
        <sl-button fill="outline">Button 1</sl-button>
        <sl-button fill="outline">Button 2</sl-button>
        <sl-button fill="outline">Button 3</sl-button>
        <sl-button fill="outline">Button 4</sl-button>
        <sl-button fill="outline">Button 5</sl-button>
        <sl-button fill="outline">Button 6</sl-button>
        <sl-button fill="outline">Button 7</sl-button>
      </sl-tool-bar>
    </div>
  `
};

export const Examples: Story = {
  render: () => html`
    <style>
      sl-tool-bar {
        margin-block-end: var(--sl-size-300);
      }
    </style>
    <p>
      This story shows various real-world toolbar configurations: icon-only buttons, menu buttons with icons, buttons
      with ARIA labels, primary/danger/inverted variants, and toolbar types such as outline and ghost.
    </p>
    <sl-tool-bar aria-label="Text formatting" contained type="outline" style="inline-size: fit-content">
      <sl-button aria-label="Accessibility">
        <sl-icon name="far-universal-access"></sl-icon>
      </sl-button>

      <sl-menu-button aria-label="Font">
        <span slot="button"><sl-icon style="vertical-align: text-top;" name="far-font"></sl-icon></span>
        <sl-menu-item> 10 pt </sl-menu-item>
        <sl-menu-item> 12 pt </sl-menu-item>
        <sl-menu-item> 14 pt </sl-menu-item>
        <sl-menu-item> 16 pt </sl-menu-item>
        <sl-menu-item> 18 pt </sl-menu-item>
        <sl-menu-item> 20 pt </sl-menu-item>
      </sl-menu-button>

      <sl-menu-button aria-label="Edit">
        <span slot="button"><sl-icon style="vertical-align: text-top;" name="far-align-center"></sl-icon></span>
        <sl-menu-item>
          <sl-icon name="far-align-justify"></sl-icon>
          Justify
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-align-center"></sl-icon>
          Align center
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-align-left"></sl-icon>
          Align left
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-align-right"></sl-icon>
          Align right
        </sl-menu-item>
      </sl-menu-button>

      <sl-button aria-label="Edit">
        <sl-icon name="far-pen"></sl-icon>
      </sl-button>
    </sl-tool-bar>

    <sl-tool-bar aria-label="Options" contained type="ghost" style="inline-size: fit-content">
      <sl-button aria-label="Copy"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button aria-label="Edit"><sl-icon name="far-pen"></sl-icon></sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Archive"><sl-icon name="far-box-archive"></sl-icon>Archive</sl-button>
      <sl-button aria-label="Delete" variant="danger"> <sl-icon name="far-trash"></sl-icon>Delete</sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Send" variant="primary"><sl-icon name="far-paper-plane"></sl-icon>Send</sl-button>
    </sl-tool-bar>

    <sl-tool-bar aria-label="Options" contained inverted type="ghost" style="inline-size: fit-content">
      <sl-button aria-label="Copy" variant="inverted"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button aria-label="Edit" variant="inverted"><sl-icon name="far-pen"></sl-icon></sl-button>
      <sl-tool-bar-divider inverted></sl-tool-bar-divider>
      <sl-button aria-label="Archive" variant="inverted"> <sl-icon name="far-box-archive"></sl-icon>Archive </sl-button>
      <sl-button aria-label="Delete" variant="inverted"> <sl-icon name="far-trash"></sl-icon>Delete</sl-button>
      <sl-tool-bar-divider inverted></sl-tool-bar-divider>
      <sl-button aria-label="Send" variant="inverted"> <sl-icon name="far-paper-plane"></sl-icon>Send </sl-button>
    </sl-tool-bar>

    <sl-tool-bar aria-label="Filtering and sorting" contained type="ghost" style="inline-size: fit-content">
      <sl-button aria-label="Copy"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button aria-label="Enter"><sl-icon name="far-arrow-turn-left-down"></sl-icon></sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Filter"><sl-icon name="far-bars-filter"></sl-icon></sl-button>
      <sl-button aria-label="Sort descending"> <sl-icon name="far-arrow-down-wide-short"></sl-icon></sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-menu-button aria-label="Sort by">
        <span slot="button">Date</span>
        <sl-menu-item-group heading="Sort by">
          <sl-menu-item> From </sl-menu-item>
          <sl-menu-item> Category </sl-menu-item>
          <sl-menu-item> Size </sl-menu-item>
          <sl-menu-item> Importance </sl-menu-item>
        </sl-menu-item-group>
      </sl-menu-button>
    </sl-tool-bar>

    <sl-tool-bar aria-label="Filtering and sorting" contained inverted type="ghost" style="inline-size: fit-content">
      <sl-button aria-label="Copy" variant="inverted"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button aria-label="Enter" variant="inverted"><sl-icon name="far-arrow-turn-left-down"></sl-icon></sl-button>
      <sl-tool-bar-divider inverted></sl-tool-bar-divider>
      <sl-button aria-label="Filter" variant="inverted"><sl-icon name="far-bars-filter"></sl-icon></sl-button>
      <sl-button aria-label="Sort descending" variant="inverted">
        <sl-icon name="far-arrow-down-wide-short"></sl-icon>
      </sl-button>
      <sl-tool-bar-divider inverted></sl-tool-bar-divider>
      <sl-menu-button aria-label="Sort by" variant="inverted">
        <span slot="button">Date</span>
        <sl-menu-item-group heading="Sort by">
          <sl-menu-item> From </sl-menu-item>
          <sl-menu-item> Category </sl-menu-item>
          <sl-menu-item> Size </sl-menu-item>
          <sl-menu-item> Importance </sl-menu-item>
        </sl-menu-item-group>
      </sl-menu-button>
    </sl-tool-bar>
  `
};
