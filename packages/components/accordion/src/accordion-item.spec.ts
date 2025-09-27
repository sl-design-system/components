import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { AccordionItem } from './accordion-item.js';

describe('sl-accordion-item', () => {
  let el: AccordionItem;

  describe('defaults', () => {
    let details: HTMLDetailsElement;
    let summary: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-accordion-item summary="Accordion summary">Content of accordion</sl-accordion-item>`);
      await el.updateComplete;

      details = el.renderRoot.querySelector('details') as HTMLDetailsElement;
      summary = el.renderRoot.querySelector('summary') as HTMLElement;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should not have an icon type', () => {
      expect(el).not.to.have.attribute('icon-type');
      expect(el.iconType).to.be.undefined;
    });

    it('should have an icon type when set', async () => {
      el.iconType = 'chevron';
      await el.updateComplete;

      expect(el).to.have.attribute('icon-type', 'chevron');
    });

    it('should render a custom svg icon', () => {
      const icon = el.renderRoot.querySelector('svg');

      expect(icon).to.exist;
      expect(icon).to.contain('g.horizontal-line');
      expect(icon).to.contain('g.vertical-line');
    });

    it('should render an sl-icon when icon type is "chevron"', async () => {
      el.iconType = 'chevron';
      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');
      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'chevron-down');
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
      await userEvent.keyboard('{Enter}');

      await el.updateComplete;

      expect(details).to.have.attribute('open');
      expect(summary).to.have.attribute('aria-expanded', 'true');
    });

    it('should open on Space', async () => {
      summary.focus();
      await userEvent.keyboard('{Space}');

      await el.updateComplete;

      expect(details).to.have.attribute('open');
      expect(summary).to.have.attribute('aria-expanded', 'true');
    });

    it('should animate opening and closing the details on click', async () => {
      el.open = false;
      await new Promise(resolve => setTimeout(resolve, 50));
      await el.updateComplete;

      summary.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      // Open attribute is immediately set
      expect(details).to.have.attribute('open');
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

      // // Wait for the toggle event to be emitted
      await new Promise(resolve => setTimeout(resolve));

      expect(el.open).to.be.false;
    });
  });

  describe('disabled', () => {
    let details: HTMLDetailsElement;
    let summary: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-accordion-item summary="Accordion summary of disabled item" disabled>
          Content of disabled accordion item
        </sl-accordion-item>
      `);

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
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).not.to.have.attribute('open');
      expect(summary).not.to.have.attribute('aria-expanded', 'true');
    });

    it('should ignore Space', async () => {
      summary.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(details).not.to.have.attribute('open');
      expect(summary).not.to.have.attribute('aria-expanded', 'true');
    });
  });
});
