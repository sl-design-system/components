import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type MenuItem } from './menu-item.js';
import { Menu } from './menu.js';

describe('sl-menu-item', () => {
  let el: MenuItem;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-menu-item>Item 1</sl-menu-item>`);
    });

    it('should have a menuitem role', () => {
      expect(el).to.have.attribute('role', 'menuitem');
    });

    it('should have a tabindex of 0', () => {
      expect(el).to.have.attribute('tabindex', '0');
    });

    it('should have a tabindex of -1 when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '-1');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
    });

    it('should not be selectable', () => {
      expect(el.selectable).not.to.be.true;
    });

    it('should not be selected', () => {
      expect(el.selected).not.to.be.true;
    });

    it('should not have a shortcut', () => {
      expect(el.shortcut).to.be.undefined;
    });
  });

  describe('selected', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-menu-item selectable selected>Item 1</sl-menu-item>`);
    });

    it('should be be selected', () => {
      expect(el.selected).to.be.true;
    });

    it('should have a check icon when selected', async () => {
      expect(el.renderRoot.querySelector('sl-icon[name="check"]')).to.exist;

      el.click();
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon[name="check"]')).not.to.exist;

      el.click();
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon[name="check"]')).to.exist;
    });

    it('should toggle selected when clicked', () => {
      el.click();
      expect(el.selected).to.be.false;

      el.click();
      expect(el.selected).to.be.true;
    });

    it('should toggle selected when focused and pressing enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(el.selected).to.be.false;

      await userEvent.keyboard('{Enter}');

      expect(el.selected).to.be.true;
    });

    it('should toggle selected when focused and pressing space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(el.selected).to.be.false;

      await userEvent.keyboard('{Space}');

      expect(el.selected).to.be.true;
    });

    it('should emit an sl-select event when clicked', () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);
      el.click();

      expect(onSelect).to.have.been.calledOnce;
    });

    it('should emit an sl-select event when focused and pressing enter', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(onSelect).to.have.been.calledOnce;
    });

    it('should emit an sl-select event when focused and pressing space', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(onSelect).to.have.been.calledOnce;
    });
  });

  describe('shortcut', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-menu-item shortcut="$mod+Digit1">Item 1</sl-menu-item>`);
    });

    it('should have a shortcut', () => {
      expect(el.shortcut).to.equal('$mod+Digit1');
    });

    it('should have an aria-keyshortcuts attribute', () => {
      expect(el).to.have.attribute('aria-keyshortcuts', navigator.platform.indexOf('Mac') > -1 ? 'Meta+1' : 'Ctrl+1');
    });

    it('should hide the kbd element from assistive technologies', () => {
      const kbd = el.renderRoot.querySelector('kbd');

      expect(kbd).to.exist;
      expect(kbd).to.have.attribute('aria-hidden', 'true');
    });

    it('should render the shortcut', () => {
      // Take into account that these tests are also running on Linux
      const text = navigator.platform.indexOf('Mac') > -1 ? '⌘1' : 'Ctrl1';

      expect(el.renderRoot.querySelector('kbd')).to.have.text(text);
    });

    it('should trigger the menu item when the shortcut is pressed', async () => {
      const onClick = spy();

      el.addEventListener('click', onClick);

      await userEvent.keyboard(navigator.platform.indexOf('Mac') > -1 ? '{Meta>}1{/Meta}' : '{Control>}1{/Control}');

      expect(onClick).to.have.been.calledOnce;
    });

    it('should not trigger the menu item when the shortcut is pressed and the menu item is disabled', async () => {
      const onClick = spy();

      el.addEventListener('click', onClick);
      el.disabled = true;
      await el.updateComplete;

      await userEvent.keyboard('{Meta>}1{/Meta}');

      expect(onClick).not.to.have.been.called;
    });
  });

  describe('submenu', () => {
    let menu: Menu;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-item>
          Item 1
          <sl-menu slot="submenu">
            <sl-menu-item>Subitem 1</sl-menu-item>
            <sl-menu-item>Subitem 2</sl-menu-item>
          </sl-menu>
        </sl-menu-item>
      `);

      menu = el.querySelector('sl-menu') as Menu;
    });

    it('should have an aria-expanded attribute', () => {
      expect(el).to.have.attribute('aria-expanded', 'false');
    });

    it('should set aria-expanded to true when the submenu is open', async () => {
      el.dispatchEvent(new PointerEvent('pointerenter'));
      await menu.updateComplete;

      expect(el).to.have.attribute('aria-expanded', 'true');
    });

    it('should have an aria-haspopup attribute on the wrapper', () => {
      const wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]');

      expect(wrapper).to.exist;
      expect(wrapper).to.have.attribute('aria-haspopup', 'true');
    });

    it('should have an aria-controls attribute on the wrapper', () => {
      const wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]');

      expect(wrapper).to.exist;
      expect(wrapper).to.have.attribute('aria-controls', menu.id);
    });

    it('should render an icon indicating the submenu', () => {
      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'chevron-right');
    });

    it('should anchor the submenu to the menu item', () => {
      expect(menu.anchorElement).to.equal(el);
    });

    it('should have a position of right-start', () => {
      expect(menu.position).to.equal('right-start');
    });

    it('should toggle the submenu when the pointer enters and leaves the menu item', async () => {
      el.dispatchEvent(new PointerEvent('pointerenter'));
      await menu.updateComplete;

      expect(menu).to.match(':popover-open');

      el.dispatchEvent(new PointerEvent('pointerleave'));
      await menu.updateComplete;

      expect(menu).not.to.match(':popover-open');
    });

    it('should show the submenu when the menu item is focused and pressing enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(menu).to.match(':popover-open');
    });

    it('should show the submenu when the menu item is focused and pressing space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(menu).to.match(':popover-open');
    });

    it('should toggle the submenu when pressing arrow right/left', async () => {
      el.focus();
      await userEvent.keyboard('{ArrowRight}');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(menu).to.match(':popover-open');
      expect(menu.querySelector('sl-menu-item')).to.equal(document.activeElement);

      // Overwrite the actual-placement attribute to test the left arrow; the value
      // is unexpected because we're running in a headless browser.
      menu.setAttribute('actual-placement', 'right-start');

      await userEvent.keyboard('{ArrowLeft}');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(menu).not.to.match(':popover-open');
      expect(el).to.equal(document.activeElement);
    });
  });
});
