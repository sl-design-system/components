import '@sl-design-system/button/register.js';
import { type MenuButton } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import '../register.js';
import { syncDisabledState } from './disabled-state.js';
import { type ToolBar } from './tool-bar.js';

// Note: sl-button and sl-menu-button use ProxyAriaAttributesMixin which forwards
// aria-* attributes from the host to the shadow DOM target and removes them from
// the host. This means we cannot reliably check aria-disabled on hosts after any
// await (the proxy may have fired). All assertions on syncDisabledState's direct
// effects are done synchronously, and we focus on tracking attributes (data-toolbar-*)
// which are not affected by the proxy.

describe('syncDisabledState', () => {
  describe('with sl-tool-bar host', () => {
    let el: ToolBar;

    it('should preserve originally disabled buttons when toolbar is re-enabled', async () => {
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

      // Disable - assert synchronously before ProxyAriaAttributesMixin fires
      syncDisabledState(el, true);

      expect(buttons[0]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).to.have.attribute('data-toolbar-disabled-native', 'attribute');
      expect(buttons[1]).not.to.have.attribute('disabled');
      expect(buttons[2]).to.have.attribute('data-toolbar-disabled');

      // Re-enable - assert synchronously
      syncDisabledState(el, false);

      expect(buttons[0]).not.to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).to.have.attribute('disabled');
      expect(buttons[2]).not.to.have.attribute('data-toolbar-disabled');
    });

    it('should handle initially aria-disabled buttons with ProxyAriaAttributesMixin', async () => {
      // ProxyAriaAttributesMixin forwards aria-disabled from the sl-button host
      // to its shadow <button> and removes it from the host. syncDisabledState
      // therefore cannot detect the original aria-disabled state and treats the
      // button as "no disabled state" (data-toolbar-disabled marker).
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>Enabled Button</sl-button>
          <sl-button aria-disabled="true">Originally Aria Disabled</sl-button>
          <sl-button>Another Enabled</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));

      const buttons = Array.from(el.querySelectorAll('sl-button'));

      // After proxy forwarding, host no longer has aria-disabled
      expect(buttons[1]).not.to.have.attribute('aria-disabled');

      // Disable
      syncDisabledState(el, true);

      // All buttons get data-toolbar-disabled (not -original) because the
      // proxy already removed aria-disabled from the host
      expect(buttons[0]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[2]).to.have.attribute('data-toolbar-disabled');

      // Re-enable
      syncDisabledState(el, false);

      expect(buttons[0]).not.to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).not.to.have.attribute('data-toolbar-disabled');
      expect(buttons[2]).not.to.have.attribute('data-toolbar-disabled');
    });

    it('should handle initially aria-disabled menu-buttons', async () => {
      // sl-menu-button also uses ProxyAriaAttributesMixin, so aria-disabled
      // is forwarded to the internal sl-button and removed from the host
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-menu-button aria-disabled="true">
            <div slot="button">Originally Aria Disabled</div>
            <sl-menu-item>Item 1</sl-menu-item>
          </sl-menu-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));

      const menuButton = el.querySelector('sl-menu-button')!;

      // Host no longer has aria-disabled (proxy forwarded it)
      expect(menuButton).not.to.have.attribute('aria-disabled');

      syncDisabledState(el, true);

      // Gets data-toolbar-disabled (proxy removed aria-disabled from host)
      expect(menuButton).to.have.attribute('data-toolbar-disabled');

      syncDisabledState(el, false);

      expect(menuButton).not.to.have.attribute('data-toolbar-disabled');
    });

    it('should preserve originally property-disabled menu-buttons when toolbar is re-enabled', async () => {
      el = await fixture(html`
        <sl-tool-bar>
          <sl-menu-button>
            <div slot="button">Edit</div>
            <sl-menu-item>Rename...</sl-menu-item>
          </sl-menu-button>
        </sl-tool-bar>
      `);
      const menuButton = el.querySelector('sl-menu-button') as MenuButton;
      menuButton.disabled = true;
      await menuButton.updateComplete;
      await el.updateComplete;

      // Verify initial state - sl-menu-button has no [disabled] attribute but .disabled is true
      expect(menuButton).not.to.have.attribute('disabled');
      expect(menuButton.disabled).to.be.true;

      syncDisabledState(el, true);

      expect(menuButton).not.to.have.attribute('disabled');
      expect(menuButton.disabled).to.be.false;
      expect(menuButton).to.have.attribute('data-toolbar-disabled-native', 'property');

      syncDisabledState(el, false);

      // Restoration should restore .disabled = true but NOT add [disabled] attribute
      expect(menuButton).not.to.have.attribute('disabled');
      expect(menuButton.disabled).to.be.true;
    });

    it('should be idempotent when multiple updates occur while disabled', async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>Enabled</sl-button>
          <sl-button disabled>Disabled via attribute</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));

      const buttons = Array.from(el.querySelectorAll('sl-button'));

      syncDisabledState(el, true);

      expect(buttons[0]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).to.have.attribute('data-toolbar-disabled-native', 'attribute');

      // Call again while already disabled (idempotence check)
      syncDisabledState(el, true);
      syncDisabledState(el, true);

      // Verify tracking hasn't changed
      expect(buttons[0]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[0]).not.to.have.attribute('data-toolbar-disabled-original');
      expect(buttons[1]).to.have.attribute('data-toolbar-disabled-native', 'attribute');

      // Re-enable
      syncDisabledState(el, false);

      expect(buttons[0]).not.to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).to.have.attribute('disabled');
    });

    it('should be idempotent for originally disabled buttons', async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button disabled>Originally Disabled</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));
      const button = el.querySelector('sl-button')!;

      syncDisabledState(el, true);

      expect(button).not.to.have.attribute('disabled');
      expect(button).to.have.attribute('data-toolbar-disabled-native', 'attribute');
      expect(button).not.to.have.attribute('data-toolbar-disabled-original');

      // Re-run sync (idempotency check)
      syncDisabledState(el, true);

      expect(button).to.have.attribute('data-toolbar-disabled-native', 'attribute');
      expect(button).not.to.have.attribute('data-toolbar-disabled-original');

      // Re-enable
      syncDisabledState(el, false);

      expect(button).to.have.attribute('disabled');
    });

    it('should handle originally disabled sl-menu-button (property-based)', async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-menu-button .disabled=${true}>
            <div slot="button">Menu</div>
            <sl-menu-item>Item 1</sl-menu-item>
          </sl-menu-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));
      const menuButton = el.querySelector('sl-menu-button')!;

      // Verify it's actually disabled but HAS NO ATTRIBUTE (doesn't reflect)
      expect(menuButton.disabled).to.be.true;
      expect(menuButton).not.to.have.attribute('disabled');

      syncDisabledState(el, true);

      // It should be converted to aria-disabled
      expect(menuButton.disabled).to.be.false;
      expect(menuButton).to.have.attribute('data-toolbar-disabled-native', 'property');

      // Re-enable
      syncDisabledState(el, false);

      expect(menuButton.disabled).to.be.true;
    });
  });
});
