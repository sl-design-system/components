import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import '../register.js';
import { TabGroup } from './tab-group.js';

describe('sl-tab-group', () => {
  let el: TabGroup;

  describe('empty', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tab-group></sl-tab-group>`);
    });

    it('should not break', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have horizontal layout by default', () => {
      expect(el).not.to.have.attribute('vertical');
    });

    it('should have start alignment by default', () => {
      expect(el).to.have.attribute('alignment','start');
    });
  });

  describe('multiple panels', () => {
    describe('no selected, no disabled',()=>{
      beforeEach(async () => {
        el = await fixture(html`<sl-tab-group>
          <sl-tab>Tab 1</sl-tab>
          <sl-tab>Tab 2</sl-tab>
          <sl-tab>Tab 3</sl-tab>
          <sl-tab-panel>Panel 1</sl-tab-panel>
          <sl-tab-panel>Panel 2</sl-tab-panel>
          <sl-tab-panel>Panel 3</sl-tab-panel>
        </sl-tab-group>`);
      });

      it('should render correctly', () => {
        expect(el).shadowDom.to.equalSnapshot();
      });

      it('should select the first tab by default', () => {
        const tabs = el.querySelectorAll('sl-tab[selected]'),
              panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 1');
        expect(tabs[0]).to.have.attribute('aria-controls','sl-tab-group-4-panel-1');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 1');
        expect(panels[0]).to.have.attribute('aria-labelledby','sl-tab-group-4-tab-1');
      });

      it('should handle the selecting of tabs by keyboard correctly', async () => {
        (el.querySelector('sl-tab:nth-of-type(2)') as HTMLElement)?.focus();
        await sendKeys({ press: 'Space' });

        let tabs = el.querySelectorAll('sl-tab[selected]'),
            panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 2');

        (el.querySelector('sl-tab:nth-of-type(3)') as HTMLElement)?.focus();
        await sendKeys({ press: 'Enter' });

        tabs = el.querySelectorAll('sl-tab[selected]');
        panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 3');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 3');

        (el.querySelector('sl-tab:nth-of-type(1)') as HTMLElement)?.focus();
        await sendKeys({ press: 'r' });

        tabs = el.querySelectorAll('sl-tab[selected]');
        panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');
        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 3');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 3');
      });

      it('should select the right tab on click', async () => {

        (el.querySelector('sl-tab:nth-of-type(2)') as HTMLElement).click();
        await el.updateComplete;

        const tabs = el.querySelectorAll('sl-tab[selected]'),
              panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 2');
      });
    });

    describe('no selected, first disabled',()=>{
      beforeEach(async () => {
        el = await fixture(html`<sl-tab-group>
          <sl-tab disabled>Tab 1</sl-tab>
          <sl-tab>Tab 2</sl-tab>
          <sl-tab>Tab 3</sl-tab>
          <sl-tab-panel>Panel 1</sl-tab-panel>
          <sl-tab-panel>Panel 2</sl-tab-panel>
          <sl-tab-panel>Panel 3</sl-tab-panel>
        </sl-tab-group>`);
      });

      it('should render correctly', () => {
        expect(el).shadowDom.to.equalSnapshot();
      });

      it('should select the first tab by default', () => {
        const tabs = el.querySelectorAll('sl-tab[selected]'),
              panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 2');
      });
    });
    describe('second selected, last disabled',()=>{
      beforeEach(async () => {
        el = await fixture(html`<sl-tab-group>
          <sl-tab >Tab 1</sl-tab>
          <sl-tab selected>Tab 2</sl-tab>
          <sl-tab disabled>Tab 3</sl-tab>
          <sl-tab-panel>Panel 1</sl-tab-panel>
          <sl-tab-panel>Panel 2</sl-tab-panel>
          <sl-tab-panel>Panel 3</sl-tab-panel>
        </sl-tab-group>`);
      });

      it('should render correctly', () => {
        expect(el).shadowDom.to.equalSnapshot();
      });

      it('should select the first tab by default', () => {
        const tabs = el.querySelectorAll('sl-tab[selected]'),
              panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 2');
      });
    });
  });

  describe('single panel', () => {
    describe('no selected, no disabled',()=>{
      beforeEach(async () => {
        el = await fixture(html`<sl-tab-group>
          <sl-tab>Tab 1</sl-tab>
          <sl-tab>Tab 2</sl-tab>
          <sl-tab>Tab 3</sl-tab>
          <sl-tab-panel>Panel 1</sl-tab-panel>
        </sl-tab-group>`);
      });

      it('should render correctly', () => {
        expect(el).shadowDom.to.equalSnapshot();
      });

      it('should select the first tab by default', () => {
        const tabs = el.querySelectorAll('sl-tab[selected]'),
              panels = el.querySelectorAll('sl-tab-panel');

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 1');
        expect(tabs[0]).to.have.attribute('aria-controls','sl-tab-group-12-panel-1');

        expect(panels.length).to.equal(1);
        expect(panels[0]).to.have.attribute('aria-labelledby','sl-tab-group-12-tab-1');
      });

      it('should select the right tab on click', async () => {
        (el.querySelector('sl-tab:nth-of-type(2)') as HTMLElement).click();
        await el.updateComplete;

        const tabs = el.querySelectorAll('sl-tab[selected]'),
              panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0]).to.have.attribute('aria-labelledby','sl-tab-group-13-tab-2');
      });
    });
  });

  describe('with dropdown menu', () => {
    let element: TabGroup;
    let container: HTMLElement;

    const showListbox = async () => {
      await element.updateComplete;
      return new Promise(resolve => setTimeout(resolve, 700));
    }

    describe('with more button in a small container',() => {
      beforeEach(async () => {
        element = await fixture(html`
            <sl-tab-group style="width: 70px">
              <sl-tab>Tab 1</sl-tab>
              <sl-tab>Tab 2</sl-tab>
              <sl-tab>Tab 3</sl-tab>
              <sl-tab-panel>Panel 1</sl-tab-panel>
              <sl-tab-panel>Panel 2</sl-tab-panel>
              <sl-tab-panel>Panel 3</sl-tab-panel>
            </sl-tab-group>
        `);
        container = element.shadowRoot?.querySelector('.container') as HTMLElement;
      });

      it('should render correctly', () => {
        expect(element).shadowDom.to.equalSnapshot();
      });

      it('should not show the listbox by default', async () => {
        const popover = element.shadowRoot?.querySelector('[popover]') as HTMLElement;

        expect(popover.getBoundingClientRect().width).to.equal(0);
        expect(popover.getBoundingClientRect().height).to.equal(0);
      });

      it('should show the more button', async () => {
        await showListbox();
        await element.updateComplete;
        const slBtn = container.querySelector('sl-button');

        expect(slBtn).to.exist;
      });

      it('should show the listbox on click on the more button', async () => {
        await showListbox();
        await element.updateComplete;
        const slBtn = container.querySelector('sl-button'),
              clickEvent = new Event('click');

        slBtn?.dispatchEvent(clickEvent);

        const popover = element.shadowRoot?.querySelector('[popover]') as HTMLElement;

        expect(popover.getBoundingClientRect().width).not.to.equal(0);
        expect(popover.getBoundingClientRect().height).not.to.equal(0);
      });

      it('should handle the selecting of tabs by keyboard in the listbox correctly', async () => {
        await showListbox();
        await element.updateComplete;
        const slBtn = container.querySelector('sl-button'),
          clickEvent = new Event('click');

        slBtn?.dispatchEvent(clickEvent);

        await new Promise(resolve => setTimeout(resolve, 800));

        const popover = element.shadowRoot?.querySelector('[popover]') as HTMLElement;

        (popover.querySelector('sl-tab:nth-of-type(2)') as HTMLElement)?.focus();

        await sendKeys({ press: 'ArrowRight' });
        await element.updateComplete;

        await sendKeys({ press: 'Enter' });
        await element.updateComplete;

        let tabs = element.querySelectorAll('sl-tab[selected]'),
            panels = element.querySelectorAll('sl-tab-panel[aria-hidden="false"]');

        await element.updateComplete;

        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 2');
      });
    });
  });
});
