import { expect, fixture } from '@open-wc/testing';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import { html } from 'lit';
import './register.js';
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
});
