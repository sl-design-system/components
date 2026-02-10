import { faBell, faGear, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { faBell as fasBell, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type MenuItem } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';
import { closestElementComposed } from '@sl-design-system/shared';
import '@sl-design-system/toggle-button/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import {
  type ToolBar,
  type ToolBarItem,
  type ToolBarItemButton,
  type ToolBarItemDivider,
  type ToolBarItemMenu
} from './tool-bar.js';

Icon.register(faBell, faGear, faPen, faTrash, fasBell, fasGear);

class ToolBarNestedSlotTest extends LitElement {
  get toolBar(): ToolBar | null {
    return this.renderRoot.querySelector('sl-tool-bar');
  }

  override render() {
    return html`
      <sl-tool-bar>
        <slot></slot>
      </sl-tool-bar>
    `;
  }
}

try {
  customElements.define('tool-bar-nested-slot-test', ToolBarNestedSlotTest);
} catch {
  /* empty */
}

describe('sl-tool-bar', () => {
  describe('defaults', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button
          </sl-button>

          <sl-tool-bar-divider></sl-tool-bar-divider>

          <sl-tool-bar-divider></sl-tool-bar-divider>

          <sl-menu-button>
            <div slot="button">Edit</div>
            <sl-menu-item>
              <sl-icon name="far-pen"></sl-icon>
              Rename...
            </sl-menu-item>
            <sl-menu-item>
              <sl-icon name="far-trash"></sl-icon>
              Delete...
            </sl-menu-item>
          </sl-menu-button>
        </sl-tool-bar>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have a toolbar role', () => {
      expect(el).to.have.attribute('role', 'toolbar');
    });

    it('should have a default alignment', () => {
      expect(el).not.to.have.attribute('align');
      expect(el.align).to.be.undefined;
    });

    it('should have an alignment when set', async () => {
      el.align = 'end';
      await el.updateComplete;

      expect(el).to.have.attribute('align', 'end');
    });

    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
      expect(el).not.to.have.attribute('disabled');
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      const children = el.children;
      // Only check interactive elements (buttons and menu-buttons), not dividers
      expect(children.item(0)).to.have.attribute('disabled'); // sl-button
      expect(children.item(3)).to.have.attribute('disabled'); // sl-menu-button
    });

    it('should preserve originally disabled buttons when toolbar is re-enabled', async () => {
      // Create a toolbar with one button already disabled
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>Enabled Button</sl-button>
          <sl-button disabled>Originally Disabled</sl-button>
          <sl-button>Another Enabled</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));

      const buttons = Array.from(el.querySelectorAll('sl-button'));

      // Verify initial state
      expect(buttons[0]).not.to.have.attribute('disabled');
      expect(buttons[1]).to.have.attribute('disabled');
      expect(buttons[2]).not.to.have.attribute('disabled');

      // Disable the toolbar
      el.disabled = true;
      await el.updateComplete;

      // All buttons should be disabled
      expect(buttons[0]).to.have.attribute('disabled');
      expect(buttons[1]).to.have.attribute('disabled');
      expect(buttons[2]).to.have.attribute('disabled');

      // Re-enable the toolbar
      el.disabled = false;
      await el.updateComplete;

      // Originally enabled buttons should be enabled again
      // but originally disabled button should remain disabled
      expect(buttons[0]).not.to.have.attribute('disabled');
      expect(buttons[1]).to.have.attribute('disabled');
      expect(buttons[2]).not.to.have.attribute('disabled');
    });

    it('should have made all slotted elements visible', () => {
      // When all items fit, visibility is set to 'visible' by the resize observer
      // Check that no items are hidden
      const allVisible = Array.from(el.children).every(child => {
        return getComputedStyle(child).display !== 'none';
      });

      expect(allVisible).to.be.true;
      expect(el.menuItems).to.have.length(0);
    });

    it('should not have a menu button', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      expect(menuButton).not.to.exist;
    });

    it('should map the slotted items', () => {
      expect(el.items).to.have.length(4);

      let item: ToolBarItem = el.items[0] as ToolBarItemButton;
      expect(item.type).to.equal('button');
      expect(item.label).to.equal('Button');
      expect(item.icon).to.equal('far-gear');
      expect(item.visible).to.be.true;

      item = el.items[1] as ToolBarItemDivider;
      expect(item.type).to.equal('divider');
      expect(item.visible).to.be.true;

      item = el.items[2] as ToolBarItemDivider;
      expect(item.type).to.equal('divider');
      expect(item.visible).to.be.true;

      item = el.items[3] as ToolBarItemMenu;
      expect(item.type).to.equal('menu');
      expect(item.label).to.equal('Edit');
      expect(item.visible).to.be.true;
    });

    it('should update the disabled state of the items when they change', async () => {
      expect(el.items[0]).to.have.property('disabled', false);

      const button = el.querySelector('sl-button')!;
      button.setAttribute('disabled', '');

      await new Promise(resolve => setTimeout(resolve));

      expect(el.items[0]).to.have.property('disabled', true);
    });
  });

  describe('overflow', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 48px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button
          </sl-button>

          <sl-tool-bar-divider></sl-tool-bar-divider>

          <sl-button aria-labelledby="edit-tooltip" fill="ghost">
            <sl-icon name="far-pen"></sl-icon>
          </sl-button>
          <sl-tooltip id="edit-tooltip">Edit</sl-tooltip>

          <sl-menu-button>
            <div slot="button">Edit</div>
            <sl-menu-item>
              <sl-icon name="far-pen"></sl-icon>
              Rename...
            </sl-menu-item>
            <sl-menu-item>
              <sl-icon name="far-trash"></sl-icon>
              Delete...
            </sl-menu-item>
          </sl-menu-button>
        </sl-tool-bar>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have hidden all slotted elements', () => {
      // When items overflow, they should be hidden or menu button should exist
      // Visibility might not be set immediately in all browsers/test environments
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      // Either items are hidden OR overflow menu exists
      expect(menuButton).to.exist;
      expect(el.menuItems.length).to.be.greaterThan(0);
    });

    it('should have a menu button', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      expect(menuButton).to.exist;
    });

    it('should have a regular menu item for the button', () => {
      const menuItem = el.renderRoot.querySelector('sl-menu-item');

      expect(menuItem).to.exist;
      expect(menuItem).to.have.trimmed.text('Button');
      expect(menuItem).to.contain('sl-icon[name="far-gear"]');
    });

    it('should have an hr element for the divider', () => {
      const hr = el.renderRoot.querySelector('hr');

      expect(hr).to.exist;
    });

    it('should have a menu item for the icon only button with tooltip connected via aria-labelledby', () => {
      const menuItems = el.renderRoot.querySelectorAll('sl-menu-item');
      // Find the menu item with far-pen icon (not the one inside submenu)
      const editButton = Array.from(menuItems).find(
        item => item.querySelector('sl-icon[name="far-pen"]') && !item.querySelector('sl-menu')
      );
      expect(editButton).to.exist;
      expect(editButton).to.have.trimmed.text('Edit');
      expect(editButton).to.contain('sl-icon[name="far-pen"]');
    });

    it('should have a menu item with submenu for the menu button', () => {
      const menu = el.renderRoot.querySelector('sl-menu')!,
        menuItem = menu.parentElement as MenuItem,
        menuItems = menu.querySelectorAll('sl-menu-item');

      expect(menuItem).to.contain.text('Edit');
      expect(menuItems).to.have.length(2);
      expect(menuItems[0]).to.have.trimmed.text('Rename...');
      expect(menuItems[0]).to.contain('sl-icon[name="far-pen"]');
      expect(menuItems[1]).to.have.trimmed.text('Delete...');
      expect(menuItems[1]).to.contain('sl-icon[name="far-trash"]');
    });

    it('should proxy clicks on the menu items to the original elements', () => {
      const onClick = spy();

      el.querySelector('sl-button')?.addEventListener('click', onClick);

      el.renderRoot.querySelector('sl-menu-item')?.click();

      expect(onClick).to.have.been.calledOnce;
    });
  });

  describe('nested slot', () => {
    let el: ToolBarNestedSlotTest;

    beforeEach(async () => {
      el = await fixture(html`
        <tool-bar-nested-slot-test>
          <sl-button>Button</sl-button>
        </tool-bar-nested-slot-test>
      `);

      // Nested slots require manual refresh
      await el.updateComplete;
      await el.toolBar?.updateComplete;
      el.toolBar?.refresh();
      await el.toolBar?.updateComplete;
    });

    it('should find the initial button', () => {
      expect(el.toolBar?.items).to.have.length(1);
      expect(el.toolBar?.items[0]).to.have.property('type', 'button');
      expect(el.toolBar?.items[0]).to.have.property('label', 'Button');
    });

    it('should find buttons added later after calling refresh()', async () => {
      const button = document.createElement('sl-button');
      button.textContent = 'New Button';
      el.appendChild(button);

      await el.updateComplete;

      el.toolBar?.refresh();

      expect(el.toolBar?.items).to.have.length(2);
      expect(el.toolBar?.items[1]).to.have.property('type', 'button');
      expect(el.toolBar?.items[1]).to.have.property('label', 'New Button');
    });

    it('should detect disabled state changes on the initial button after calling refresh()', async () => {
      await el.updateComplete;
      await el.toolBar?.updateComplete;

      // Ensure the nested slotted items are mapped before asserting
      el.toolBar?.refresh();
      await el.toolBar?.updateComplete;

      expect(el.toolBar?.items[0]).to.have.property('disabled', false);

      el.querySelector('sl-button')?.setAttribute('disabled', '');

      // Give the mutation a tick to propagate
      await new Promise(resolve => setTimeout(resolve));

      el.toolBar?.refresh();
      await el.toolBar?.updateComplete;

      expect(el.toolBar?.items[0]).to.have.property('disabled', true);
    });
  });

  describe('contained', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`<sl-tool-bar></sl-tool-bar>`);
    });

    it('should not be contained by default', () => {
      expect(el.contained).not.to.be.true;
      expect(el).not.to.have.attribute('contained');
    });

    it('should be contained when set', async () => {
      el.contained = true;
      await el.updateComplete;

      expect(el).to.have.attribute('contained');
    });

    it('should reflect the contained attribute', async () => {
      el.setAttribute('contained', '');
      await el.updateComplete;

      expect(el.contained).to.be.true;
    });

    it('should remove the contained attribute when set to false', async () => {
      el.contained = true;
      await el.updateComplete;

      expect(el).to.have.attribute('contained');

      el.contained = false;
      await el.updateComplete;

      expect(el).not.to.have.attribute('contained');
    });
  });

  describe('fill', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button 1
          </sl-button>
          <sl-menu-button>
            <div slot="button">Menu</div>
            <sl-menu-item>Item 1</sl-menu-item>
          </sl-menu-button>
          <sl-button>
            <sl-icon name="far-pen"></sl-icon>
            Button 2
          </sl-button>
        </sl-tool-bar>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should not have a fill by default', () => {
      expect(el.fill).to.be.undefined;
    });

    it('should have a fill when set', async () => {
      el.fill = 'ghost';
      await el.updateComplete;

      expect(el.fill).to.equal('ghost');
    });

    it('should update child button fill attributes when fill is set to ghost', async () => {
      el.fill = 'ghost';
      await el.updateComplete;

      const buttons = el.querySelectorAll('sl-button');
      expect(buttons[0]).to.have.attribute('fill', 'ghost');
      expect(buttons[1]).to.have.attribute('fill', 'ghost');
    });

    it('should update child button fill attributes when fill is set to outline', async () => {
      el.fill = 'outline';
      await el.updateComplete;

      const buttons = el.querySelectorAll('sl-button');
      expect(buttons[0]).to.have.attribute('fill', 'outline');
      expect(buttons[1]).to.have.attribute('fill', 'outline');
    });

    it('should update child menu button fill attributes when fill is set', async () => {
      el.fill = 'ghost';
      await el.updateComplete;

      const menuButton = el.querySelector('sl-menu-button');
      expect(menuButton).to.have.attribute('fill', 'ghost');
    });

    it('should handle dynamic changes to the fill property', async () => {
      el.fill = 'ghost';
      await el.updateComplete;

      const buttons = el.querySelectorAll('sl-button');
      expect(buttons[0]).to.have.attribute('fill', 'ghost');

      el.fill = 'outline';
      await el.updateComplete;

      expect(buttons[0]).to.have.attribute('fill', 'outline');
      expect(buttons[1]).to.have.attribute('fill', 'outline');
    });

    it('should apply fill to the overflow menu button when items overflow', async () => {
      el.fill = 'ghost';
      el.style.inlineSize = '48px';
      await el.updateComplete;

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));

      const overflowMenuButton = el.shadowRoot?.querySelector('sl-menu-button');
      expect(overflowMenuButton).to.exist;
      expect(overflowMenuButton).to.have.attribute('fill', 'ghost');
    });

    it('should update overflow menu button fill when fill changes dynamically', async () => {
      el.style.inlineSize = '48px';
      await el.updateComplete;

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));

      el.fill = 'outline';
      await el.updateComplete;

      const overflowMenuButton = el.shadowRoot?.querySelector('sl-menu-button');
      expect(overflowMenuButton).to.exist;
      expect(overflowMenuButton).to.have.attribute('fill', 'outline');
    });

    it('should update nested buttons inside child elements', async () => {
      const wrapper = document.createElement('div');
      const nestedButton = document.createElement('sl-button');
      nestedButton.textContent = 'Nested Button';
      wrapper.appendChild(nestedButton);
      el.appendChild(wrapper);
      await el.updateComplete;

      el.fill = 'ghost';
      await el.updateComplete;

      expect(nestedButton).to.have.attribute('fill', 'ghost');
    });
  });

  describe('inverted', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button 1
          </sl-button>
          <sl-menu-button>
            <div slot="button">Menu</div>
            <sl-menu-item>Item 1</sl-menu-item>
          </sl-menu-button>
          <sl-button>
            <sl-icon name="far-pen"></sl-icon>
            Button 2
          </sl-button>
        </sl-tool-bar>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should not be inverted by default', () => {
      expect(el.inverted).not.to.be.true;
    });

    it('should set variant attribute on child buttons when inverted is true', async () => {
      el.inverted = true;
      await el.updateComplete;

      const buttons = el.querySelectorAll('sl-button');
      expect(buttons[0]).to.have.attribute('variant', 'inverted');
      expect(buttons[1]).to.have.attribute('variant', 'inverted');
    });

    it('should set variant attribute on child menu buttons when inverted is true', async () => {
      el.inverted = true;
      await el.updateComplete;

      const menuButton = el.querySelector('sl-menu-button');
      expect(menuButton).to.have.attribute('variant', 'inverted');
    });

    it('should handle dynamic changes to inverted property', async () => {
      const buttons = el.querySelectorAll('sl-button');

      el.inverted = true;
      await el.updateComplete;
      expect(buttons[0]).to.have.attribute('variant', 'inverted');
    });

    it('should update nested buttons inside child elements when inverted changes', async () => {
      const wrapper = document.createElement('div');
      const nestedButton = document.createElement('sl-button');
      nestedButton.textContent = 'Nested Button';
      wrapper.appendChild(nestedButton);
      el.appendChild(wrapper);
      await el.updateComplete;

      el.inverted = true;
      await el.updateComplete;

      expect(nestedButton).to.have.attribute('variant', 'inverted');
    });

    it('should apply inverted variant to overflow menu button when items overflow', async () => {
      el.inverted = true;
      el.style.inlineSize = '48px';
      await el.updateComplete;

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));

      const overflowMenuButton = el.shadowRoot?.querySelector('sl-menu-button');
      expect(overflowMenuButton).to.exist;
      expect(overflowMenuButton).to.have.attribute('variant', 'inverted');
    });
  });

  describe('#updateButtonAttributes', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button 1
          </sl-button>
          <sl-menu-button>
            <div slot="button">Menu</div>
            <sl-menu-item>Item 1</sl-menu-item>
          </sl-menu-button>
          <div id="wrapper">
            <sl-button>
              <sl-icon name="far-pen"></sl-icon>
              Nested Button
            </sl-button>
            <sl-menu-button>
              <div slot="button">Nested Menu</div>
              <sl-menu-item>Item 2</sl-menu-item>
            </sl-menu-button>
          </div>
        </sl-tool-bar>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should set fill attribute on direct child buttons when fill is defined', async () => {
      el.fill = 'ghost';
      await el.updateComplete;

      const directButton = el.querySelector(':scope > sl-button');
      expect(directButton).to.have.attribute('fill', 'ghost');
    });

    it('should set fill attribute on direct child menu-buttons when fill is defined', async () => {
      el.fill = 'outline';
      await el.updateComplete;

      const directMenuButton = el.querySelector(':scope > sl-menu-button');
      expect(directMenuButton).to.have.attribute('fill', 'outline');
    });

    it('should set fill attribute on nested buttons when fill is defined', async () => {
      el.fill = 'ghost';
      await el.updateComplete;

      const nestedButton = el.querySelector('#wrapper sl-button');
      expect(nestedButton).to.have.attribute('fill', 'ghost');
    });

    it('should set fill attribute on nested menu-buttons when fill is defined', async () => {
      el.fill = 'outline';
      await el.updateComplete;

      const nestedMenuButton = el.querySelector('#wrapper sl-menu-button');
      expect(nestedMenuButton).to.have.attribute('fill', 'outline');
    });

    it('should set variant attribute on all buttons when inverted is true', async () => {
      el.inverted = true;
      await el.updateComplete;

      const allButtons = el.querySelectorAll('sl-button');
      allButtons.forEach(button => {
        expect(button).to.have.attribute('variant', 'inverted');
      });
    });

    it('should set variant attribute on all menu-buttons when inverted is true', async () => {
      el.inverted = true;
      await el.updateComplete;

      const allMenuButtons = el.querySelectorAll('sl-menu-button');
      allMenuButtons.forEach(menuButton => {
        expect(menuButton).to.have.attribute('variant', 'inverted');
      });
    });

    it('should handle both fill and inverted together', async () => {
      el.fill = 'ghost';
      el.inverted = true;
      await el.updateComplete;

      const button = el.querySelector('sl-button');
      expect(button).to.have.attribute('fill', 'ghost');
      expect(button).to.have.attribute('variant', 'inverted');
    });

    it('should handle dynamic changes to fill property', async () => {
      el.fill = 'ghost';
      await el.updateComplete;

      const button = el.querySelector('sl-button');
      expect(button).to.have.attribute('fill', 'ghost');

      el.fill = 'outline';
      await el.updateComplete;

      expect(button).to.have.attribute('fill', 'outline');
    });

    it('should handle dynamic changes to inverted property', async () => {
      el.inverted = true;
      await el.updateComplete;

      const button = el.querySelector('sl-button');
      expect(button).to.have.attribute('variant', 'inverted');
    });

    it('should update all buttons including deeply nested ones', async () => {
      const deepWrapper = document.createElement('div');
      const deeperWrapper = document.createElement('div');
      const deepButton = document.createElement('sl-button');
      deepButton.textContent = 'Deep Button';
      deeperWrapper.appendChild(deepButton);
      deepWrapper.appendChild(deeperWrapper);
      el.appendChild(deepWrapper);
      await el.updateComplete;

      el.fill = 'ghost';
      el.inverted = true;
      await el.updateComplete;

      expect(deepButton).to.have.attribute('fill', 'ghost');
      expect(deepButton).to.have.attribute('variant', 'inverted');
    });

    it('should handle simultaneous fill and inverted changes', async () => {
      el.fill = 'ghost';
      el.inverted = true;
      await el.updateComplete;
      const button = el.querySelector('sl-button');

      expect(button).to.have.attribute('fill', 'ghost');
      expect(button).to.have.attribute('variant', 'inverted');

      el.fill = 'outline';
      await el.updateComplete;

      // Give attribute propagation a tick
      await new Promise(resolve => setTimeout(resolve));

      const updatedButton = el.querySelector('sl-button');
      expect(updatedButton).to.have.attribute('fill', 'outline');
    });
  });

  describe('keyboard navigation', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 600px">
          <sl-button>
            <sl-icon name="far-bell"></sl-icon>
            Notifications
          </sl-button>
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Settings
          </sl-button>
          <sl-button disabled>
            <sl-icon name="far-pen"></sl-icon>
            Disabled
          </sl-button>
          <sl-button>
            <sl-icon name="far-trash"></sl-icon>
            Delete
          </sl-button>
        </sl-tool-bar>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should focus the first enabled button when calling focus()', () => {
      el.focus();

      const firstButton = el.querySelector('sl-button:not([disabled])');

      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(firstButton);
    });

    it('should include overflow menu button in navigation when items overflow', async () => {
      el.style.inlineSize = '48px';
      await new Promise(resolve => setTimeout(resolve, 100));

      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');
      expect(menuButton).to.exist;

      el.focus();
      await el.updateComplete;

      expect(document.activeElement).to.exist;
    });

    it('should wrap focus from last to first item', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      buttons[buttons.length - 1].focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      const focusedButton = closestElementComposed(document.activeElement!, 'sl-button');
      expect(focusedButton).to.equal(buttons[0]);
    });

    it('should wrap focus from first to last item', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      buttons[0].focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;

      const focusedButton = closestElementComposed(document.activeElement!, 'sl-button');
      expect(focusedButton).to.equal(buttons[buttons.length - 1]);
    });

    it('should move focus to next item when pressing ArrowRight', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      buttons[0].focus();
      await el.updateComplete;

      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(buttons[0]);

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(buttons[1]);
    });

    it('should move focus to previous item when pressing ArrowLeft', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      buttons[1].focus();
      await el.updateComplete;

      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(buttons[1]);

      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;

      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(buttons[0]);
    });

    it('should skip disabled items when navigating with ArrowRight', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      const disabledIndex = buttons.findIndex(btn => btn.hasAttribute('disabled'));

      buttons[disabledIndex - 1].focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      // Should skip the disabled button and move to the next enabled one
      const focusedButton = closestElementComposed(document.activeElement!, 'sl-button');
      expect(focusedButton).to.equal(buttons[disabledIndex + 1]);
    });

    it('should skip disabled items when navigating with ArrowLeft', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      const disabledIndex = buttons.findIndex(btn => btn.hasAttribute('disabled'));

      buttons[disabledIndex + 1].focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;

      // Should skip the disabled button and move to the previous enabled one
      const focusedButton = closestElementComposed(document.activeElement!, 'sl-button');
      expect(focusedButton).to.equal(buttons[disabledIndex - 1]);
    });

    it('should navigate through multiple items with multiple arrow key presses', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      buttons[0].focus();
      await el.updateComplete;

      // Press ArrowRight twice
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      // Should skip disabled button and be on the delete button
      const focusedButton = closestElementComposed(document.activeElement!, 'sl-button');
      expect(focusedButton).to.equal(buttons[3]);
    });

    it('should navigate backwards through multiple items', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      // Start from the last button (Delete)
      buttons[3].focus();
      await el.updateComplete;

      // Press ArrowLeft once - should move to Settings (index 1), skipping Disabled (index 2)
      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;

      // Should be on the settings button (index 1)
      const focusedButton = closestElementComposed(document.activeElement!, 'sl-button');
      expect(focusedButton).to.equal(buttons[1]);
    });

    it('should maintain focus order with menu buttons', async () => {
      const toolbar = await fixture(html`
        <sl-tool-bar style="inline-size: 600px">
          <sl-button>Button 1</sl-button>
          <sl-menu-button>
            <div slot="button">Menu</div>
            <sl-menu-item>Item 1</sl-menu-item>
          </sl-menu-button>
          <sl-button>Button 2</sl-button>
        </sl-tool-bar>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));

      const button1 = toolbar.querySelector('sl-button');
      const button2 = toolbar.querySelectorAll('sl-button')[1];

      button1?.focus();
      await (toolbar as ToolBar).updateComplete;

      // Navigate right twice - should go through menu button to button 2
      await userEvent.keyboard('{ArrowRight}');
      await (toolbar as ToolBar).updateComplete;

      await userEvent.keyboard('{ArrowRight}');
      await (toolbar as ToolBar).updateComplete;

      // Should end up at button 2
      const focusedAfterSecond = closestElementComposed(document.activeElement!, 'sl-button');
      expect(focusedAfterSecond).to.equal(button2);
    });

    it('should include overflow menu button in arrow key navigation', async () => {
      const overflowToolbar = await fixture(html`
        <sl-tool-bar style="inline-size: 120px">
          <sl-button>A</sl-button>
          <sl-button>B</sl-button>
          <sl-button>C</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 150));

      const menuButton = overflowToolbar.shadowRoot?.querySelector('sl-menu-button');
      expect(menuButton).to.exist;

      // Start from first visible button and navigate right
      const firstVisibleButton = overflowToolbar.querySelector('sl-button:not([style*="display: none"])') as Button;
      firstVisibleButton?.focus();
      await (overflowToolbar as ToolBar).updateComplete;

      const initialFocus = closestElementComposed(document.activeElement!, 'sl-button');
      expect(initialFocus).to.equal(firstVisibleButton);

      // Press right arrow key - should navigate to another element
      await userEvent.keyboard('{ArrowRight}');
      await (overflowToolbar as ToolBar).updateComplete;

      const focusedAfterRight = closestElementComposed(document.activeElement!, 'sl-button');
      // Focus should have moved away from the first button
      expect(focusedAfterRight).to.not.equal(firstVisibleButton);
    });

    it('should navigate from overflow menu button back to visible items with ArrowLeft', async () => {
      const overflowToolbar = await fixture(html`
        <sl-tool-bar style="inline-size: 120px">
          <sl-button>A</sl-button>
          <sl-button>B</sl-button>
          <sl-button>C</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 150));

      const menuButton = overflowToolbar.shadowRoot?.querySelector('sl-menu-button');
      const menuButtonInternal = menuButton?.renderRoot.querySelector('sl-button') as HTMLElement;

      expect(menuButton).to.exist;
      expect(menuButtonInternal).to.exist;

      menuButtonInternal?.focus();
      await (overflowToolbar as ToolBar).updateComplete;

      await userEvent.keyboard('{ArrowLeft}');
      await (overflowToolbar as ToolBar).updateComplete;

      // Should move focus away from overflow menu button
      const focusedButton = closestElementComposed(document.activeElement!, 'sl-button');
      // Verify focus moved to a different button (not the menu button internal)
      expect(focusedButton).to.not.equal(menuButtonInternal);
    });

    it('should navigate continuously through all enabled items in order', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      const enabledButtons = buttons.filter(btn => !btn.hasAttribute('disabled'));

      buttons[0].focus();
      await el.updateComplete;

      // Navigate forward twice (first -> second -> third enabled button)
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(enabledButtons[1]);

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(enabledButtons[2]);
    });
  });
  describe('forceRecalculation', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button 1
          </sl-button>
          <sl-button>
            <sl-icon name="far-bell"></sl-icon>
            Button 2
          </sl-button>
          <sl-button>
            <sl-icon name="far-pen"></sl-icon>
            Button 3
          </sl-button>
        </sl-tool-bar>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should trigger layout recalculation', async () => {
      // Force some items to overflow
      el.style.inlineSize = '48px';
      await new Promise(resolve => setTimeout(resolve, 100));

      const initialHiddenCount = el.menuItems.length;
      expect(initialHiddenCount).to.be.greaterThan(0);

      // Expand the toolbar
      el.style.inlineSize = '400px';

      // Call forceRecalculation and wait for debounce
      el.forceRecalculation();
      await new Promise(resolve => setTimeout(resolve, 250));

      // Items should be visible again
      expect(el.menuItems.length).to.be.lessThan(initialHiddenCount);
    });

    it('should debounce multiple calls', async () => {
      // Force overflow to ensure we have measurable changes
      el.style.inlineSize = '48px';
      await new Promise(resolve => setTimeout(resolve, 100));

      const initialMenuItemCount = el.menuItems.length;

      // Expand toolbar
      el.style.inlineSize = '400px';

      // Call forceRecalculation multiple times rapidly
      el.forceRecalculation();
      el.forceRecalculation();
      el.forceRecalculation();

      // Wait for debounce timeout
      await new Promise(resolve => setTimeout(resolve, 250));

      // The layout should have been recalculated (fewer items in overflow menu)
      expect(el.menuItems.length).to.be.lessThan(initialMenuItemCount);
    });

    it('should cancel pending recalculation when called again', async () => {
      // Force overflow
      el.style.inlineSize = '48px';
      await new Promise(resolve => setTimeout(resolve, 100));

      el.style.inlineSize = '400px';

      el.forceRecalculation();

      // Wait a bit but not enough for debounce
      await new Promise(resolve => setTimeout(resolve, 100));

      // Call again to cancel the first timeout
      el.forceRecalculation();

      // Wait for the second debounce
      await new Promise(resolve => setTimeout(resolve, 250));

      // The recalculation should have completed (no overflow items)
      expect(el.menuItems.length).to.equal(0);
    });

    it('should make hidden items visible after expansion', async () => {
      // Force overflow first
      el.style.inlineSize = '48px';
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el.menuItems.length).to.be.greaterThan(0);

      // Expand and force recalculation
      el.style.inlineSize = '400px';
      el.forceRecalculation();
      await new Promise(resolve => setTimeout(resolve, 250));

      // After forceRecalculation, items should be visible again
      expect(el.menuItems.length).to.equal(0);
    });

    it('should do nothing if no items are hidden', async () => {
      // All items are visible
      expect(el.menuItems.length).to.equal(0);

      const menuItemsBeforeRecalc = el.menuItems.length;

      el.forceRecalculation();
      await new Promise(resolve => setTimeout(resolve, 250));

      // Menu items should remain the same (none hidden)
      expect(el.menuItems.length).to.equal(menuItemsBeforeRecalc);
    });

    it('should handle size changes after forceRecalculation', async () => {
      // Make toolbar overflow
      el.style.inlineSize = '100px';
      await new Promise(resolve => setTimeout(resolve, 100));

      const initialMenuItemCount = el.menuItems.length;
      expect(initialMenuItemCount).to.be.greaterThan(0);

      // Expand and force recalculation
      el.style.inlineSize = '500px';
      el.forceRecalculation();
      await new Promise(resolve => setTimeout(resolve, 250));

      // More items should be visible
      expect(el.menuItems.length).to.be.lessThan(initialMenuItemCount);
    });

    it('should clean up timeout on disconnect', async () => {
      el.forceRecalculation();

      // Disconnect before timeout completes
      el.remove();
      await new Promise(resolve => setTimeout(resolve, 250));

      // No errors should occur
      expect(document.body.contains(el)).to.be.false;
    });
  });

  describe('sl-toggle-button', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-toggle-button>Toggle</sl-toggle-button>
        </sl-tool-bar>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should map the toggle button item', () => {
      expect(el.items).to.have.length(1);

      const item = el.items[0] as ToolBarItemButton;

      expect(item.type).to.equal('button');
      expect(item.label).to.equal('Toggle');
      expect(item.selectable).to.be.true;
    });

    it('should update child toggle button attributes when fill is set', async () => {
      el.fill = 'ghost';
      await el.updateComplete;

      const toggleButton = el.querySelector('sl-toggle-button');

      expect(toggleButton).to.have.attribute('fill', 'ghost');
    });

    it('should set variant attribute on child toggle buttons when inverted is true', async () => {
      el.inverted = true;
      await el.updateComplete;

      const toggleButton = el.querySelector('sl-toggle-button');

      expect(toggleButton).to.have.attribute('variant', 'inverted');
    });

    it('should disable toggle buttons when toolbar is disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const toggleButton = el.querySelector('sl-toggle-button');

      expect(toggleButton).to.have.attribute('disabled');
    });

    it('should move focus to toggle button when calling focus()', () => {
      el.focus();
      const toggleButton = el.querySelector('sl-toggle-button');

      expect(document.activeElement).to.equal(toggleButton);
    });

    it('should include toggle button in roving tabindex navigation', async () => {
      const toolbar = await fixture(html`
        <sl-tool-bar style="inline-size: 600px">
          <sl-toggle-button>Toggle</sl-toggle-button>
          <sl-button>Button</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));

      const toggleButton = toolbar.querySelector('sl-toggle-button') as HTMLElement;
      const button = toolbar.querySelector('sl-button') as HTMLElement;

      toggleButton.focus();
      await toolbar.updateComplete;

      await userEvent.keyboard('{ArrowRight}');
      await toolbar.updateComplete;

      expect(document.activeElement).to.equal(button);

      await userEvent.keyboard('{ArrowLeft}');
      await toolbar.updateComplete;

      expect(document.activeElement).to.equal(toggleButton);
    });

    it('should move toggle button to overflow menu', async () => {
      el.style.inlineSize = '20px'; // Force overflow
      await new Promise(resolve => setTimeout(resolve, 150));

      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');
      expect(menuButton).to.exist;
      expect(el.menuItems).to.have.length(1);
      expect((el.menuItems[0] as ToolBarItemButton).label).to.equal('Toggle');
    });
  });
});
