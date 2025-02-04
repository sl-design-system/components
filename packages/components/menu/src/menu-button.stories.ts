import {
  faArrowUpShortWide,
  faGear,
  faList,
  faPen,
  faRectanglesMixed,
  faTableCells,
  faTableRows,
  faTrash
} from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/avatar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type MenuButton } from './menu-button.js';

type Props = Pick<MenuButton, 'disabled' | 'fill' | 'position' | 'size' | 'variant'> & {
  alignSelf: string;
  body: string | TemplateResult;
  justifySelf: string;
  label?: string;
  menuItems?(): TemplateResult;
};
type Story = StoryObj<Props>;

Icon.register(faArrowUpShortWide, faGear, faList, faPen, faRectanglesMixed, faTableCells, faTableRows, faTrash);

export default {
  title: 'Actions/Menu button',
  tags: ['draft'],
  args: {
    alignSelf: 'center',
    body: 'Button',
    disabled: false,
    justifySelf: 'center'
  },
  argTypes: {
    alignSelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    body: {
      table: { disable: true }
    },
    fill: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost']
    },
    justifySelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    menuItems: {
      table: { disable: true }
    },
    position: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end'
      ]
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'primary', 'info']
    }
  },
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  render: ({ alignSelf, body, disabled, fill, justifySelf, label, menuItems, position, size, variant }) => {
    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(100dvh - 2rem);
          place-items: center;
        }
      </style>
      <sl-menu-button
        ?disabled=${disabled}
        aria-label=${ifDefined(label)}
        fill=${ifDefined(fill)}
        position=${ifDefined(position)}
        size=${ifDefined(size)}
        style=${styleMap({ alignSelf, justifySelf })}
        variant=${ifDefined(variant)}
      >
        ${body ?? html`<div slot="button">${body}</div>`} ${menuItems?.()}
      </sl-menu-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    body: html`<sl-icon name="far-gear" slot="button"></sl-icon>`,
    label: 'Settings',
    menuItems: () => html`
      <sl-menu-item>
        <sl-icon name="far-pen"></sl-icon>
        Rename...
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-trash"></sl-icon>
        Delete...
      </sl-menu-item>
    `
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const IconAndText: Story = {
  args: {
    ...Basic.args,
    body: html`
      <sl-icon name="far-gear" slot="button"></sl-icon>
      <span slot="button">Settings</span>
    `,
    label: undefined
  }
};

export const Text: Story = {
  args: {
    ...Basic.args,
    body: html`<span slot="button">Settings</span>`,
    label: undefined
  }
};

export const Submenu: Story = {
  args: {
    ...Basic.args,
    menuItems: () => html`
      <sl-menu-item>
        <sl-icon name="far-arrow-up-short-wide"></sl-icon>
        Sort by
        <sl-menu selects="single" slot="submenu">
          <sl-menu-item selectable selected>First name (A-Z)</sl-menu-item>
          <sl-menu-item selectable>First name (Z-A)</sl-menu-item>
          <sl-menu-item selectable>Last name (A-Z)</sl-menu-item>
          <sl-menu-item selectable>Last name (Z-A)</sl-menu-item>
        </sl-menu>
      </sl-menu-item>
    `
  }
};

export const Avatar: Story = {
  args: {
    body: html`<sl-avatar display-name="John Doe" size="sm" slot="button"></sl-avatar>`,
    fill: 'ghost',
    menuItems: () => html`
      <sl-menu-item>Profile...</sl-menu-item>
      <sl-menu-item>Settings...</sl-menu-item>
      <hr />
      <sl-menu-item>Log out</sl-menu-item>
    `
  }
};

export const All: Story = {
  render: () => html`
    <style>
      .container {
        align-items: center;
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: repeat(5, auto);
        justify-items: center;
      }
    </style>
    <div class="container">
      <span></span>
      <span>Icon</span>
      <span>Icon & text</span>
      <span>Text</span>
      <span>Disabled</span>

      <span>md</span>
      <sl-menu-button aria-label="Label">
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
      <sl-menu-button>
        <sl-icon name="far-gear" slot="button"></sl-icon>
        <span slot="button">Settings</span>
        <sl-menu-item>
          <sl-icon name="far-pen"></sl-icon>
          Rename...
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-trash"></sl-icon>
          Delete...
        </sl-menu-item>
      </sl-menu-button>
      <sl-menu-button>
        <span slot="button">Settings</span>
        <sl-menu-item>
          <sl-icon name="far-pen"></sl-icon>
          Rename...
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-trash"></sl-icon>
          Delete...
        </sl-menu-item>
      </sl-menu-button>
      <sl-menu-button disabled>
        <sl-icon name="far-gear" slot="button"></sl-icon>
        <span slot="button">Settings</span>
        <sl-menu-item>
          <sl-icon name="far-pen"></sl-icon>
          Rename...
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-trash"></sl-icon>
          Delete...
        </sl-menu-item>
      </sl-menu-button>

      <span>lg</span>
      <sl-menu-button aria-label="Label" size="lg">
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
      <sl-menu-button size="lg">
        <sl-icon name="far-gear" slot="button"></sl-icon>
        <span slot="button">Settings</span>
        <sl-menu-item>
          <sl-icon name="far-pen"></sl-icon>
          Rename...
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-trash"></sl-icon>
          Delete...
        </sl-menu-item>
      </sl-menu-button>
      <sl-menu-button size="lg">
        <span slot="button">Settings</span>
        <sl-menu-item>
          <sl-icon name="far-pen"></sl-icon>
          Rename...
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-trash"></sl-icon>
          Delete...
        </sl-menu-item>
      </sl-menu-button>
      <sl-menu-button disabled size="lg">
        <sl-icon name="far-gear" slot="button"></sl-icon>
        <span slot="button">Settings</span>
        <sl-menu-item>
          <sl-icon name="far-pen"></sl-icon>
          Rename...
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-trash"></sl-icon>
          Delete...
        </sl-menu-item>
      </sl-menu-button>
      <span>Ghost</span>
      <sl-menu-button aria-label="Label" fill="ghost">
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
    </div>
  `
};
