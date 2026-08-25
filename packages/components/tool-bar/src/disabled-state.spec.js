import '@sl-design-system/button/register.js';
import '@sl-design-system/menu/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import '../register.js';
import { syncDisabledState } from './disabled-state.js';
describe('syncDisabledState', () => {
  describe('with sl-tool-bar host', () => {
    let el;
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
      expect(buttons[0]).not.to.have.attribute('disabled');
      expect(buttons[1]).to.have.attribute('disabled');
      expect(buttons[2]).not.to.have.attribute('disabled');
      syncDisabledState(el, true);
      expect(buttons[0]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).to.have.attribute('data-toolbar-disabled-native', 'attribute');
      expect(buttons[1]).not.to.have.attribute('disabled');
      expect(buttons[2]).to.have.attribute('data-toolbar-disabled');
      syncDisabledState(el, false);
      expect(buttons[0]).not.to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).to.have.attribute('disabled');
      expect(buttons[2]).not.to.have.attribute('data-toolbar-disabled');
    });
    it('should handle initially aria-disabled buttons with ForwardAriaMixin', async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-button>Enabled Button</sl-button>
          <sl-button aria-disabled="true">Originally Aria Disabled</sl-button>
          <sl-button>Another Enabled</sl-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));
      const buttons = Array.from(el.querySelectorAll('sl-button'));
      expect(buttons[1]).not.to.have.attribute('aria-disabled');
      syncDisabledState(el, true);
      expect(buttons[0]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[2]).to.have.attribute('data-toolbar-disabled');
      syncDisabledState(el, false);
      expect(buttons[0]).not.to.have.attribute('data-toolbar-disabled');
      expect(buttons[1]).not.to.have.attribute('data-toolbar-disabled');
      expect(buttons[2]).not.to.have.attribute('data-toolbar-disabled');
    });
    it('should handle initially aria-disabled menu-buttons', async () => {
      el = await fixture(html`
        <sl-tool-bar style="inline-size: 400px">
          <sl-menu-button aria-disabled="true">
            <div slot="button">Originally Aria Disabled</div>
            <sl-menu-item>Item 1</sl-menu-item>
          </sl-menu-button>
        </sl-tool-bar>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));
      const menuButton = el.querySelector('sl-menu-button');
      expect(menuButton).not.to.have.attribute('aria-disabled');
      syncDisabledState(el, true);
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
      const menuButton = el.querySelector('sl-menu-button');
      menuButton.disabled = true;
      await menuButton.updateComplete;
      await el.updateComplete;
      expect(menuButton).not.to.have.attribute('disabled');
      expect(menuButton.disabled).to.be.true;
      syncDisabledState(el, true);
      expect(menuButton).not.to.have.attribute('disabled');
      expect(menuButton.disabled).to.be.false;
      expect(menuButton).to.have.attribute('data-toolbar-disabled-native', 'property');
      syncDisabledState(el, false);
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
      syncDisabledState(el, true);
      syncDisabledState(el, true);
      expect(buttons[0]).to.have.attribute('data-toolbar-disabled');
      expect(buttons[0]).not.to.have.attribute('data-toolbar-disabled-original');
      expect(buttons[1]).to.have.attribute('data-toolbar-disabled-native', 'attribute');
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
      const button = el.querySelector('sl-button');
      syncDisabledState(el, true);
      expect(button).not.to.have.attribute('disabled');
      expect(button).to.have.attribute('data-toolbar-disabled-native', 'attribute');
      expect(button).not.to.have.attribute('data-toolbar-disabled-original');
      syncDisabledState(el, true);
      expect(button).to.have.attribute('data-toolbar-disabled-native', 'attribute');
      expect(button).not.to.have.attribute('data-toolbar-disabled-original');
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
      const menuButton = el.querySelector('sl-menu-button');
      expect(menuButton.disabled).to.be.true;
      expect(menuButton).not.to.have.attribute('disabled');
      syncDisabledState(el, true);
      expect(menuButton.disabled).to.be.false;
      expect(menuButton).to.have.attribute('data-toolbar-disabled-native', 'property');
      syncDisabledState(el, false);
      expect(menuButton.disabled).to.be.true;
    });
  });
});
//# sourceMappingURL=disabled-state.spec.js.map
