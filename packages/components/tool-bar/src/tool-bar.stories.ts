/* eslint-disable slds/button-has-label */
import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBold,
  faCopy,
  faItalic,
  faPaste,
  faPen,
  faScissors,
  faTrash,
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
  faBold,
  faCopy,
  faItalic,
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
  fasUnderline
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
      'This example shows a typical tool bar with buttons and menus. You can resize the tool bar by dragging the right edge. This showcases how the tool bar can adapt to different widths and overflow items in a menu.',
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
      'This example shows a tool bar without a border. Without a border, it also does not have any inline padding. Please make sure that the focus outlines of the buttons are still visible.',
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
    items: () => html`<sl-button>Simple</sl-button>`,
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
      This example shows a tool bar with inverted buttons. You have to set the
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
        <sl-button @click=${onClick}>Toggle disabled</sl-button>
        <sl-button>Action 1</sl-button>
        <sl-button>Action 2</sl-button>
        <sl-button>Action 3</sl-button>
      `;
    }
  }
};

export const Tooltips: Story = {
  args: {
    description: 'This example shows a tool bar with different tooltip techniques on the buttons.',
    items: () => html`
      <sl-button aria-describedby="tooltip-bold">
        <sl-icon name="far-bold"></sl-icon>
      </sl-button>
      <sl-tooltip id="tooltip-bold">Bold</sl-tooltip>

      <sl-button ${tooltip('Italic')}>
        <sl-icon name="far-italic"></sl-icon>
      </sl-button>

      <sl-button aria-disabled="true" ${tooltip('Underline (disabled)')}>
        <sl-icon name="far-underline"></sl-icon>
      </sl-button>
    `
  }
};

export const IconOnly: Story = {
  args: {
    description: 'This example shows a tool bar with different tooltip techniques on the buttons.',
    items: () => html`
      <sl-button aria-describedby="tooltip-bold">
        <sl-icon name="far-bold"></sl-icon>
      </sl-button>
      <sl-tooltip id="tooltip-bold">Bold</sl-tooltip>

      <sl-button ${tooltip('Italic')}>
        <sl-icon name="far-italic"></sl-icon>
      </sl-button>

      <sl-button aria-disabled="true" ${tooltip('Underline (disabled)')}>
        <sl-icon name="far-underline"></sl-icon>
      </sl-button>

      <sl-button aria-label="Underline">
        <sl-icon name="far-underline"></sl-icon>
      </sl-button>

      <sl-menu-button aria-label="Settings">
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

      <sl-menu-button style="align-self:center;justify-self:center;" ${tooltip('Edit...')}>
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
    `
  }
}; // TODO: icon only aria-label not working with overflow

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
      <sl-tool-bar align="end" no-border>
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

// TODO: check and fix panel and bulk actions
