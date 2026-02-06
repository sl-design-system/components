import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { type SinonSpy, spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { type MenuItem } from './menu-item.js';
import { type Menu } from './menu.js';

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

    it('should toggle between selected items, but not deselect the current item when it is clicked again', () => {
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

  describe('keyboard navigation', () => {
    describe('arrow key propagation', () => {
      let onKeydown: SinonSpy;

      beforeEach(async () => {
        onKeydown = spy();

        document.body.addEventListener('keydown', onKeydown);

        el = await fixture(html`
          <sl-menu>
            <sl-menu-item>Item 1</sl-menu-item>
            <sl-menu-item>Item 2</sl-menu-item>
          </sl-menu>
        `);
        el.showPopover();

        await el.updateComplete;

        el.focus();
      });

      afterEach(() => document.body.removeEventListener('keydown', onKeydown));

      it('should stop propagation of ArrowLeft key events', async () => {
        await userEvent.keyboard('{ArrowLeft}');

        expect(onKeydown).not.to.have.been.called;
      });

      it('should stop propagation of ArrowRight key events', async () => {
        await userEvent.keyboard('{ArrowRight}');

        expect(onKeydown).not.to.have.been.called;
      });

      it('should stop propagation of ArrowUp key events', async () => {
        await userEvent.keyboard('{ArrowUp}');

        expect(onKeydown).not.to.have.been.called;
      });

      it('should stop propagation of ArrowDown key events', async () => {
        await userEvent.keyboard('{ArrowDown}');

        expect(onKeydown).not.to.have.been.called;
      });
    });

    describe('arrow left/right in submenu', () => {
      let parentMenuItem: MenuItem;
      let submenu: Menu;

      beforeEach(async () => {
        el = await fixture(html`
          <sl-menu>
            <sl-menu-item>
              Item with submenu
              <sl-menu slot="submenu">
                <sl-menu-item>Subitem 1</sl-menu-item>
                <sl-menu-item>Subitem 2</sl-menu-item>
              </sl-menu>
            </sl-menu-item>
          </sl-menu>
        `);

        el.showPopover();
        await el.updateComplete;

        parentMenuItem = el.querySelector('sl-menu-item')!;
        submenu = parentMenuItem.querySelector('sl-menu')!;

        // Manually set placement for testing
        submenu.setAttribute('actual-placement', 'right-start');
      });

      it('should close submenu and focus parent when ArrowLeft is pressed', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItem = submenu.querySelector('sl-menu-item')!;
        submenuItem.focus();

        await userEvent.keyboard('{ArrowLeft}');
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(submenu.matches(':popover-open')).to.be.false;
        expect(document.activeElement).to.equal(parentMenuItem);
      });

      it('should not close submenu when ArrowRight is pressed', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItem = submenu.querySelector('sl-menu-item')!;
        submenuItem.focus();

        await userEvent.keyboard('{ArrowRight}');
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(submenu.matches(':popover-open')).to.be.true;
      });
    });

    describe('escape key in submenu', () => {
      let parentMenuItem: MenuItem;
      let submenu: Menu;
      let submenuItem: MenuItem;

      beforeEach(async () => {
        el = await fixture(html`
          <sl-menu>
            <sl-menu-item>Item 1</sl-menu-item>
            <sl-menu-item>
              Item 2
              <sl-menu slot="submenu">
                <sl-menu-item>Subitem 1</sl-menu-item>
                <sl-menu-item>Subitem 2</sl-menu-item>
              </sl-menu>
            </sl-menu-item>
          </sl-menu>
        `);

        el.showPopover();
        await el.updateComplete;

        parentMenuItem = el.querySelectorAll('sl-menu-item')[1];
        submenu = parentMenuItem.querySelector('sl-menu')!;
        submenuItem = submenu.querySelector('sl-menu-item')!;
      });

      it('should close only the submenu when Escape key is pressed', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        expect(submenu.matches(':popover-open')).to.be.true;
        expect(el.matches(':popover-open')).to.be.true;

        submenuItem.focus();
        await userEvent.keyboard('{Escape}');

        // Give time for the popover to close
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(submenu.matches(':popover-open')).to.be.false;
        expect(el.matches(':popover-open')).to.be.true;
      });

      it('should focus the parent menu item when Escape closes submenu', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        submenuItem.focus();
        await userEvent.keyboard('{Escape}');

        // Wait for focus to change
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(document.activeElement).to.equal(parentMenuItem);
      });

      it('should stop propagation of Escape key', async () => {
        const onKeydown = spy();
        document.addEventListener('keydown', onKeydown);

        submenu.showPopover();
        await submenu.updateComplete;

        submenuItem.focus();
        await userEvent.keyboard('{Escape}');

        expect(onKeydown).not.to.have.been.called;

        document.removeEventListener('keydown', onKeydown);
      });
    });
  });
});
