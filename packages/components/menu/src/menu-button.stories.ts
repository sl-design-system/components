import { faGear, faList, faRectanglesMixed, faTableCells } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type MenuButton } from './menu-button.js';

type Props = Pick<MenuButton, 'disabled' | 'fill' | 'pluralize' | 'position' | 'selects' | 'size' | 'variant'> & {
  alignSelf: string;
  body: string | TemplateResult;
  justifySelf: string;
  menuItems?(): TemplateResult;
};
type Story = StoryObj<Props>;

Icon.register(faGear, faList, faRectanglesMixed, faTableCells);

export default {
  title: 'Components/Menu button',
  tags: ['draft'],
  args: {
    alignSelf: 'center',
    body: 'Button',
    disabled: false,
    fill: 'outline',
    justifySelf: 'center',
    size: 'md',
    variant: 'default'
  },
  argTypes: {
    alignSelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    justifySelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
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
    }
  },
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  render: ({
    alignSelf,
    body,
    disabled,
    fill,
    justifySelf,
    menuItems,
    pluralize,
    position,
    selects,
    size,
    variant
  }) => {
    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(100dvh - 2rem);
          place-items: center;
        }
      </style>
      <sl-menu-button
        .disabled=${disabled}
        .fill=${fill}
        .pluralize=${pluralize}
        .position=${position}
        .selects=${selects}
        .size=${size}
        .variant=${variant}
        style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}
      >
        ${body ?? html`<div slot="button">${body}</div>`} ${menuItems?.()}
      </sl-menu-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    body: html`<sl-icon name="far-gear" slot="button"></sl-icon>`,
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

export const SingleSelect: Story = {
  args: {
    body: html`<span slot="button">View</span>`,
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

export const MultiSelect: Story = {
  args: {
    body: html`<span slot="button">Lists</span>`,
    menuItems: () => html`
      <sl-menu-item selectable selected>Side projects</sl-menu-item>
      <sl-menu-item selectable>Design systems</sl-menu-item>
      <sl-menu-item selectable>Plugins</sl-menu-item>
    `,
    pluralize: count => `${count} list${count > 1 ? 's' : ''}`,
    selects: 'multiple'
  }
};

export const All: Story = {
  args: {
    body: html`<sl-icon name="far-gear" slot="button"></sl-icon>`,
    menuItems: () => html`
      <sl-menu-item-group selects="single">
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
      <sl-menu-item>
        <sl-icon name="far-trash"></sl-icon>
        Delete...
      </sl-menu-item>
    `
  }
};
