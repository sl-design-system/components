import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { type MenuButton, type MenuItem } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';

import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import '../register.js';
import {
  type ToolBarItemButton,
  mapButtonToItem,
  mapElementsToItems,
  mapMenuButtonToItem,
  mapMenuItemToItem
} from './mapping.js';
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
    const el = document.createElement('sl-menu-button') as MenuButton;
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
      el = document.createElement('sl-menu-button') as MenuButton;

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
});

describe('mapMenuItemToItem', () => {
  it('should map a menu item', async () => {
    const el = await fixture<MenuItem>(html`<sl-menu-item>Rename...</sl-menu-item>`),
      item = mapMenuItemToItem(el);

    expect(item.type).to.equal('button');
    expect(item.label).to.equal('Rename...');
    expect(item.disabled).to.equal(false);
    expect(item.visible).to.equal(true);
  });

  it('should map a disabled menu item', async () => {
    const el = await fixture<MenuItem>(html`<sl-menu-item disabled>Rename...</sl-menu-item>`),
      item = mapMenuItemToItem(el);

    expect(item.disabled).to.equal(true);
  });

  it('should detect an icon in a menu item', async () => {
    const el = await fixture<MenuItem>(
        html`<sl-menu-item><sl-icon name="far-pen"></sl-icon> Edit</sl-menu-item>`
      ),
      item = mapMenuItemToItem(el);

    expect(item.icon).to.equal('far-pen');
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
