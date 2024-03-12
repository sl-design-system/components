import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { Accordion } from './accordion.js';

describe('sl-accordion', () => {
  let el: Accordion;

  describe('empty', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-accordion></sl-accordion>`);
    });

    it('should not break', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-accordion>
          <sl-accordion-item summary="Example 1">Content of accordion 1</sl-accordion-item>
          <sl-accordion-item summary="Example 2">Content of accordion 2</sl-accordion-item>
          <sl-accordion-item summary="Example 3">Content of accordion 3</sl-accordion-item>
        </sl-accordion>
      `);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not have single attribute by default', () => {
      expect(el).not.to.have.attribute('single');
    });

    it('should be single when set', async () => {
      el.single = true;
      await el.updateComplete;

      expect(el).to.have.attribute('single');
    });

    it('should toggle only one accordion when single is set', async () => {
      const items = Array.from(el.querySelectorAll('sl-accordion-item'));

      el.single = true;
      await el.updateComplete;

      items[0]?.renderRoot.querySelector('summary')?.click();

      await el.updateComplete;

      await new Promise(resolve => setTimeout(resolve));

      expect(items.at(0)?.open).to.be.true;

      items[1]?.renderRoot.querySelector('summary')?.click();

      await el.updateComplete;

      await new Promise(resolve => setTimeout(resolve, 500));

      expect(items.at(0)?.open).to.be.false;
      expect(items.at(1)?.open).to.be.true;
    });

    it('should not toggle only one accordion when there is no single set', async () => {
      const items = Array.from(el.querySelectorAll('sl-accordion-item'));

      items[0].renderRoot.querySelector('summary')?.click();

      await el.updateComplete;

      await new Promise(resolve => setTimeout(resolve));

      expect(items.at(0)?.open).to.be.true;

      items[1].renderRoot.querySelector('summary')?.click();

      await el.updateComplete;

      await new Promise(resolve => setTimeout(resolve));

      expect(items.at(0)?.open).to.be.true;
      expect(items.at(1)?.open).to.be.true;
    });
  });
});
