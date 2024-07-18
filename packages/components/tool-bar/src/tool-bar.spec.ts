import { faBell, faGear } from '@fortawesome/pro-regular-svg-icons';
import { faBell as fasBell, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-group/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type ToolBar, type ToolBarItemButton, type ToolBarItemDivider, type ToolBarItemGroup } from './tool-bar.js';

Icon.register(faBell, faGear, fasBell, fasGear);

describe('sl-tool-bar', () => {
  let el: ToolBar;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button
          </sl-button>

          <sl-tool-bar-divider></sl-tool-bar-divider>

          <sl-button-group>
            <sl-toggle-button aria-label="Bell">
              <sl-icon name="far-bell"></sl-icon>
              <sl-icon name="fas-bell" slot="pressed"></sl-icon>
            </sl-toggle-button>
            <sl-toggle-button aria-label="Gear">
              <sl-icon name="far-gear"></sl-icon>
              <sl-icon name="fas-gear" slot="pressed"></sl-icon>
            </sl-toggle-button>
          </sl-button-group>
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

      expect(visible).to.deep.equal(['visible', 'visible', 'visible']);
    });

    it('should not have a menu button', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      expect(menuButton).not.to.exist;
    });

    it('should map the slotted items', () => {
      expect(el.items).to.have.length(3);

      const button = el.items[0] as ToolBarItemButton;
      expect(button.type).to.equal('button');
      expect(button.label).to.equal('Button');
      expect(button.icon).to.equal('far-gear');
      expect(button.visible).to.be.true;

      const divider = el.items[1] as ToolBarItemDivider;
      expect(divider.type).to.equal('divider');
      expect(divider.visible).to.be.true;

      const group = el.items[2] as ToolBarItemGroup;
      expect(group.type).to.equal('group');
      expect(group.selects).to.equal('multiple');
      expect(group.visible).to.be.true;
    });
  });

  describe('overflow', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 48px">
          <sl-button>
            <sl-icon name="far-gear"></sl-icon>
            Button
          </sl-button>

          <sl-tool-bar-divider></sl-tool-bar-divider>

          <sl-button-group>
            <sl-toggle-button aria-label="Bell">
              <sl-icon name="far-bell"></sl-icon>
              <sl-icon name="fas-bell" slot="pressed"></sl-icon>
            </sl-toggle-button>
            <sl-toggle-button aria-label="Gear">
              <sl-icon name="far-gear"></sl-icon>
              <sl-icon name="fas-gear" slot="pressed"></sl-icon>
            </sl-toggle-button>
          </sl-button-group>
        </sl-tool-bar>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have hidden all slotted elements', () => {
      const hidden = Array.from(el.children).map(child => (child as HTMLElement).style.visibility);

      expect(hidden).to.deep.equal(['hidden', 'hidden', 'hidden']);
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

    it('should have a menu group for the button group', () => {
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

    it('should proxy clicks on the menu items to the original elements', () => {
      const onClick = spy();

      el.querySelector('sl-button')?.addEventListener('click', onClick);

      el.renderRoot.querySelector('sl-menu-item')?.click();

      expect(onClick).to.have.been.calledOnce;
    });
  });
});
