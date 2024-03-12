import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import '../register.js';
import { AccordionItem } from './accordion-item.js';

describe('sl-accordion-item', () => {
  let el: AccordionItem;

  describe('defaults', () => {
    let details: HTMLDetailsElement;
    let summary: HTMLElement;
    let wrapper: HTMLDivElement;

    beforeEach(async () => {
      el = await fixture(
        html` <sl-accordion-item summary="Accordion summary">Content of accordion</sl-accordion-item>`
      );

      details = el.renderRoot.querySelector('details') as HTMLDetailsElement;
      summary = el.renderRoot.querySelector('summary') as HTMLElement;
      wrapper = el.renderRoot.querySelector('.wrapper') as HTMLDivElement;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should have the correct attributes', () => {
      expect(summary).to.have.attribute('aria-controls', 'sl-accordion-item-content-5');
      expect(summary).to.have.attribute('aria-expanded', 'false');
      expect(summary).to.have.attribute('aria-disabled', 'false');
    });

    it('should not have single attribute by default', () => {
      expect(el).not.to.have.attribute('single');
    });

    it('should open on click', async () => {
      summary.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).to.have.attribute('open');
      expect(summary).to.have.attribute('aria-expanded', 'true');
    });

    it('should open on Enter', async () => {
      summary.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).to.have.attribute('open');
      expect(summary).to.have.attribute('aria-expanded', 'true');
    });

    it('should open on Space', async () => {
      summary.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).to.have.attribute('open');
      expect(summary).to.have.attribute('aria-expanded', 'true');
    });

    it('should toggle the closing class during closing', async () => {
      summary.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).to.have.attribute('open');

      summary.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(wrapper).to.have.class('closing');

      wrapper.dispatchEvent(new Event('animationend'));

      expect(wrapper).not.to.have.class('closing');
    });
  });

  describe('disabled', () => {
    let details: HTMLDetailsElement;
    let summary: HTMLElement;

    beforeEach(async () => {
      el = await fixture(
        html`<sl-accordion-item summary="Accordion summary of disabled item" disabled
          >Content of disabled accordion item</sl-accordion-item
        >`
      );

      details = el.renderRoot.querySelector('details') as HTMLDetailsElement;
      summary = el.renderRoot.querySelector('summary') as HTMLElement;
    });

    it('should be disabled', () => {
      expect(el.disabled).to.be.true;
    });

    it('should have a tabindex of -1', () => {
      expect(summary).to.have.attribute('tabindex', '-1');
    });

    it('should have the correct attributes', () => {
      expect(details).not.to.have.attribute('open');
      expect(summary).to.have.attribute('aria-controls', 'sl-accordion-item-content-21');
      expect(summary).to.have.attribute('aria-expanded', 'false');
      expect(summary).to.have.attribute('aria-disabled', 'true');
    });

    it('should ignore clicks', async () => {
      summary.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).not.to.have.attribute('open');
      expect(summary).not.to.have.attribute('aria-expanded', 'true');
    });

    it('should ignore Enter', async () => {
      summary.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).not.to.have.attribute('open');
      expect(summary).not.to.have.attribute('aria-expanded', 'true');
    });

    it('should ignore Space', async () => {
      summary.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).not.to.have.attribute('open');
      expect(summary).not.to.have.attribute('aria-expanded', 'true');
    });
  });
});
