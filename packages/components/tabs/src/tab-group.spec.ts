import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { TabGroup, type TabsAlignment } from './tab-group.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-tab-group', () => {
  let el: TabGroup;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tab-group>
          <sl-tab>Tab 1</sl-tab>
          <sl-tab>Tab 2</sl-tab>
          <sl-tab disabled>Tab 3</sl-tab>
          <sl-tab-panel>Panel 1</sl-tab-panel>
          <sl-tab-panel>Panel 2</sl-tab-panel>
          <sl-tab-panel>Panel 3</sl-tab-panel>
        </sl-tab-group>
      `);

      // We need to wait for the RovingTabindexController to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have a horizontal layout', () => {
      expect(el).not.to.have.attribute('vertical');
      expect(el.vertical).not.to.be.true;
    });

    it('should have a vertical layout when set', async () => {
      el.vertical = true;
      await el.updateComplete;

      expect(el).to.have.attribute('vertical');
    });

    it('should align tabs to start', () => {
      expect(el).not.to.have.attribute('align-tabs');
      expect(el.alignTabs).to.be.undefined;
    });

    ['start', 'center', 'end', 'stretch'].forEach(align => {
      it(`should support ${align} alignment of tabs`, async () => {
        el.alignTabs = align as TabsAlignment;
        await el.updateComplete;

        expect(el).to.have.attribute('align-tabs', align);
        expect(el.renderRoot.querySelector('.fade-container')).to.have.style(
          'justify-content',
          align === 'start' ? 'normal' : align
        );
      });
    });

    it('should link the tabs to the panels', () => {
      const tabs = el.querySelectorAll('sl-tab'),
        panels = el.querySelectorAll('sl-tab-panel');

      tabs.forEach((tab, i) => {
        expect(tab).to.have.attribute('id');
        expect(tab).to.have.attribute('aria-controls', panels[i].id);
        expect(panels[i]).to.have.attribute('id');
        expect(panels[i]).to.have.attribute('aria-labelledby', tab.id);
      });
    });

    it('should have a tablist with role tablist', () => {
      const tablist = el.renderRoot.querySelector('[part="tablist"]');

      expect(tablist).to.exist;
      expect(tablist).to.have.attribute('role', 'tablist');
    });

    it('should not have a menu button', async () => {
      await el.updateComplete;
      const menuButton = el.renderRoot.querySelector('sl-menu-button');

      expect(menuButton).not.to.exist;
    });

    it('should not have a selected tab', () => {
      const tabs = el.querySelectorAll('sl-tab[selected]'),
        panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

      expect(tabs).to.have.lengthOf(0);
      expect(panels).to.have.lengthOf(0);
    });

    it('should select the second tab when clicked', () => {
      el.querySelector<HTMLElement>('sl-tab:nth-of-type(2)')?.click();

      const tabs = el.querySelectorAll('sl-tab[selected]'),
        panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

      expect(tabs).to.have.lengthOf(1);
      expect(tabs[0]).to.have.text('Tab 2');
      expect(panels).to.have.lengthOf(1);
      expect(panels[0]).to.have.text('Panel 2');
    });

    it('should emit an sl-tab-change event when the tab changes', () => {
      const onTabChange = spy();

      let selectedTabIndex = -1;
      el.addEventListener('sl-tab-change', event => {
        onTabChange();

        selectedTabIndex = event.detail;
      });

      el.querySelector<HTMLElement>('sl-tab:nth-of-type(2)')?.click();

      expect(onTabChange).to.have.been.calledOnce;
      expect(selectedTabIndex).to.equal(1);
    });

    it('should support keyboard navigation using the arrow keys', async () => {
      const tabs = el.querySelectorAll('sl-tab');

      tabs[0].focus();

      expect(document.activeElement).to.equal(tabs[0]);

      await sendKeys({ press: 'ArrowRight' });
      await el.updateComplete;

      expect(document.activeElement).to.equal(tabs[1]);

      // Third tab is disabled, so it should be skipped
      await sendKeys({ press: 'ArrowRight' });
      await el.updateComplete;

      expect(document.activeElement).to.equal(tabs[0]);

      // Third tab is disabled, so it should be skipped
      await sendKeys({ press: 'ArrowLeft' });
      await el.updateComplete;

      expect(document.activeElement).to.equal(tabs[1]);
    });

    it('should select a different tab when pressing the Enter key', async () => {
      const first = el.querySelector<HTMLElement>('sl-tab:first-of-type');

      first?.focus();

      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      const selectedTab = el.querySelector('sl-tab[selected]') as HTMLElement,
        selectedPanel = el.querySelector('sl-tab-panel[aria-hidden="false"]') as HTMLElement;

      expect(selectedTab).to.have.text('Tab 2');
      expect(selectedPanel).to.have.text('Panel 2');
    });

    it('should select a different tab when pressing the Space key', async () => {
      const first = el.querySelector<HTMLElement>('sl-tab:first-of-type');

      first?.focus();

      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'Space' });

      const selectedTab = el.querySelector('sl-tab[selected]') as HTMLElement,
        selectedPanel = el.querySelector('sl-tab-panel[aria-hidden="false"]') as HTMLElement;

      expect(selectedTab).to.have.text('Tab 2');
      expect(selectedPanel).to.have.text('Panel 2');
    });
  });

  describe('selected', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tab-group>
          <sl-tab>Tab 1</sl-tab>
          <sl-tab selected>Tab 2</sl-tab>
          <sl-tab>Tab 3</sl-tab>
          <sl-tab-panel>Panel 1</sl-tab-panel>
          <sl-tab-panel>Panel 2</sl-tab-panel>
          <sl-tab-panel>Panel 3</sl-tab-panel>
        </sl-tab-group>
      `);
    });

    it('should select the second tab by default', () => {
      expect(el.querySelector('sl-tab[selected]')).to.have.text('Tab 2');
      expect(el.querySelector('sl-tab-panel[aria-hidden="false"]')).to.have.text('Panel 2');
    });
  });

  describe('only tabs', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tab-group>
          <sl-tab>Tab 1</sl-tab>
          <sl-tab>Tab 2</sl-tab>
        </sl-tab-group>
      `);
    });

    it('should not have put aria-controls attributes on the tabs', () => {
      const noControls = Array.from(el.querySelectorAll('sl-tab')).every(tab => !tab.hasAttribute('aria-controls'));

      expect(noControls).to.be.true;
    });
  });

  describe('horizontal overflow', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tab-group style="width: 50px">
          <sl-tab>Tab 1</sl-tab>
          <sl-tab>Tab 2</sl-tab>
          <sl-tab disabled>Tab 3</sl-tab>
          <sl-tab-panel>Panel 1</sl-tab-panel>
          <sl-tab-panel>Panel 2</sl-tab-panel>
          <sl-tab-panel>Panel 3</sl-tab-panel>
        </sl-tab-group>
      `);

      // We need to wait for the RovingTabindexController to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have a menu button', () => {
      const menuButton = el.renderRoot.querySelector('sl-menu-button');

      expect(menuButton).to.exist;
    });

    it('should have menu items for all the tabs', () => {
      const menuItems = Array.from(el.renderRoot.querySelectorAll('sl-menu-item')).map(menuItem =>
        menuItem.textContent?.trim()
      );

      expect(menuItems).to.eql(['Tab 1', 'Tab 2', 'Tab 3']);
    });

    it('should disable the menu items for disabled tabs', () => {
      const menuItems = Array.from(el.renderRoot.querySelectorAll('sl-menu-item')).map(menuItem => menuItem.disabled);

      expect(menuItems).to.eql([false, false, true]);
    });

    it('should select the tab when clicking a menu item', () => {
      el.renderRoot.querySelector<HTMLElement>('sl-menu-item:nth-of-type(2)')?.click();

      const selectedTab = el.querySelector('sl-tab[selected]') as HTMLElement,
        selectedPanel = el.querySelector('sl-tab-panel[aria-hidden="false"]') as HTMLElement;

      expect(selectedTab).to.have.text('Tab 2');
      expect(selectedPanel).to.have.text('Panel 2');
    });
  });

  describe('vertical overflow', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tab-group style="height: 50px" vertical>
          <sl-tab>Tab 1</sl-tab>
          <sl-tab>Tab 2</sl-tab>
          <sl-tab disabled>Tab 3</sl-tab>
          <sl-tab-panel>Panel 1</sl-tab-panel>
          <sl-tab-panel>Panel 2</sl-tab-panel>
          <sl-tab-panel>Panel 3</sl-tab-panel>
        </sl-tab-group>
      `);

      // We need to wait for the RovingTabindexController to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have a menu button', async () => {
      await el.updateComplete;
      const menuButton = el.renderRoot.querySelector('sl-menu-button');

      expect(menuButton).to.exist;
    });
  });
});
