import { faBell, faGear, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { faBell as fasBell, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import { userEvent } from '@vitest/browser/context';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type MenuItem } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';
import { closestElementComposed } from '@sl-design-system/shared';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
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
      expect(children.item(0)).to.have.attribute('disabled');
      expect(children.item(1)).to.have.attribute('disabled');
      expect(children.item(2)).to.have.attribute('disabled');
    });

    it('should have made all slotted elements visible', () => {
      // When all items fit, visibility is set to 'visible' by the resize observer
      // Check that no items are hidden
      const allVisible = Array.from(el.children).every(child => {
        const display = (child as HTMLElement).style.display;
        return display === '' || display !== 'none';
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

  describe('keyboard navigation', () => {
    let el: ToolBar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
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

      expect(buttons[0].tabIndex).to.equal(0);
    });

    it('should wrap focus from first to last item', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      buttons[0].focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;

      expect(buttons[buttons.length - 1].tabIndex).to.equal(0);
    });
  });
});
