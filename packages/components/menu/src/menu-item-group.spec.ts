import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { MenuItemGroup } from './menu-item-group.js';
import { type MenuItem } from './menu-item.js';

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

  it('should not have an aria-label when there is no heading or slotted header', () => {
    expect(el).not.to.have.attribute('aria-label');
  });

  it('should set aria-label when heading property is set', async () => {
    el.heading = 'Group heading';
    await el.updateComplete;

    expect(el).to.have.attribute('aria-label', 'Group heading');
  });

  it('should update aria-label when heading property changes', async () => {
    el.heading = 'First heading';
    await el.updateComplete;

    expect(el).to.have.attribute('aria-label', 'First heading');

    el.heading = 'Second heading';
    await el.updateComplete;

    expect(el).to.have.attribute('aria-label', 'Second heading');
  });

  it('should remove aria-label when heading property is cleared', async () => {
    el.heading = 'Group heading';
    await el.updateComplete;

    expect(el).to.have.attribute('aria-label', 'Group heading');

    el.heading = undefined;
    await el.updateComplete;

    expect(el).not.to.have.attribute('aria-label');
  });

  it('should set aria-label from slotted header content', async () => {
    el = await fixture(html`
      <sl-menu-item-group>
        <span slot="header">Slotted header</span>
        <sl-menu-item>Item 1</sl-menu-item>
      </sl-menu-item-group>
    `);

    expect(el).to.have.attribute('aria-label', 'Slotted header');
  });

  it('should update aria-label when slotted header element is replaced', async () => {
    el = await fixture(html`
      <sl-menu-item-group>
        <span slot="header">Initial header</span>
        <sl-menu-item>Item 1</sl-menu-item>
      </sl-menu-item-group>
    `);

    expect(el).to.have.attribute('aria-label', 'Initial header');

    const headerSlot = el.renderRoot.querySelector<HTMLSlotElement>('slot[name="header"]');

    if (!headerSlot) {
      throw new Error('Header slot not found');
    }
    const slotChangePromise = new Promise<void>((resolve, reject) => {
      const onSlotChange = () => {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }

        headerSlot.removeEventListener('slotchange', onSlotChange);
        resolve();
      };

      const timeoutId = window.setTimeout(() => {
        headerSlot.removeEventListener('slotchange', onSlotChange);
        reject(new Error('Timed out waiting for header slotchange'));
      }, 1000);

      headerSlot.addEventListener('slotchange', onSlotChange);
    });
    const oldHeader = el.querySelector('[slot="header"]');
    oldHeader?.remove();

    const newHeader = document.createElement('span');
    newHeader.setAttribute('slot', 'header');
    newHeader.textContent = 'Updated header';
    el.appendChild(newHeader);

    await slotChangePromise;

    expect(el).to.have.attribute('aria-label', 'Updated header');
  });

  it('should prioritize slotted header over heading property for aria-label', async () => {
    el = await fixture(html`
      <sl-menu-item-group heading="Property heading">
        <span slot="header">Slotted header</span>
        <sl-menu-item>Item 1</sl-menu-item>
      </sl-menu-item-group>
    `);

    expect(el).to.have.attribute('aria-label', 'Slotted header');
  });

  it('should fall back to heading property when slotted header is removed', async () => {
    el = await fixture(html`
      <sl-menu-item-group heading="Property heading">
        <span slot="header">Slotted header</span>
        <sl-menu-item>Item 1</sl-menu-item>
      </sl-menu-item-group>
    `);

    expect(el).to.have.attribute('aria-label', 'Slotted header');

    const headerSlot = el.querySelector('[slot="header"]');
    headerSlot?.remove();
    await el.updateComplete;

    expect(el).to.have.attribute('aria-label', 'Property heading');
  });
});
