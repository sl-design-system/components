import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { type MenuButton, type MenuItem } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import {
  type ToolBarItemButton,
  type ToolBarItemMenu,
  mapButtonToItem,
  mapElementsToItems,
  mapMenuButtonToItem,
  mapMenuItemToItem
} from './mapping.js';
import './register.js';
import { type ToolBar } from './tool-bar.js';

describe('mapButtonToItem', () => {
  it('should map a button with text content', async () => {
    const button = await fixture<Button>(html`<sl-button>Save</sl-button>`),
      item = mapButtonToItem(button);

    expect(item.type).to.equal('button');
    expect(item.label).to.equal('Save');
    expect(item.disabled).to.equal(false);
    expect(item.ariaDisabled).to.equal(false);
    expect(item.visible).to.equal(true);
    expect(item.element).to.equal(button);
  });

  it('should map a disabled button', async () => {
    const button = await fixture<Button>(html`<sl-button disabled>Save</sl-button>`),
      item = mapButtonToItem(button);

    expect(item.disabled).to.equal(true);
    expect(item.ariaDisabled).to.equal(false);
  });

  it('should map an aria-disabled button', async () => {
    const button = await fixture<Button>(html`<sl-button aria-disabled="true">Save</sl-button>`),
      item = mapButtonToItem(button);

    expect(item.disabled).to.equal(false);
    expect(item.ariaDisabled).to.equal(true);
  });

  it('should detect a selectable button', async () => {
    const button = await fixture<Button>(html`<sl-button aria-pressed="false">Bold</sl-button>`),
      item = mapButtonToItem(button);

    expect(item.selectable).to.equal(true);
  });

  it('should detect an icon', async () => {
    const button = await fixture<Button>(
        html`<sl-button><sl-icon name="far-save"></sl-icon> Save</sl-button>`
      ),
      item = mapButtonToItem(button);

    expect(item.icon).to.equal('far-save');
  });

  it('should provide a click handler', async () => {
    const button = await fixture<Button>(html`<sl-button>Save</sl-button>`),
      item = mapButtonToItem(button);

    expect(item.click).to.be.a('function');
  });
});

describe('mapMenuButtonToItem', () => {
  it('should map a menu button with slotted text', async () => {
    const el = await fixture<MenuButton>(html`
      <sl-menu-button>
        <span slot="button">Actions</span>
        <sl-menu-item>Rename...</sl-menu-item>
      </sl-menu-button>
    `);

    const item = mapMenuButtonToItem(el);

    expect(item.type).to.equal('menu');
    expect(item.label).to.equal('Actions');
    expect(item.disabled).to.equal(false);
    expect(item.ariaDisabled).to.equal(false);
    expect(item.visible).to.equal(true);
    expect(item.element).to.equal(el);
  });

  it('should map menu items', async () => {
    const el = await fixture<MenuButton>(html`
      <sl-menu-button>
        <span slot="button">Edit</span>
        <sl-menu-item>Cut</sl-menu-item>
        <sl-menu-item>Copy</sl-menu-item>
        <sl-menu-item>Paste</sl-menu-item>
      </sl-menu-button>
    `);

    const item = mapMenuButtonToItem(el);

    expect(item.menuItems).to.have.length(3);
    expect((item.menuItems[0] as ToolBarItemButton).label).to.equal('Cut');
    expect((item.menuItems[1] as ToolBarItemButton).label).to.equal('Copy');
    expect((item.menuItems[2] as ToolBarItemButton).label).to.equal('Paste');
  });

  it('should keep menu items with a submenu nested instead of flattening them', async () => {
    const el = await fixture<MenuButton>(html`
      <sl-menu-button>
        <span slot="button">More</span>
        <sl-menu-item>Duplicate</sl-menu-item>
        <sl-menu-item>
          Add holidays
          <sl-menu slot="submenu">
            <sl-menu-item>North</sl-menu-item>
            <sl-menu-item>Middle</sl-menu-item>
            <sl-menu-item>South</sl-menu-item>
          </sl-menu>
        </sl-menu-item>
      </sl-menu-button>
    `);

    const item = mapMenuButtonToItem(el);

    expect(item.menuItems).to.have.length(2);
    expect((item.menuItems[0] as ToolBarItemButton).label).to.equal('Duplicate');

    const submenuItem = item.menuItems[1] as ToolBarItemMenu;

    expect(submenuItem.type).to.equal('menu');
    expect(submenuItem.label).to.equal('Add holidays');
    expect(submenuItem.menuItems).to.have.length(3);
    expect((submenuItem.menuItems[0] as ToolBarItemButton).label).to.equal('North');
    expect((submenuItem.menuItems[1] as ToolBarItemButton).label).to.equal('Middle');
    expect((submenuItem.menuItems[2] as ToolBarItemButton).label).to.equal('South');
  });

  it('should keep a submenu item with its own nested submenu intact', async () => {
    const el = await fixture<MenuButton>(html`
      <sl-menu-button>
        <span slot="button">More</span>
        <sl-menu-item>
          <sl-icon name="far-paste"></sl-icon>
          Add holidays
          <sl-menu slot="submenu">
            <sl-menu-item>North</sl-menu-item>
            <sl-menu-item>
              South
              <sl-menu slot="submenu">
                <sl-menu-item>Noord-Brabant</sl-menu-item>
                <sl-menu-item>Limburg</sl-menu-item>
              </sl-menu>
            </sl-menu-item>
          </sl-menu>
        </sl-menu-item>
      </sl-menu-button>
    `);

    const item = mapMenuButtonToItem(el);

    expect(item.menuItems).to.have.length(1);

    const addHolidays = item.menuItems[0] as ToolBarItemMenu;

    expect(addHolidays.type).to.equal('menu');
    expect(addHolidays.label).to.equal('Add holidays');
    expect(addHolidays.menuItems).to.have.length(2);
    expect((addHolidays.menuItems[0] as ToolBarItemButton).label).to.equal('North');

    const south = addHolidays.menuItems[1] as ToolBarItemMenu;

    expect(south.type).to.equal('menu');
    expect(south.label).to.equal('South');
    expect(south.menuItems).to.have.length(2);
    expect((south.menuItems[0] as ToolBarItemButton).label).to.equal('Noord-Brabant');
    expect((south.menuItems[1] as ToolBarItemButton).label).to.equal('Limburg');
  });

  it('should map a disabled menu button', async () => {
    const el = await fixture<MenuButton>(html`
      <sl-menu-button disabled>
        <span slot="button">Edit</span>
        <sl-menu-item>Rename...</sl-menu-item>
      </sl-menu-button>
    `);

    const item = mapMenuButtonToItem(el);

    expect(item.disabled).to.equal(true);
    expect(item.ariaDisabled).to.equal(false);
  });

  it('should map an aria-disabled menu button', async () => {
    const el = await fixture<MenuButton>(html`
      <sl-menu-button aria-disabled="true">
        <span slot="button">Edit</span>
        <sl-menu-item>Rename...</sl-menu-item>
      </sl-menu-button>
    `);

    const item = mapMenuButtonToItem(el);

    expect(item.disabled).to.equal(false);
    expect(item.ariaDisabled).to.equal(true);
  });

  it('should map label from button slot content before first render update', () => {
    const el = document.createElement('sl-menu-button');
    el.innerHTML = `
      <span slot="button"><sl-icon name="far-ban"></sl-icon> Block</span>
      <sl-menu-item>Item 1</sl-menu-item>
    `;

    const item = mapMenuButtonToItem(el);

    expect(item.label).to.equal('Block');
  });

  it('should map label from host aria-labelledby before first render update', () => {
    const container = document.createElement('div'),
      label = document.createElement('span'),
      el = document.createElement('sl-menu-button');

    label.id = 'menu-label';
    label.textContent = 'Visibility';
    container.append(label, el);
    document.body.append(container);

    el.setAttribute('aria-labelledby', 'menu-label');
    el.innerHTML = '<sl-menu-item>Item 1</sl-menu-item>';

    try {
      const item = mapMenuButtonToItem(el);
      expect(item.label).to.equal('Visibility');
    } finally {
      container.remove();
    }
  });

  it('should map label from host aria-label before first render update', () => {
    const el = document.createElement('sl-menu-button');

    el.setAttribute('aria-label', 'Visibility');
    el.innerHTML = '<sl-menu-item>Item 1</sl-menu-item>';

    const item = mapMenuButtonToItem(el);

    expect(item.label).to.equal('Visibility');
  });
});

describe('mapMenuItemToItem', () => {
  it('should map a menu item', async () => {
    const el = await fixture<MenuItem>(html`<sl-menu-item>Rename...</sl-menu-item>`),
      item = mapMenuItemToItem(el);

    expect(item.type).to.equal('button');
    expect(item.label).to.equal('Rename...');
    expect(item.disabled).to.equal(false);
    expect(item.ariaDisabled).to.equal(false);
    expect(item.visible).to.equal(true);
  });

  it('should map an aria-disabled menu item', async () => {
    const el = await fixture<MenuItem>(
        html`<sl-menu-item aria-disabled="true">Rename...</sl-menu-item>`
      ),
      item = mapMenuItemToItem(el);

    expect(item.disabled).to.equal(false);
    expect(item.ariaDisabled).to.equal(true);
  });

  it('should detect an icon in a menu item', async () => {
    const el = await fixture<MenuItem>(
        html`<sl-menu-item><sl-icon name="far-pen"></sl-icon> Edit</sl-menu-item>`
      ),
      item = mapMenuItemToItem(el);

    expect(item.icon).to.equal('far-pen');
  });

  it('should provide a click handler', async () => {
    const el = await fixture<MenuItem>(html`<sl-menu-item>Rename...</sl-menu-item>`),
      item = mapMenuItemToItem(el);

    expect(item.click).to.be.a('function');
  });

  it('should map a menu item with a submenu as a menu type without flattening its children', async () => {
    const el = await fixture<MenuItem>(html`
        <sl-menu-item>
          Add holidays
          <sl-menu slot="submenu">
            <sl-menu-item>North</sl-menu-item>
            <sl-menu-item>Middle</sl-menu-item>
          </sl-menu>
        </sl-menu-item>
      `),
      item = mapMenuItemToItem(el) as ToolBarItemMenu;

    expect(item.type).to.equal('menu');
    expect(item.label).to.equal('Add holidays');
    expect(item.menuItems).to.have.length(2);
    expect((item.menuItems[0] as ToolBarItemButton).label).to.equal('North');
    expect((item.menuItems[1] as ToolBarItemButton).label).to.equal('Middle');
  });

  it('should keep multiple levels of nested submenus intact', async () => {
    const el = await fixture<MenuItem>(html`
        <sl-menu-item>
          Add holidays
          <sl-menu slot="submenu">
            <sl-menu-item>
              North
              <sl-menu slot="submenu">
                <sl-menu-item>Groningen</sl-menu-item>
                <sl-menu-item>Friesland</sl-menu-item>
              </sl-menu>
            </sl-menu-item>
            <sl-menu-item>Middle</sl-menu-item>
          </sl-menu>
        </sl-menu-item>
      `),
      item = mapMenuItemToItem(el) as ToolBarItemMenu;

    expect(item.type).to.equal('menu');
    expect(item.label).to.equal('Add holidays');
    expect(item.menuItems).to.have.length(2);

    const north = item.menuItems[0] as ToolBarItemMenu;

    expect(north.type).to.equal('menu');
    expect(north.label).to.equal('North');
    expect(north.menuItems).to.have.length(2);
    expect((north.menuItems[0] as ToolBarItemButton).label).to.equal('Groningen');
    expect((north.menuItems[1] as ToolBarItemButton).label).to.equal('Friesland');

    expect((item.menuItems[1] as ToolBarItemButton).label).to.equal('Middle');
  });
});

describe('mapElementsToItems', () => {
  it('should map a mix of buttons, menu buttons, and dividers', async () => {
    const wrapper = await fixture<ToolBar>(html`
      <sl-tool-bar>
        <sl-button>Save</sl-button>
        <sl-tool-bar-divider></sl-tool-bar-divider>
        <sl-menu-button>
          <span slot="button">Edit</span>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      </sl-tool-bar>
    `);

    const slot = wrapper.renderRoot.querySelector('slot')!,
      elements = slot.assignedElements({ flatten: true }),
      items = mapElementsToItems(elements);

    expect(items).to.have.length(3);
    expect(items[0].type).to.equal('button');
    expect(items[1].type).to.equal('divider');
    expect(items[2].type).to.equal('menu');
  });

  it('should skip unknown elements', async () => {
    const wrapper = await fixture<ToolBar>(html`
      <sl-tool-bar>
        <sl-button>Save</sl-button>
        <sl-tooltip>Help text</sl-tooltip>
      </sl-tool-bar>
    `);

    const slot = wrapper.renderRoot.querySelector('slot')!,
      elements = slot.assignedElements({ flatten: true }),
      items = mapElementsToItems(elements);

    expect(items).to.have.length(1);
    expect(items[0].type).to.equal('button');
  });

  it('should return an empty array for no elements', () => {
    const items = mapElementsToItems([]);

    expect(items).to.deep.equal([]);
  });
});
