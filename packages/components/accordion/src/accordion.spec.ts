import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
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
          <sl-accordion-item disabled summary="Example 3">Content of accordion 3</sl-accordion-item>
        </sl-accordion>
      `);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be in single mode', () => {
      expect(el).not.to.have.attribute('single');
      expect(el.single).not.to.be.true;
    });

    it('should be single when set', async () => {
      el.single = true;
      await el.updateComplete;

      expect(el).to.have.attribute('single');
    });

    it('should switch focus between the items when pressing the arrow keys', async () => {
      const items = Array.from(el.querySelectorAll('sl-accordion-item'));

      items.at(0)?.focus();

      await sendKeys({ press: 'ArrowDown' });
      expect(items.at(1)).to.equal(document.activeElement);

      await sendKeys({ press: 'ArrowDown' });
      expect(items.at(0)).to.equal(document.activeElement);

      await sendKeys({ press: 'ArrowUp' });
      expect(items.at(1)).to.equal(document.activeElement);
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
