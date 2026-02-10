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
  faUnderline as fasUnderline,
  faUniversalAccess as fasUniversalAccess
} from '@fortawesome/pro-solid-svg-icons';
import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import { type ToggleButton } from '@sl-design-system/toggle-button';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import { tooltip } from '@sl-design-system/tooltip';
import '@sl-design-system/tooltip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

type Props = Pick<ToolBar, 'align' | 'contained' | 'disabled' | 'inverted' | 'fill'> & {
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
  fasUniversalAccess,
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
    fill: {
      control: 'inline-radio',
      options: ['ghost', 'outline']
    }
  },
  render: ({ align, contained, description, disabled, inverted, items, resizable, fill, width }) => {
    return html`
      ${description ? html`<p>${description}</p>` : nothing}
      <style>
        ${resizable ? '.container { overflow: auto; resize: horizontal; }' : nothing}
          .container:has(sl-tool-bar:not([contained])) {
          padding: 6px; /* place for focus outline */
        }

        .container:has(sl-tool-bar[inverted]:not([contained])) {
          background: var(--sl-color-background-primary-bold);
          padding: 1.2rem;
        }
      </style>
      <div class="container">
        <sl-tool-bar
          ?contained=${contained}
          ?inverted=${inverted}
          .disabled=${ifDefined(disabled)}
          align=${ifDefined(align)}
          fill=${ifDefined(fill)}
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
      'This example shows a typical tool bar with buttons and menus. You can resize the tool bar by dragging the right edge. This showcases how the tool bar can adapt to different widths and overflow items in a menu.\n' +
      'By default a tool bar does not have any padding and has no border. Please make sure that the focus outlines of the buttons are still visible.',
    items: () => html`
      <sl-button fill="outline">Button</sl-button>
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
    description: 'This example shows a tool bar with items that fit their content.',
    items: () => html`
      <sl-button fill="outline">Bold</sl-button>
      <sl-button fill="outline">Italic</sl-button>
      <sl-button fill="outline">Underline</sl-button>
      <sl-button fill="outline">Other</sl-button>
    `,
    width: 'fit-content',
    contained: true
  }
};

export const NestedContent: Story = {
  args: {
    description:
      'This example shows a tool bar with a single button that is wrapped in two <div> elements. This is to check that nested content is handled correctly.',
    items: () => html`
      <div>
        <div><sl-button fill="outline">Simple</sl-button></div>
      </div>
    `,
    width: 'fit-content',
    contained: true
  }
};

export const Inverted: Story = {
  args: {
    description: html`
      This example shows a tool bar with inverted buttons. You have to set the
      <code>inverted</code> attribute on the tool bar, otherwise the menu button will not be inverted. By default, a
      tool bar does not have any padding and has no border. Please make sure that the focus outlines of the buttons are
      still visible.
    `,
    inverted: true,
    items: () => html`
      <sl-button fill="outline">Action 1</sl-button>
      <sl-button fill="outline">Action 2</sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button fill="outline">Action 3</sl-button>
      <sl-button fill="outline">Action 4</sl-button>
      <sl-button fill="outline">Action 5</sl-button>
      <sl-button fill="outline">Action 6</sl-button>
      <sl-button fill="outline">Action 7</sl-button>
      <sl-button fill="outline">Action 8</sl-button>
    `
  }
};

export const InvertedContained: Story = {
  args: {
    contained: true,
    description: html`This example shows a contained tool bar with inverted buttons and a width set to 400px.`,
    inverted: true,
    items: () => html`
      <sl-button fill="outline">Action 1</sl-button>
      <sl-button fill="outline">Action 2</sl-button>
      <sl-button fill="outline">Action 3</sl-button>
      <sl-button fill="outline">Action 4</sl-button>
      <sl-button fill="outline">Action 5</sl-button>
      <sl-button fill="outline">Action 6</sl-button>
    `,
    width: '400px'
  }
};

export const ClickEvents: Story = {
  args: {
    width: '240px',
    description: 'This example shows a tool bar with buttons that log click events to the console.',
    items: () => {
      const handleClick = (event: Event, actionName: string) => {
        console.log(`${actionName} clicked`, event);
        alert(`${actionName} clicked`);
      };

      return html`
        <sl-button @click=${(e: Event) => handleClick(e, 'Button 1')} fill="outline">Button 1</sl-button>
        <sl-button @click=${(e: Event) => handleClick(e, 'Button 2')} fill="outline">
          <sl-icon name="far-gear"></sl-icon>
          Button 2
        </sl-button>
        <sl-tool-bar-divider></sl-tool-bar-divider>
        <sl-button @click=${(e: Event) => handleClick(e, 'Button 3')} fill="outline">
          <sl-icon name="far-pen"></sl-icon>
          Button 3
        </sl-button>
        <sl-menu-button @click=${(e: Event) => handleClick(e, 'Menu Button')} fill="outline">
          <div slot="button">Menu</div>
          <sl-menu-item @click=${(e: Event) => handleClick(e, 'Menu Item 1')}>
            <sl-icon name="far-pen"></sl-icon>
            Item 1
          </sl-menu-item>
          <sl-menu-item @click=${(e: Event) => handleClick(e, 'Menu Item 2')}>
            <sl-icon name="far-trash"></sl-icon>
            Item 2
          </sl-menu-item>
        </sl-menu-button>
      `;
    }
  }
};

export const Overflow: Story = {
  args: {
    ...Basic.args,
    contained: true,
    description: 'This example shows a tool bar with many items that overflow into a menu.',
    width: '100px'
  }
};

export const State: Story = {
  args: {
    description:
      'This example shows a how the tool bar automatically updates when the disabled state of buttons changes.',
    items: () => {
      const onClick = (event: Event) => {
        const toggle = event.target as ToggleButton;
        const buttons = toggle.parentElement?.querySelectorAll<Button>('sl-button');
        const liveRegion = toggle.parentElement?.querySelector('#live-region');

        buttons?.forEach((button: Button) => {
          button.disabled = toggle.pressed;
        });

        if (liveRegion) {
          liveRegion.textContent = toggle.pressed ? 'Actions disabled' : 'Actions enabled';
        }
      };

      return html`
        <style>
          sl-toggle-button {
            --sl-size-075: var(--sl-size-100);
          }
        </style>
        <sl-toggle-button aria-controls="action-1 action-2 action-3" @sl-toggle=${onClick} fill="outline">
          <sl-icon name="far-universal-access" slot="default"></sl-icon>
          <sl-icon name="fas-universal-access" slot="pressed"></sl-icon>
          Toggle disabled
        </sl-toggle-button>
        <sl-button id="action-1" fill="outline">Action 1</sl-button>
        <sl-button id="action-2" fill="outline">Action 2</sl-button>
        <sl-button id="action-3" fill="outline">Action 3</sl-button>
        <div
          id="live-region"
          aria-live="polite"
          style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;"
        ></div>
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
  render: ({ align, contained, disabled, inverted, resizable, fill, width }) => {
    return html`
      <style>
        .container[resizable] {
          overflow: auto;
          resize: horizontal;
        }

        .container {
          padding: 0.4rem; /* place for focus outline */
        }

        .container:has(sl-tool-bar[inverted]:not([contained])) {
          background: var(--sl-color-background-primary-bold);
          padding: 1.2rem;
        }
      </style>
      <p>This example shows a tool bar with icon only buttons / menu buttons with tooltips.</p>
      <div class="container" ?resizable=${resizable}>
        <sl-tool-bar
          ?contained=${contained}
          ?disabled=${disabled}
          ?inverted=${inverted}
          align=${ifDefined(align)}
          fill=${ifDefined(fill)}
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
      <div class="container" ?resizable=${resizable}>
        <sl-tool-bar
          ?contained=${contained}
          ?disabled=${disabled}
          ?inverted=${inverted}
          align=${ifDefined(align)}
          fill=${ifDefined(fill)}
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
        border-radius: var(--sl-size-borderRadius-default);
        box-shadow: var(--sl-elevation-shadow-overflow);
        display: flex;
        gap: var(--sl-size-100);
        inline-size: 400px;
        overflow: auto;
        padding: var(--sl-size-100);
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
      with ARIA labels, primary/danger/inverted variants, and toolbar fills such as outline and ghost.
    </p>
    <sl-tool-bar aria-label="Text formatting" contained fill="outline" style="inline-size: fit-content">
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

    <sl-tool-bar aria-label="Options" contained fill="ghost" style="inline-size: fit-content">
      <sl-button aria-label="Copy"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button aria-label="Edit"><sl-icon name="far-pen"></sl-icon></sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Archive"><sl-icon name="far-box-archive"></sl-icon>Archive</sl-button>
      <sl-button aria-label="Delete" variant="danger"> <sl-icon name="far-trash"></sl-icon>Delete</sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Send" variant="primary"><sl-icon name="far-paper-plane"></sl-icon>Send</sl-button>
    </sl-tool-bar>

    <sl-tool-bar aria-label="Options" contained inverted fill="ghost" style="inline-size: fit-content">
      <sl-button aria-label="Copy"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button aria-label="Edit"><sl-icon name="far-pen"></sl-icon></sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Archive"><sl-icon name="far-box-archive"></sl-icon>Archive</sl-button>
      <sl-button aria-label="Delete"><sl-icon name="far-trash"></sl-icon>Delete</sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Send"><sl-icon name="far-paper-plane"></sl-icon>Send</sl-button>
    </sl-tool-bar>

    <sl-tool-bar aria-label="Filtering and sorting" contained fill="ghost" style="inline-size: fit-content">
      <sl-button aria-label="Copy"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button aria-label="Enter"><sl-icon name="far-arrow-turn-left-down"></sl-icon></sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Filter"><sl-icon name="far-bars-filter"></sl-icon></sl-button>
      <sl-button aria-label="Sort descending"><sl-icon name="far-arrow-down-wide-short"></sl-icon></sl-button>
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

    <sl-tool-bar aria-label="Filtering and sorting" contained inverted fill="ghost" style="inline-size: fit-content">
      <sl-button aria-label="Copy"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button aria-label="Enter"><sl-icon name="far-arrow-turn-left-down"></sl-icon></sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button aria-label="Filter"><sl-icon name="far-bars-filter"></sl-icon></sl-button>
      <sl-button aria-label="Sort descending">
        <sl-icon name="far-arrow-down-wide-short"></sl-icon>
      </sl-button>
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
  `
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          display: grid;
          align-items: center;
          grid-template-columns: auto 1fr 1fr;
          gap: 1rem;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="justify-self: center; grid-column: 2 / 3">Contained</span>
        <span style="justify-self: center; grid-column: 3 / 3">Non-contained (default)</span>

        <span>Ghost</span>
        <sl-tool-bar aria-label="Options" contained fill="ghost">
          <sl-button aria-label="Copy">Button 1</sl-button>
          <sl-button aria-label="Edit">Button 2</sl-button>
          <sl-button aria-label="Archive">Button 3</sl-button>
          <sl-button aria-label="Delete">Button 4</sl-button>
          <sl-button aria-label="Send">Button 5</sl-button>
        </sl-tool-bar>
        <sl-tool-bar aria-label="Options" fill="ghost">
          <sl-button aria-label="Copy">Button 1</sl-button>
          <sl-button aria-label="Edit">Button 2</sl-button>
          <sl-button aria-label="Archive">Button 3</sl-button>
          <sl-button aria-label="Delete">Button 4</sl-button>
          <sl-button aria-label="Send">Button 5</sl-button>
        </sl-tool-bar>

        <span>Outline</span>
        <sl-tool-bar aria-label="Options" contained fill="outline">
          <sl-button aria-label="Copy">Button 1</sl-button>
          <sl-button aria-label="Edit">Button 2</sl-button>
          <sl-button aria-label="Archive">Button 3</sl-button>
          <sl-button aria-label="Delete">Button 4</sl-button>
          <sl-button aria-label="Send">Button 5</sl-button>
        </sl-tool-bar>
        <sl-tool-bar aria-label="Options" fill="outline">
          <sl-button aria-label="Copy">Button 1</sl-button>
          <sl-button aria-label="Edit">Button 2</sl-button>
          <sl-button aria-label="Archive">Button 3</sl-button>
          <sl-button aria-label="Delete">Button 4</sl-button>
          <sl-button aria-label="Send">Button 5</sl-button>
        </sl-tool-bar>

        <span>Ghost inverted</span>
        <sl-tool-bar aria-label="Options" contained inverted fill="ghost">
          <sl-button aria-label="Copy">Button 1</sl-button>
          <sl-button aria-label="Edit">Button 2</sl-button>
          <sl-button aria-label="Archive">Button 3</sl-button>
          <sl-button aria-label="Delete">Button 4</sl-button>
          <sl-button aria-label="Send">Button 5</sl-button>
        </sl-tool-bar>
        <div style="background: var(--sl-color-background-primary-bold); padding: 1.6rem;">
          <sl-tool-bar aria-label="Options" inverted fill="ghost">
            <sl-button aria-label="Copy">Button 1</sl-button>
            <sl-button aria-label="Edit">Button 2</sl-button>
            <sl-button aria-label="Archive">Button 3</sl-button>
            <sl-button aria-label="Delete">Button 4</sl-button>
            <sl-button aria-label="Send">Button 5</sl-button>
          </sl-tool-bar>
        </div>

        <span>Outline inverted</span>
        <sl-tool-bar aria-label="Options" contained inverted fill="outline">
          <sl-button aria-label="Copy">Button 1</sl-button>
          <sl-button aria-label="Edit">Button 2</sl-button>
          <sl-button aria-label="Archive">Button 3</sl-button>
          <sl-button aria-label="Delete">Button 4</sl-button>
          <sl-button aria-label="Send">Button 5</sl-button>
        </sl-tool-bar>
        <div style="background: var(--sl-color-background-primary-bold); padding: 1.6rem;">
          <sl-tool-bar aria-label="Options" inverted fill="outline">
            <sl-button aria-label="Copy">Button 1</sl-button>
            <sl-button aria-label="Edit">Button 2</sl-button>
            <sl-button aria-label="Archive">Button 3</sl-button>
            <sl-button aria-label="Delete">Button 4</sl-button>
            <sl-button aria-label="Send">Button 5</sl-button>
          </sl-tool-bar>
        </div>
      </div>
    `;
  }
};
