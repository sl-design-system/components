import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { Accordion } from './accordion.js';

describe('sl-accordion', () => {
  let el: Accordion;

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

    it('should have icon type "plusminus"', () => {
      expect(el.iconType).to.equal('plusminus');
    });

    it('should propagate the icon type to all items', () => {
      const iconTypes = Array.from(el.querySelectorAll('sl-accordion-item')).map(item =>
        item.getAttribute('icon-type')
      );

      expect(iconTypes).to.deep.equal(['plusminus', 'plusminus', 'plusminus']);
    });

    it('should have icon type "chevron" when set', async () => {
      el.iconType = 'chevron';
      await el.updateComplete;

      const iconTypes = Array.from(el.querySelectorAll('sl-accordion-item')).map(item =>
        item.getAttribute('icon-type')
      );

      expect(iconTypes).to.deep.equal(['chevron', 'chevron', 'chevron']);
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

      await userEvent.keyboard('{ArrowDown}');
      expect(items.at(1)).to.equal(document.activeElement);

      await userEvent.keyboard('{ArrowDown}');
      expect(items.at(0)).to.equal(document.activeElement);

      await userEvent.keyboard('{ArrowUp}');
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

  describe('global icon type', () => {
    it('should have a default icon type of "plusminus"', () => {
      expect(Accordion.iconType).to.equal('plusminus');
    });

    it('should allow setting a global icon type', async () => {
      Accordion.iconType = 'chevron';

      el = await fixture(html`<sl-accordion></sl-accordion>`);

      expect(el.iconType).to.equal('chevron');

      // Reset for future tests
      Accordion.iconType = 'plusminus';
    });
  });
});
