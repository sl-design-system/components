import { faBell, faGear, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { faBell as fasBell, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type MenuItem } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
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
  type ToolBarItemGroup,
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

          <sl-toggle-group>
            <sl-toggle-button aria-label="Bell">
              <sl-icon name="far-bell" slot="default"></sl-icon>
              <sl-icon name="fas-bell" slot="pressed"></sl-icon>
            </sl-toggle-button>
            <sl-toggle-button aria-label="Gear">
              <sl-icon name="far-gear" slot="default"></sl-icon>
              <sl-icon name="fas-gear" slot="pressed"></sl-icon>
            </sl-toggle-button>
          </sl-toggle-group>

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
      const visible = Array.from(el.children).map(child => (child as HTMLElement).style.visibility);

      expect(visible).to.deep.equal(['visible', 'visible', 'visible', 'visible', 'visible']);
    });

    it('should not have a menu button', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      expect(menuButton).not.to.exist;
    });

    it('should map the slotted items', () => {
      expect(el.items).to.have.length(5);

      let item: ToolBarItem = el.items[0] as ToolBarItemButton;
      expect(item.type).to.equal('button');
      expect(item.label).to.equal('Button');
      expect(item.icon).to.equal('far-gear');
      expect(item.visible).to.be.true;

      item = el.items[1] as ToolBarItemDivider;
      expect(item.type).to.equal('divider');
      expect(item.visible).to.be.true;

      item = el.items[2] as ToolBarItemGroup;
      expect(item.type).to.equal('group');
      expect(item.selects).to.equal('single');
      expect(item.visible).to.be.true;

      item = el.items[3] as ToolBarItemDivider;
      expect(item.type).to.equal('divider');
      expect(item.visible).to.be.true;

      item = el.items[4] as ToolBarItemMenu;
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

          <sl-toggle-group multiple>
            <sl-toggle-button aria-label="Bell">
              <sl-icon name="far-bell" slot="default"></sl-icon>
              <sl-icon name="fas-bell" slot="pressed"></sl-icon>
            </sl-toggle-button>
            <sl-toggle-button aria-label="Gear">
              <sl-icon name="far-gear" slot="default"></sl-icon>
              <sl-icon name="fas-gear" slot="pressed"></sl-icon>
            </sl-toggle-button>
          </sl-toggle-group>

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
      const hidden = Array.from(el.children).map(child => (child as HTMLElement).style.visibility);

      expect(hidden).to.deep.equal(['hidden', 'hidden', 'hidden', 'hidden', '', 'hidden']);
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

    it('should have a menu group for the toggle group', () => {
      const group = el.renderRoot.querySelector('sl-menu-item-group');

      expect(group).to.exist;
      expect(group?.selects).to.equal('multiple');
      expect(group?.children).to.have.length(2);

      const firstChild = group?.children.item(0);
      expect(firstChild).to.have.attribute('selectable');
      expect(firstChild).to.have.trimmed.text('Bell');
      expect(firstChild).to.contain('sl-icon[name="far-bell"]');

      const lastChild = group?.children.item(1);
      expect(lastChild).to.have.attribute('selectable');
      expect(lastChild).to.have.trimmed.text('Gear');
      expect(lastChild).to.contain('sl-icon[name="far-gear"]');
    });

    it('should have a menu item for the icon only button with tooltip connected via aria-labelledby', () => {
      const lastChild = el.renderRoot.querySelectorAll('sl-menu-item')[3];
      expect(lastChild).to.have.trimmed.text('Edit');
      expect(lastChild).to.contain('sl-icon[name="far-pen"]');
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
    });

    it('should find the initial button', () => {
      expect(el.toolBar?.items).to.have.length(1);
      expect(el.toolBar?.items[0]).to.have.property('type', 'button');
      expect(el.toolBar?.items[0]).to.have.property('label', 'Button');
    });

    it('should not find buttons added later', async () => {
      const button = document.createElement('sl-button');
      button.textContent = 'New Button';
      el.appendChild(button);

      await new Promise(resolve => setTimeout(resolve));

      expect(el.toolBar?.items).to.have.length(1);
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

    it('should not detect disabled state changes on the initial button', async () => {
      expect(el.toolBar?.items[0]).to.have.property('disabled', false);

      el.querySelector('sl-button')?.setAttribute('disabled', '');

      await new Promise(resolve => setTimeout(resolve));

      expect(el.toolBar?.items[0]).to.have.property('disabled', false);
    });

    it('should detect disabled state changes on the initial button after calling refresh()', async () => {
      expect(el.toolBar?.items[0]).to.have.property('disabled', false);

      el.querySelector('sl-button')?.setAttribute('disabled', '');

      await el.updateComplete;

      el.toolBar?.refresh();

      expect(el.toolBar?.items[0]).to.have.property('disabled', true);
    });
  });
});
