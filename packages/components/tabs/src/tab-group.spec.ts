import {expect, fixture, waitUntil} from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import '../register.js';
import { TabGroup } from './tab-group.js';
import {stub} from "sinon";

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
      expect(el.getAttribute('vertical')).to.equal('false');
    });

    it('should have left alignment by default', () => {
      expect(el.getAttribute('alignment')).to.equal('left');
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
        const tabs = el.querySelectorAll('sl-tab[selected]');
        const panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');
        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 1');
        expect(tabs[0].getAttribute('aria-controls')).to.equal('sl-tab-group-2-panel-1');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 1');
        expect(panels[0].getAttribute('aria-labelledby')).to.equal('sl-tab-group-2-tab-1');
      });

      it('should handle the selecting of tabs by keyboard correctly', async () => {
        (el.querySelector('sl-tab:nth-of-type(2)') as HTMLElement)?.focus();
        await sendKeys({ press: 'Space' });

        let tabs = el.querySelectorAll('sl-tab[selected]');
        let panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');
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

        const tabs = el.querySelectorAll('sl-tab[selected]');
        const panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');
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
        const tabs = el.querySelectorAll('sl-tab[selected]')
        const panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]')
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
        const tabs = el.querySelectorAll('sl-tab[selected]')
        const panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]')
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
        const tabs = el.querySelectorAll('sl-tab[selected]');
        const panels = el.querySelectorAll('sl-tab-panel');
        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 1');
        expect(tabs[0].getAttribute('aria-controls')).to.equal('sl-tab-group-10-panel-1');

        expect(panels.length).to.equal(1);
        expect(panels[0].getAttribute('aria-labelledby')).to.equal('sl-tab-group-10-tab-1');
      });

      it('should select the right tab on click', async () => {

        (el.querySelector('sl-tab:nth-of-type(2)') as HTMLElement).click();
        await el.updateComplete;

        const tabs = el.querySelectorAll('sl-tab[selected]');
        const panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');
        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0].getAttribute('aria-labelledby')).to.equal('sl-tab-group-11-tab-2');
      });
    });
  });

  describe('with dropdown menu', () => {
    let tabGroup: TabGroup;

    describe('with more button in a small container',() => {
      beforeEach(async () => {
        el = await fixture(html`
          <div style="width: 70px">
            <sl-tab-group>
              <sl-tab selected>Tab 1</sl-tab>
              <sl-tab>Tab 2</sl-tab>
              <sl-tab>Tab 3</sl-tab>
              <sl-tab-panel>Panel 1</sl-tab-panel>
              <sl-tab-panel>Panel 2</sl-tab-panel>
              <sl-tab-panel>Panel 3</sl-tab-panel>
            </sl-tab-group>
          </div>`);
        tabGroup = el.querySelector('sl-tab-group') as TabGroup;
      }); // style="width: 50px"

      // it('should render correctly', () => {
      //   expect(el).shadowDom.to.equalSnapshot();
      // });

      it('should not show the listbox by default', async () => {
        const popover = tabGroup.shadowRoot?.querySelector('[popover]') as HTMLElement;

        console.log('popover', popover, popover.style.display);
        console.log('popover--styyyle', popover.style);

        await new Promise(resolve => setTimeout(resolve, 800));

        console.log('popover', popover, popover.style.display);
        console.log('popover--styyyle', popover.style);
        console.log('popover-getB--styyyle', popover.getBoundingClientRect());
        console.log('el--styyyle', el.style);
        console.log('document.documentElement.style', document.documentElement.style, document.documentElement);

        // expect(popover.style.display).to.equal('none');

        // expect(el).shadowDom.to.equalSnapshot();
        await expect(popover.getBoundingClientRect().width).to.equal(0);
        await expect(popover.getBoundingClientRect().height).to.equal(0);
      });

      // TODO: click on button, vertical resize, keyboard nav

      it('should show the more button', async () => {
        const container = tabGroup.shadowRoot?.querySelector('.container') as HTMLElement;

        await new Promise(resolve => setTimeout(resolve, 800));

        const slBtn = container.querySelector('sl-button');

        expect(slBtn).to.exist;
      });

      it('should show the listbox on click on the more button', async () => {
        const container = tabGroup.shadowRoot?.querySelector('.container') as HTMLElement;

        await new Promise(resolve => setTimeout(resolve, 800));

        const slBtn = container.querySelector('sl-button');

        const clickEvent = new Event('click');
        slBtn?.dispatchEvent(clickEvent);

        const popover = tabGroup.shadowRoot?.querySelector('[popover]') as HTMLElement;

        await expect(popover.getBoundingClientRect().width).not.to.equal(0);
        await expect(popover.getBoundingClientRect().height).not.to.equal(0);
      });

      it('should handle the selecting of tabs by keyboard in the listbox correctly', async () => {

        const container = tabGroup.shadowRoot?.querySelector('.container') as HTMLElement;

        await new Promise(resolve => setTimeout(resolve, 800));

        const slBtn = container.querySelector('sl-button');

        const clickEvent = new Event('click');
        slBtn?.dispatchEvent(clickEvent);

        const popover = tabGroup.shadowRoot?.querySelector('[popover]') as HTMLElement;

        console.log('popover.getBoundingClientRect()', popover.getBoundingClientRect(), popover.querySelector('sl-tab:nth-of-type(2)') as HTMLElement);
        (popover.querySelector('sl-tab:nth-of-type(2)') as HTMLElement)?.focus();
        await sendKeys({ press: 'Space' });

        console.log('nthOfType', (popover.querySelector('sl-tab:nth-of-type(2)') as HTMLElement));

        await new Promise(resolve => setTimeout(resolve, 800));

        let tabs = el.querySelectorAll('sl-tab[selected]');
        let listboxTabs = popover.querySelectorAll('sl-tab[selected]');
        let panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');
        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(listboxTabs.length).to.equal(1);
        expect(listboxTabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 2');

        (popover.querySelector('sl-tab:nth-of-type(3)') as HTMLElement)?.focus();
        await sendKeys({ press: 'Enter' });

        tabs = el.querySelectorAll('sl-tab[selected]');
        listboxTabs = popover.querySelectorAll('sl-tab[selected]');
        panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');
        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 3');
        expect(listboxTabs.length).to.equal(1);
        expect(listboxTabs[0].innerHTML).to.equal('Tab 3');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 3');

        (popover.querySelector('sl-tab:nth-of-type(1)') as HTMLElement)?.focus();
        await sendKeys({ press: 'r' });

        tabs = el.querySelectorAll('sl-tab[selected]');
        listboxTabs = popover.querySelectorAll('sl-tab[selected]');
        panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]');
        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 3');
        expect(listboxTabs.length).to.equal(1);
        expect(listboxTabs[0].innerHTML).to.equal('Tab 3');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 3');
      });
    });

    // TODO: keyboard nav inside listbox, vertical version

    describe('with more button on resize',() => {
      beforeEach(async () => {
        el = await fixture(html`
            <sl-tab-group>
              <sl-tab selected>Tab 1</sl-tab>
              <sl-tab>Tab 2</sl-tab>
              <sl-tab>Tab 3</sl-tab>
              <sl-tab-panel>Panel 1</sl-tab-panel>
              <sl-tab-panel>Panel 2</sl-tab-panel>
              <sl-tab-panel>Panel 3</sl-tab-panel>
            </sl-tab-group>`);
      }); // style="width: 50px"

      it('should render correctly', () => {
        expect(el).shadowDom.to.equalSnapshot();
      });

      it('should show the more button on resize', async () => {
        await el.updateComplete;

        let totalTabsWidth = 0;
        let totalTabsHeight = 0;
        tabGroup.querySelectorAll('sl-tab').forEach(tab => {
          totalTabsWidth = totalTabsWidth + tab.offsetWidth;
          totalTabsHeight = totalTabsHeight + tab.offsetHeight;
        });


        // const tabGroup = el.querySelector('sl-tab-group');
        const moreButton = tabGroup.shadowRoot?.querySelector('sl-button');
        const moreButton2 = tabGroup.renderRoot?.querySelector('sl-button');
        const container = tabGroup.shadowRoot?.querySelector('.container') as HTMLElement;
        const container2 = tabGroup.renderRoot?.querySelector('.container');



        console.log('container - 1a', container, container2, tabGroup.scrollWidth, tabGroup.clientWidth, totalTabsWidth, totalTabsHeight);
        console.log('taaaaab - 1a', tabGroup.shadowRoot, window.innerWidth);
        console.log('eeeel - 1a', el, tabGroup, tabGroup.shadowRoot, moreButton, moreButton2, el.offsetWidth, tabGroup.offsetWidth, window.innerWidth, container.offsetWidth);

        // await tabGroup.firstUpdated();

        // const testWidth = 50;

        // await waitUntil(() => {
        //   window.innerWidth = testWidth;
        //   window.dispatchEvent(new Event('resize'));
        // });

        // setTimeout(() => {
        // window.innerWidth = testWidth;
                  window.dispatchEvent(new Event('resize'));
                  window.resizeTo(50, 100);
        // }, 1000);
        // window.innerWidth = testWidth;
        // window.dispatchEvent(new Event('resize'));

        await el.updateComplete;
        //
        // await tabGroup.updateComplete;
        //
        // await tabGroup.firstUpdated();

        // const windowResizeStub = stub(window, 'dispatchEvent');
        //
        // // Resize the window using the mock event
        // const resizeEvent = new Event('resize');
        // resizeEvent.detail = {
        //   width: 400,
        //   height: 300,
        // };
        //
        // windowResizeStub.resolves(resizeEvent);
        //
        // // Trigger the mock resize event
        // windowResizeStub.callThrough();

        // let slBtn;
        //
        // setTimeout(() => {
        //   slBtn = container.querySelector('sl-button');
        //   console.log('slBtn - in setTimeout', slBtn);
        // }, 700);

        // await tabGroup.updateComplete;
        //
        await el.firstUpdated();

        await new Promise(resolve => setTimeout(resolve, 800));

        const slBtn = container.querySelector('sl-button');

        // const clickEvent = new Event('click');
        // slBtn?.dispatchEvent(clickEvent);
        //
        // await new Promise(resolve => setTimeout(resolve, 800));
        //
        // const popover = tabGroup.shadowRoot?.querySelector('[popover]') as HTMLElement;
        //
        // console.log('popover-getB2--styyyle', popover.getBoundingClientRect());

        console.log('slBtn - 2a', slBtn);
        console.log('container - 2', container, container2, tabGroup.scrollWidth, tabGroup.clientWidth, totalTabsWidth, totalTabsHeight);
        console.log('taaaaab - 2', tabGroup.shadowRoot, window.innerWidth);
        console.log('eeeel - 2a', el, tabGroup, tabGroup.shadowRoot, moreButton, moreButton2, el.offsetWidth, tabGroup.offsetWidth, window.innerWidth, container.offsetWidth);
        // expect(el).shadowDom.to.equalSnapshot();
        expect(slBtn).to.exist;
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
        const tabs = el.querySelectorAll('sl-tab[selected]')
        const panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]')
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
        const tabs = el.querySelectorAll('sl-tab[selected]')
        const panels = el.querySelectorAll('sl-tab-panel[aria-hidden="false"]')
        expect(tabs.length).to.equal(1);
        expect(tabs[0].innerHTML).to.equal('Tab 2');
        expect(panels.length).to.equal(1);
        expect(panels[0].innerHTML).to.equal('Panel 2');
      });
    });
  });

  // TODO: listbox version as well
});
