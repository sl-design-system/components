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

  describe('initial focus', () => {
    it('should focus the first menu item when the menu is opened', async () => {
      el = await fixture(html`
        <sl-menu>
          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
          <sl-menu-item>Item 3</sl-menu-item>
        </sl-menu>
      `);

      el.showPopover();
      await el.updateComplete;

      el.focus();

      const firstItem = el.querySelector('sl-menu-item');

      expect(document.activeElement).to.equal(firstItem);
    });

    it('should skip disabled menu items when focusing initially', async () => {
      el = await fixture(html`
        <sl-menu>
          <sl-menu-item disabled>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
          <sl-menu-item>Item 3</sl-menu-item>
        </sl-menu>
      `);

      el.showPopover();
      await el.updateComplete;

      el.focus();

      const secondItem = el.querySelectorAll('sl-menu-item')[1];

      expect(document.activeElement).to.equal(secondItem);
    });

    it('should focus the first not disabled menu item in a menu with multiple disabled items', async () => {
      el = await fixture(html`
        <sl-menu>
          <sl-menu-item disabled>Item 1</sl-menu-item>
          <sl-menu-item disabled>Item 2</sl-menu-item>
          <sl-menu-item>Item 3</sl-menu-item>
          <sl-menu-item>Item 4</sl-menu-item>
        </sl-menu>
      `);

      el.showPopover();
      await el.updateComplete;

      el.focus();

      const thirdItem = el.querySelectorAll('sl-menu-item')[2];

      expect(document.activeElement).to.equal(thirdItem);
    });
  });

  describe('focusout handling', () => {
    describe('menu without submenu', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-menu>
            <sl-menu-item>Item 1</sl-menu-item>
            <sl-menu-item>Item 2</sl-menu-item>
            <sl-menu-item>Item 3</sl-menu-item>
          </sl-menu>
        `);

        el.showPopover();
        await el.updateComplete;
      });

      it('should close the menu when focus moves outside', async () => {
        const outsideButton = document.createElement('button');

        document.body.appendChild(outsideButton);

        el.focus();

        expect(el.matches(':popover-open')).to.be.true;

        outsideButton.focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.false;

        document.body.removeChild(outsideButton);
      });

      it('should not close the menu when focus moves between menu items', async () => {
        const firstItem = el.querySelector('sl-menu-item')!,
          secondItem = el.querySelectorAll('sl-menu-item')[1];

        firstItem.focus();

        expect(el.matches(':popover-open')).to.be.true;

        secondItem.focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.true;
      });

      it('should not close the menu when focus stays within the menu element', async () => {
        const firstItem = el.querySelector('sl-menu-item')!;

        firstItem.focus();

        expect(el.matches(':popover-open')).to.be.true;

        firstItem.focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.true;
      });

      it('should close the menu when relatedTarget is null', async () => {
        const firstItem = el.querySelector('sl-menu-item')!;

        firstItem.focus();

        expect(el.matches(':popover-open')).to.be.true;

        // Simulate focusout with null relatedTarget
        const focusoutEvent = new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: null
        });

        el.dispatchEvent(focusoutEvent);

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.false;
      });

      it('should close the menu when relatedTarget is undefined', async () => {
        const firstItem = el.querySelector('sl-menu-item')!;

        firstItem.focus();

        expect(el.matches(':popover-open')).to.be.true;

        // Simulate focusout with undefined relatedTarget
        const focusoutEvent = new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: undefined
        });

        el.dispatchEvent(focusoutEvent);

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.false;
      });

      it('should close the menu when relatedTarget is an external element', async () => {
        const firstItem = el.querySelector('sl-menu-item')!;

        firstItem.focus();

        expect(el.matches(':popover-open')).to.be.true;

        // focusout with external element as relatedTarget
        const focusoutEvent = new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: document.body
        });

        el.dispatchEvent(focusoutEvent);

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.false;
      });
    });

    describe('menu with submenu', () => {
      let parentMenuItem: MenuItem, submenu: Menu;

      beforeEach(async () => {
        el = await fixture(html`
          <sl-menu>
            <sl-menu-item>Item 1</sl-menu-item>
            <sl-menu-item>
              Item 2 with submenu
              <sl-menu slot="submenu">
                <sl-menu-item>Subitem 1</sl-menu-item>
                <sl-menu-item>Subitem 2</sl-menu-item>
                <sl-menu-item>Subitem 3</sl-menu-item>
              </sl-menu>
            </sl-menu-item>
            <sl-menu-item>Item 3</sl-menu-item>
          </sl-menu>
        `);

        el.showPopover();
        await el.updateComplete;

        parentMenuItem = el.querySelectorAll('sl-menu-item')[1];
        submenu = parentMenuItem.querySelector('sl-menu')!;
      });

      it('should not close parent menu when focus moves to submenu', async () => {
        parentMenuItem.focus();
        expect(el.matches(':popover-open')).to.be.true;

        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItem = submenu.querySelector('sl-menu-item')!;

        submenuItem.focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;
      });

      it('should not close parent menu when focus returns from submenu to parent menu item', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItem = submenu.querySelector('sl-menu-item')!;
        submenuItem.focus();

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;

        submenu.hidePopover();
        parentMenuItem.focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.false;
      });

      it('should close all menus when focus moves outside from submenu', async () => {
        const outsideButton = document.createElement('button');

        document.body.appendChild(outsideButton);

        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItem = submenu.querySelector('sl-menu-item')!;
        submenuItem.focus();

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;

        outsideButton.focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.false;
        expect(submenu.matches(':popover-open')).to.be.false;

        document.body.removeChild(outsideButton);
      });

      it('should not close parent menu when navigating within submenu', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItems = submenu.querySelectorAll('sl-menu-item');
        submenuItems[0].focus();

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;

        submenuItems[1].focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;
      });

      it('should not close parent menu when submenu is the event target', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItem = submenu.querySelector('sl-menu-item')!;

        submenuItem.focus();

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;

        // Simulate focusout event from the submenu itself (not parent menu)
        const focusoutEvent = new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: parentMenuItem
        });

        // Dispatch on submenu - parent menu should ignore this since event.target !== parent menu
        submenu.dispatchEvent(focusoutEvent);

        await new Promise(resolve => setTimeout(resolve, 50));

        // Parent menu should ignore the focusout from submenu
        expect(el.matches(':popover-open')).to.be.true;
      });

      it('should not close submenu on its own focusout event (submenus ignore focusout)', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItem = submenu.querySelector('sl-menu-item')!;

        submenuItem.focus();

        expect(submenu.matches(':popover-open')).to.be.true;

        // Simulate focusout on submenu itself - should be ignored because submenu has anchorElement
        const focusoutEvent = new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: document.body
        });

        submenu.dispatchEvent(focusoutEvent);

        await new Promise(resolve => setTimeout(resolve, 50));

        // Submenu should still be open (it ignores its own focusout)
        expect(submenu.matches(':popover-open')).to.be.true;
      });

      it('should not close parent menu when relatedTarget is a submenu item', async () => {
        submenu.showPopover();
        await submenu.updateComplete;

        const parentItem = el.querySelectorAll('sl-menu-item')[0];
        const submenuItem = submenu.querySelector('sl-menu-item')!;

        parentItem.focus();

        expect(el.matches(':popover-open')).to.be.true;

        // Focus moves from parent menu item to submenu item
        submenuItem.focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        // Parent menu should detect that relatedTarget is in its hierarchy
        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;
      });
    });

    describe('submenu hierarchy detection', () => {
      let parentMenuItem: MenuItem, submenu: Menu;

      beforeEach(async () => {
        el = await fixture(html`
          <sl-menu>
            <sl-menu-item>Item 1</sl-menu-item>
            <sl-menu-item>
              Item 2 with submenu
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
      });

      it('should recognize submenu as part of menu hierarchy when checking relatedTarget', async () => {
        const firstItem = el.querySelector('sl-menu-item')!;

        firstItem.focus();

        submenu.showPopover();
        await submenu.updateComplete;

        const submenuItem = submenu.querySelector('sl-menu-item')!;

        // Simulate focusout from parent menu with relatedTarget being submenu item
        const focusoutEvent = new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: submenuItem
        });

        el.dispatchEvent(focusoutEvent);

        await new Promise(resolve => setTimeout(resolve, 50));

        // Menu should stay open because relatedTarget is in submenu hierarchy
        expect(el.matches(':popover-open')).to.be.true;
      });

      it('should close menu when relatedTarget is not in hierarchy', async () => {
        const externalButton = document.createElement('button');

        document.body.appendChild(externalButton);

        const firstItem = el.querySelector('sl-menu-item')!;

        firstItem.focus();

        // Simulate focusout with external element as relatedTarget
        const focusoutEvent = new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: externalButton
        });

        el.dispatchEvent(focusoutEvent);

        await new Promise(resolve => setTimeout(resolve, 50));

        // Menu should close because relatedTarget is not in hierarchy
        expect(el.matches(':popover-open')).to.be.false;

        document.body.removeChild(externalButton);
      });
    });

    describe('nested submenus', () => {
      let submenu: Menu, nestedSubmenu: Menu;

      beforeEach(async () => {
        el = await fixture(html`
          <sl-menu>
            <sl-menu-item>Item 1</sl-menu-item>
            <sl-menu-item>
              Item 2 with submenu
              <sl-menu slot="submenu">
                <sl-menu-item>Subitem 1</sl-menu-item>
                <sl-menu-item>
                  Subitem 2 with nested submenu
                  <sl-menu slot="submenu">
                    <sl-menu-item>Nested item 1</sl-menu-item>
                    <sl-menu-item>Nested item 2</sl-menu-item>
                  </sl-menu>
                </sl-menu-item>
              </sl-menu>
            </sl-menu-item>
          </sl-menu>
        `);

        el.showPopover();
        await el.updateComplete;

        const parentMenuItem = el.querySelectorAll('sl-menu-item')[1];
        submenu = parentMenuItem.querySelector('sl-menu')!;

        submenu.showPopover();
        await submenu.updateComplete;

        const submenuMenuItem = submenu.querySelectorAll('sl-menu-item')[1];
        nestedSubmenu = submenuMenuItem.querySelector('sl-menu')!;
      });

      it('should not close parent menus when focus moves to nested submenu', async () => {
        const submenuItem = submenu.querySelectorAll('sl-menu-item')[1];

        submenuItem.focus();

        nestedSubmenu.showPopover();
        await nestedSubmenu.updateComplete;

        const nestedItem = nestedSubmenu.querySelector('sl-menu-item')!;

        nestedItem.focus();

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;
        expect(nestedSubmenu.matches(':popover-open')).to.be.true;
      });

      it('should close all menus when focus moves outside from nested submenu', async () => {
        const outsideButton = document.createElement('button');

        document.body.appendChild(outsideButton);

        nestedSubmenu.showPopover();
        await nestedSubmenu.updateComplete;

        const nestedItem = nestedSubmenu.querySelector('sl-menu-item')!;
        nestedItem.focus();

        expect(el.matches(':popover-open')).to.be.true;
        expect(submenu.matches(':popover-open')).to.be.true;
        expect(nestedSubmenu.matches(':popover-open')).to.be.true;

        outsideButton.focus();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(el.matches(':popover-open')).to.be.false;
        expect(submenu.matches(':popover-open')).to.be.false;
        expect(nestedSubmenu.matches(':popover-open')).to.be.false;

        document.body.removeChild(outsideButton);
      });
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
      let parentMenuItem: MenuItem, submenu: Menu;

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
      let parentMenuItem: MenuItem, submenu: Menu, submenuItem: MenuItem, onKeydown: SinonSpy;

      beforeEach(async () => {
        onKeydown = spy();
        document.addEventListener('keydown', onKeydown);

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

      afterEach(() => document.removeEventListener('keydown', onKeydown));

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
        submenu.showPopover();
        await submenu.updateComplete;

        submenuItem.focus();
        await userEvent.keyboard('{Escape}');

        expect(onKeydown).not.to.have.been.called;
      });
    });
  });
});
