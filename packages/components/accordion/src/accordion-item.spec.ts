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

    beforeEach(async () => {
      el = await fixture(
        html` <sl-accordion-item summary="Accordion summary">Content of accordion</sl-accordion-item>`
      );

      details = el.renderRoot.querySelector('details') as HTMLDetailsElement;
      summary = el.renderRoot.querySelector('summary') as HTMLElement;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should have the correct attributes', () => {
      expect(summary).to.have.attribute('aria-controls', 'content');
      expect(summary).to.have.attribute('aria-expanded', 'false');
    });

    it('should open on click', async () => {
      summary.click();

      await new Promise(resolve => setTimeout(resolve));

      expect(details).to.have.attribute('open');
      expect(summary).to.have.attribute('aria-expanded', 'true');
    });

    it('should open on Enter', async () => {
      summary.focus();
      await sendKeys({ press: 'Enter' });

      await el.updateComplete;

      expect(details).to.have.attribute('open');
      expect(summary).to.have.attribute('aria-expanded', 'true');
    });

    it('should open on Space', async () => {
      summary.focus();
      await sendKeys({ press: 'Space' });

      await el.updateComplete;

      expect(details).to.have.attribute('open');
      expect(summary).to.have.attribute('aria-expanded', 'true');
    });

    it('should animate opening and closing the details on click', async () => {
      summary.click();

      // Open attribute is immediately set
      expect(details).to.have.attribute('open');

      // Wait for the next frame
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(details).to.have.class('opening');

      // Trigger the animationend event
      details.dispatchEvent(new Event('animationend'));

      expect(details).not.to.have.class('opening');

      // Wait for the toggle event to be emitted
      await new Promise(resolve => setTimeout(resolve));

      expect(el.open).to.be.true;

      summary.click();

      // Wait for the next frame
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(details).to.have.class('closing');

      // Trigger the animationend event
      details.dispatchEvent(new Event('animationend'));

      expect(details).not.to.have.attribute('open');
      expect(details).not.to.have.class('closing');

      // Wait for the toggle event to be emitted
      await new Promise(resolve => setTimeout(resolve));

      expect(el.open).to.be.false;
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
      expect(summary).to.have.attribute('aria-controls', 'content');
      expect(summary).to.have.attribute('aria-expanded', 'false');
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
      await sendKeys({ press: 'Space' });
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).not.to.have.attribute('open');
      expect(summary).not.to.have.attribute('aria-expanded', 'true');
    });
  });
});
