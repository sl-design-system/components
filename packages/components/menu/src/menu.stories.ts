import {
  faArrowUpShortWide,
  faBook,
  faCode,
  faGear,
  faList,
  faPen,
  faRectanglesMixed,
  faRocket,
  faTableCells,
  faTableRows,
  faTrash
} from '@fortawesome/pro-regular-svg-icons';
import { faPeople } from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Menu } from './menu.js';

type Props = Pick<Menu, 'selects'> & { menuItems(): TemplateResult; maxWidth: string };
type Story = StoryObj<Props>;

Icon.register(
  faArrowUpShortWide,
  faBook,
  faCode,
  faGear,
  faList,
  faPen,
  faPeople,
  faRectanglesMixed,
  faRocket,
  faTableCells,
  faTableRows,
  faTrash
);

export default {
  title: 'Overlay/Menu',
  tags: ['draft'],
  args: {
    maxWidth: '200px'
  },
  parameters: {
    layout: 'centered'
  },
  render: ({ maxWidth, menuItems, selects }) => {
    setTimeout(() => document.querySelector('sl-menu')?.showPopover());

    return html`
      <style>
        .root-menu {
          margin: auto !important;
          position: static !important;
        }
      </style>
      <sl-menu .selects=${selects} class="root-menu" popover="manual" style="max-width: ${maxWidth}">
        ${menuItems()}
      </sl-menu>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
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

export const Divider: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item>
        <sl-icon name="far-pen"></sl-icon>
        Rename...
      </sl-menu-item>
      <hr />
      <sl-menu-item>
        <sl-icon name="far-trash"></sl-icon>
        Delete...
      </sl-menu-item>
    `
  }
};

export const Group: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item>
        <sl-icon name="far-code"></sl-icon>
        Components
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-gear"></sl-icon>
        Settings
      </sl-menu-item>
      <sl-menu-item-group>
        <sl-menu-item>
          <sl-icon name="far-rocket"></sl-icon>
          What's new
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-book"></sl-icon>
          Documentation
        </sl-menu-item>
      </sl-menu-item-group>
    `
  }
};

export const GroupWithHeading: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item>
        <sl-icon name="far-code"></sl-icon>
        Components
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-gear"></sl-icon>
        Settings
      </sl-menu-item>
      <sl-menu-item-group heading="Design System">
        <sl-menu-item>
          <sl-icon name="far-rocket"></sl-icon>
          What's new
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-book"></sl-icon>
          Documentation
        </sl-menu-item>
      </sl-menu-item-group>
    `
  }
};

export const Overflow: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item>Cupidatat amet aute sint voluptate fugiat dolore.</sl-menu-item>
      <sl-menu-item>Laboris laborum excepteur aute esse reprehenderit.</sl-menu-item>
    `
  }
};

export const Shortcut: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item selectable selected shortcut="$mod+Digit1">
        <sl-icon name="far-list"></sl-icon>
        List
      </sl-menu-item>
      <sl-menu-item selectable shortcut="$mod+Digit2">
        <sl-icon name="far-rectangles-mixed"></sl-icon>
        Cards
      </sl-menu-item>
      <sl-menu-item selectable shortcut="$mod+Digit3">
        <sl-icon name="far-table-cells"></sl-icon>
        Grid
      </sl-menu-item>
    `,
    selects: 'single'
  }
};

export const Avatar: Story = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as HTMLElement)?.showPopover();
    };

    const onKeydown = (event: KeyboardEvent & { target: HTMLElement }): void => {
      if (event.key === 'Enter' || event.key === ' ') {
        onClick(event);
      }
    };

    return html`
      <sl-avatar
        @click=${onClick}
        @keydown=${onKeydown}
        id="avatar"
        image-only
        picture-url="https://images.unsplash.com/photo-1699412958387-2fe86d46d394?q=80&amp;w=188&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        size="lg"
        status="warning"
        style="cursor: pointer"
        tabindex="0"
      >
      </sl-avatar>
      <sl-menu anchor="avatar" offset="8" position="bottom-end">
        <sl-menu-item>Your profile</sl-menu-item>
        <sl-menu-item>Settings</sl-menu-item>
        <hr />
        <sl-menu-item>Sign out</sl-menu-item>
      </sl-menu>
    `;
  }
};

export const All: Story = {
  args: {
    menuItems: () => {
      const onClick = (event: Event): void => {
        console.log('click', event.target);
      };

      return html`
        <sl-menu-item-group selects="single">
          <sl-menu-item @click=${onClick} selectable selected shortcut="$mod+Digit1">
            <sl-icon name="far-list"></sl-icon>
            List
          </sl-menu-item>
          <sl-menu-item @click=${onClick} selectable shortcut="$mod+Digit2">
            <sl-icon name="far-rectangles-mixed"></sl-icon>
            Cards
          </sl-menu-item>
          <sl-menu-item @click=${onClick} selectable shortcut="$mod+Digit3">
            <sl-icon name="far-table-cells"></sl-icon>
            Grid
          </sl-menu-item>
        </sl-menu-item-group>
        <hr />
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
        <sl-menu-item>
          <sl-icon name="far-table-rows"></sl-icon>
          Group by
          <sl-menu selects="single" slot="submenu">
            <sl-menu-item selectable selected>Something</sl-menu-item>
            <sl-menu-item selectable>Other</sl-menu-item>
          </sl-menu>
        </sl-menu-item>
        <hr />
        <sl-menu-item disabled>
          <sl-icon name="far-pen"></sl-icon>
          Rename...
        </sl-menu-item>
        <sl-menu-item variant="danger">
          <sl-icon name="far-trash"></sl-icon>
          Delete...
        </sl-menu-item>
      `;
    }
  }
};
