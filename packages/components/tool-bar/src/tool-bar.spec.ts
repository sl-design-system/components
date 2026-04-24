import { faBell, faGear, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { faBell as fasBell, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '@sl-design-system/button';
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
import { type ToolBarItem, type ToolBarItemButton, type ToolBarItemDivider, type ToolBarItemMenu } from './mapping.js';
import { type ToolBar } from './tool-bar.js';

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
      const emptyEl = await fixture<ToolBar>(html`<sl-tool-bar></sl-tool-bar>`);
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
      // ForwardAriaMixin forwards aria-disabled from host to shadow DOM,
      // so check tracking attributes instead which are not affected by the proxy
      expect(children.item(0)).to.have.attribute('data-toolbar-disabled');
      expect(children.item(3)).to.have.attribute('data-toolbar-disabled');
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

    it('should have a hidden menu button', () => {
      const menuButton = el.shadowRoot?.querySelector('sl-menu-button');

      expect(menuButton).to.exist;
      expect(menuButton).to.have.attribute('hidden');
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

    it('should focus aria-disabled buttons using arrow keys', async () => {
      el.disabled = true;
      await el.updateComplete;

      const buttons = Array.from(el.querySelectorAll('sl-button'));

      el.focus();
      await el.updateComplete;

      // First button should be focused (aria-disabled)
      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(buttons[0]);

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      // Second button should be focused (aria-disabled)
      expect(closestElementComposed(document.activeElement!, 'sl-button')).to.equal(buttons[1]);
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
});
