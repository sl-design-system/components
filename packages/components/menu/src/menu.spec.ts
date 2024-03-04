import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type Menu } from './menu.js';
import { type MenuItem } from './menu-item.js';

describe('sl-menu', () => {
  let el: Menu;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu>
          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item disabled>Item 2</sl-menu-item>
          <sl-menu-item>
            Item 3
            <sl-menu slot="submenu">
              <sl-menu-item>Subitem 1</sl-menu-item>
              <sl-menu-item>Subitem 2</sl-menu-item>
            </sl-menu>
          </sl-menu-item>
        </sl-menu>
      `);
    });

    it('should have a menu role', () => {
      expect(el).to.have.attribute('role', 'menu');
    });

    it('should be a popover', () => {
      expect(el).to.have.attribute('popover');
    });

    it('should have a position', () => {
      expect(el.position).to.equal('right-start');
    });

    it('should not have an offset', () => {
      expect(el.offset).to.be.undefined;
    });

    it('should not have a selects mode', () => {
      expect(el.selects).to.be.undefined;
    });

    it('should not indent the menu items', () => {
      const slot = el.renderRoot.querySelector('slot')!;

      expect(slot).to.have.attribute('style', '--sl-menu-item-indent: 0');
    });
  });

  describe('single select', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu selects="single">
          <sl-menu-item selectable>Item 1</sl-menu-item>
          <sl-menu-item selectable selected>Item 2</sl-menu-item>
        </sl-menu>
      `);
    });

    it('should toggle between selected items', () => {
      const item1 = el.querySelector<MenuItem>('sl-menu-item:nth-of-type(1)'),
        item2 = el.querySelector<MenuItem>('sl-menu-item:nth-of-type(2)');

      item1?.click();
      expect(item1?.selected).to.be.true;
      expect(item2?.selected).to.be.false;

      item2?.click();
      expect(item1?.selected).to.be.false;
      expect(item2?.selected).to.be.true;

      item2?.click();
      expect(item1?.selected).to.be.false;
      expect(item2?.selected).to.be.false;
    });

    it('should emit an sl-select event when a menu item is selected', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);

      el.querySelector('sl-menu-item')?.click();
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;
    });

    it('should indent the menu items', () => {
      const slot = el.renderRoot.querySelector('slot')!;

      expect(slot).to.have.attribute('style', '--sl-menu-item-indent: 1');
    });
  });

  describe('multiple select', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu selects="multiple">
          <sl-menu-item selectable>Item 1</sl-menu-item>
          <sl-menu-item selectable selected>Item 2</sl-menu-item>
        </sl-menu>
      `);
    });

    it('should support multiple selected items', () => {
      const item1 = el.querySelector<MenuItem>('sl-menu-item:nth-of-type(1)'),
        item2 = el.querySelector<MenuItem>('sl-menu-item:nth-of-type(2)');

      item1?.click();
      expect(item1?.selected).to.be.true;
      expect(item2?.selected).to.be.true;

      item2?.click();
      expect(item1?.selected).to.be.true;
      expect(item2?.selected).to.be.false;

      item2?.click();
      expect(item1?.selected).to.be.true;
      expect(item2?.selected).to.be.true;
    });

    it('should emit an sl-select event when a menu item is selected', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);

      el.querySelector('sl-menu-item')?.click();
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;
    });

    it('should indent the menu items', () => {
      const slot = el.renderRoot.querySelector('slot')!;

      expect(slot).to.have.attribute('style', '--sl-menu-item-indent: 1');
    });
  });
});
