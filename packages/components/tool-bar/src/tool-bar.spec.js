import { faBell, faGear, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { faBell as fasBell, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import { closestElementComposed } from '@sl-design-system/shared';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
Icon.register(faBell, faGear, faPen, faTrash, fasBell, fasGear);
class ToolBarNestedSlotTest extends LitElement {
  get toolBar() {
    return this.renderRoot.querySelector('sl-tool-bar');
  }
  render() {
    return html`
      <sl-tool-bar>
        <slot></slot>
      </sl-tool-bar>
    `;
  }
}
try {
  customElements.define('tool-bar-nested-slot-test', ToolBarNestedSlotTest);
} catch {}
describe('sl-tool-bar', () => {
  describe('defaults', () => {
    let el;
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
      await new Promise(resolve => setTimeout(resolve, 50));
      await el.updateComplete;
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
    it('should not have the empty state', () => {
      expect(el.matches(':state(empty)')).to.be.false;
    });
    it('should have the empty state when there are no slotted elements', async () => {
      const emptyEl = await fixture(html`<sl-tool-bar></sl-tool-bar>`);
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(emptyEl.matches(':state(empty)')).to.be.true;
    });
    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
      expect(el).not.to.have.attribute('disabled');
    });
    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;
      const children = el.children;
      expect(children.item(0)).to.have.attribute('data-toolbar-disabled');
      expect(children.item(3)).to.have.attribute('data-toolbar-disabled');
    });
    it('should clear aria-disabled from the overflow menu button when re-enabled', async () => {
      const toolbar = await fixture(html`
        <sl-tool-bar disabled style="inline-size: 48px">
          <sl-button>Button 1</sl-button>
          <sl-button>Button 2</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 150));
      await toolbar.updateComplete;
      const menuButton = toolbar.shadowRoot?.querySelector('sl-menu-button'),
        internalButton = menuButton?.renderRoot.querySelector('sl-button'),
        nativeButton = internalButton?.renderRoot.querySelector('button');
      expect(nativeButton).to.have.attribute('aria-disabled', 'true');
      toolbar.disabled = false;
      await toolbar.updateComplete;
      await internalButton?.updateComplete;
      expect(nativeButton).not.to.have.attribute('aria-disabled');
    });
    it('should have made all slotted elements visible', () => {
      const allVisible = Array.from(el.children).every(child => {
        return getComputedStyle(child).display !== 'none';
      });
      expect(allVisible).to.be.true;
      expect(el.menuItems).to.have.length(0);
    });
    it('should have a hidden menu button', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');
      expect(menuButton).to.exist;
      expect(menuButton).to.have.attribute('hidden');
    });
    it('should map the slotted items', () => {
      expect(el.items).to.have.length(4);
      let item = el.items[0];
      expect(item.type).to.equal('button');
      expect(item.label).to.equal('Button');
      expect(item.icon).to.equal('far-gear');
      expect(item.visible).to.be.true;
      item = el.items[1];
      expect(item.type).to.equal('divider');
      expect(item.visible).to.be.true;
      item = el.items[2];
      expect(item.type).to.equal('divider');
      expect(item.visible).to.be.true;
      item = el.items[3];
      expect(item.type).to.equal('menu');
      expect(item.label).to.equal('Edit');
      expect(item.visible).to.be.true;
    });
    it('should update the disabled state of the items when they change', async () => {
      expect(el.items[0]).to.have.property('disabled', false);
      const button = el.querySelector('sl-button');
      button.setAttribute('disabled', '');
      await new Promise(resolve => setTimeout(resolve));
      expect(el.items[0]).to.have.property('disabled', true);
    });
  });
  describe('nested slot', () => {
    let el;
    beforeEach(async () => {
      el = await fixture(html`
        <tool-bar-nested-slot-test>
          <sl-button>Button</sl-button>
        </tool-bar-nested-slot-test>
      `);
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
      el.toolBar?.refresh();
      await el.toolBar?.updateComplete;
      expect(el.toolBar?.items[0]).to.have.property('disabled', false);
      el.querySelector('sl-button')?.setAttribute('disabled', '');
      await new Promise(resolve => setTimeout(resolve));
      el.toolBar?.refresh();
      await el.toolBar?.updateComplete;
      expect(el.toolBar?.items[0]).to.have.property('disabled', true);
    });
  });
  describe('contained', () => {
    let el;
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
    let el;
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
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(firstButton);
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
    it('should keep aria-disabled overflow menu items reachable', async () => {
      const toolbar = await fixture(html`
        <sl-tool-bar style="inline-size: 48px">
          <sl-button>Cut</sl-button>
          <sl-button aria-disabled="true">Copy</sl-button>
          <sl-button>Paste</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 150));
      await toolbar.updateComplete;
      const menuButton = toolbar.shadowRoot?.querySelector('sl-menu-button'),
        items = Array.from(toolbar.shadowRoot?.querySelectorAll('sl-menu-item') ?? []),
        copy = items.find(item => item.textContent?.trim() === 'Copy');
      expect(copy).to.exist;
      expect(copy).to.have.attribute('aria-disabled', 'true');
      expect(copy).not.to.have.attribute('disabled');
      menuButton?.menu.showPopover();
      items[0].focus();
      await toolbar.updateComplete;
      await userEvent.keyboard('{ArrowDown}');
      await toolbar.updateComplete;
      expect(toolbar.shadowRoot?.activeElement).to.equal(copy);
    });
    it('should not activate aria-disabled overflow menu items', async () => {
      let clicked = false;
      const toolbar = await fixture(html`
        <sl-tool-bar style="inline-size: 48px">
          <sl-button @click=${() => (clicked = true)} aria-disabled="true">Copy</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 150));
      await toolbar.updateComplete;
      const copy = toolbar.shadowRoot?.querySelector('sl-menu-item');
      copy?.click();
      expect(clicked).to.be.false;
    });
    it('should wrap focus from last to first item', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      buttons[buttons.length - 1].focus();
      await el.updateComplete;
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      const focusedButton = closestElementComposed(document.activeElement, 'sl-button');
      expect(focusedButton).to.equal(buttons[0]);
    });
    it('should wrap focus from first to last item', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      buttons[0].focus();
      await el.updateComplete;
      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;
      const focusedButton = closestElementComposed(document.activeElement, 'sl-button');
      expect(focusedButton).to.equal(buttons[buttons.length - 1]);
    });
    it('should focus aria-disabled buttons using arrow keys', async () => {
      el.disabled = true;
      await el.updateComplete;
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      el.focus();
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(buttons[0]);
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(buttons[1]);
    });
    it('should move focus to next item when pressing ArrowRight', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      buttons[0].focus();
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(buttons[0]);
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(buttons[1]);
    });
    it('should move focus to previous item when pressing ArrowLeft', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      buttons[1].focus();
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(buttons[1]);
      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(buttons[0]);
    });
    it('should skip disabled items when navigating with ArrowRight', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      const disabledIndex = buttons.findIndex(btn => btn.hasAttribute('disabled'));
      buttons[disabledIndex - 1].focus();
      await el.updateComplete;
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      const focusedButton = closestElementComposed(document.activeElement, 'sl-button');
      expect(focusedButton).to.equal(buttons[disabledIndex + 1]);
    });
    it('should skip disabled items when navigating with ArrowLeft', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      const disabledIndex = buttons.findIndex(btn => btn.hasAttribute('disabled'));
      buttons[disabledIndex + 1].focus();
      await el.updateComplete;
      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;
      const focusedButton = closestElementComposed(document.activeElement, 'sl-button');
      expect(focusedButton).to.equal(buttons[disabledIndex - 1]);
    });
    it('should navigate through multiple items with multiple arrow key presses', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      buttons[0].focus();
      await el.updateComplete;
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      const focusedButton = closestElementComposed(document.activeElement, 'sl-button');
      expect(focusedButton).to.equal(buttons[3]);
    });
    it('should navigate backwards through multiple items', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      buttons[3].focus();
      await el.updateComplete;
      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;
      const focusedButton = closestElementComposed(document.activeElement, 'sl-button');
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
      await toolbar.updateComplete;
      await userEvent.keyboard('{ArrowRight}');
      await toolbar.updateComplete;
      await userEvent.keyboard('{ArrowRight}');
      await toolbar.updateComplete;
      const focusedAfterSecond = closestElementComposed(document.activeElement, 'sl-button');
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
      const firstVisibleButton = overflowToolbar.querySelector(
        'sl-button:not([style*="display: none"])'
      );
      firstVisibleButton?.focus();
      await overflowToolbar.updateComplete;
      const initialFocus = closestElementComposed(document.activeElement, 'sl-button');
      expect(initialFocus).to.equal(firstVisibleButton);
      await userEvent.keyboard('{ArrowRight}');
      await overflowToolbar.updateComplete;
      const focusedAfterRight = closestElementComposed(document.activeElement, 'sl-button');
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
      const menuButtonInternal = menuButton?.renderRoot.querySelector('sl-button');
      expect(menuButton).to.exist;
      expect(menuButtonInternal).to.exist;
      menuButtonInternal?.focus();
      await overflowToolbar.updateComplete;
      await userEvent.keyboard('{ArrowLeft}');
      await overflowToolbar.updateComplete;
      const focusedButton = closestElementComposed(document.activeElement, 'sl-button');
      expect(focusedButton).to.not.equal(menuButtonInternal);
    });
    it('should navigate continuously through all enabled items in order', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      const enabledButtons = buttons.filter(btn => !btn.hasAttribute('disabled'));
      buttons[0].focus();
      await el.updateComplete;
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(
        enabledButtons[1]
      );
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      expect(closestElementComposed(document.activeElement, 'sl-button')).to.equal(
        enabledButtons[2]
      );
    });
  });
});
//# sourceMappingURL=tool-bar.spec.js.map
