import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type MenuItem } from './menu-item.js';
import { MenuItemGroup } from './menu-item-group.js';

describe('sl-menu-item-group', () => {
  let el: MenuItemGroup;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-menu-item-group>
        <sl-menu-item selectable>Item 1</sl-menu-item>
        <sl-menu-item selectable>Item 2</sl-menu-item>
      </sl-menu-item-group>
    `);
  });

  it('should not have a heading', () => {
    expect(el.heading).to.be.undefined;
    expect(el.renderRoot.querySelector('slot[name="header"]')).to.be.empty;
  });

  it('should have a heading when set', async () => {
    el.heading = 'Group 1';
    await el.updateComplete;

    expect(el.renderRoot.querySelector('slot[name="header"]')).to.have.text('Group 1');
  });

  it('should toggle the selected menu item when single select is set', async () => {
    el.selects = 'single';

    const item1 = el.querySelector<MenuItem>('sl-menu-item'),
      item2 = el.querySelector<MenuItem>('sl-menu-item:last-child');

    item1?.click();
    await el.updateComplete;

    expect(item1?.selected).to.be.true;
    expect(item2?.selected).not.to.be.true;

    item2?.click();
    await el.updateComplete;

    expect(item1?.selected).to.be.false;
    expect(item2?.selected).to.be.true;
  });
});
