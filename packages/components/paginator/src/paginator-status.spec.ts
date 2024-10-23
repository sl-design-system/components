import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import '../register.js';
import { PaginatorStatus } from './paginator-status';

describe('sl-paginator-status', () => {
  let el: PaginatorStatus;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html` <sl-paginator-status></sl-paginator-status> `);
    });

    it('should have a rendered text with information about items', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 1 of 1 items')).to.be.true;
    });

    it('should have aria-live by default', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 1 to 1 of 1 items');
    });
  });

  describe('first active page', () => {
    beforeEach(async () => {
      el = await fixture(html` <sl-paginator-status .total=${100} .itemsPerPage=${15}></sl-paginator-status> `);
    });

    it('should have a rendered proper text with information about visible items on the first page', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 15 of 100 items')).to.be.true;
    });

    it('should have a proper aria-live', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 1 to 15 of 100 items');
    });
  });

  describe('last active page', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator-status .total=${209} .activePage=${14} .itemsPerPage=${15}></sl-paginator-status>
      `);
    });

    it('should have a rendered proper text with information about visible items on the first page', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;
    });

    it('should have a proper aria-live', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 196 to 209 of 209 items');
    });
  });

  describe('invalid active page', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator-status .total=${209} .activePage=${-1} .itemsPerPage=${15}></sl-paginator-status>
      `);
    });

    it('should have a rendered proper text with information about visible items on the first page', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 15 of 209 items')).to.be.true;
    });

    it('should have a proper aria-live', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 1 to 15 of 209 items');
    });
  });

  describe('active page change', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator-status .total=${209} .activePage=${14} .itemsPerPage=${15}></sl-paginator-status>
      `);
    });

    it('should have a rendered proper text with information about visible items on the active page', async () => {
      let itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      el.activePage = 10;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('136 - 150 of 209 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 136 to 150 of 209 items');
    });

    it('should have a proper active page when set smaller than 1', async () => {
      let itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      el.activePage = -1;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(el.activePage).to.equal(1);

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 15 of 209 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 1 to 15 of 209 items');
    });

    it('should have set active page to the last one when the number set is bigger than the total number of pages', async () => {
      let itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      el.activePage = 100;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(el.activePage).to.equal(14);
      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 196 to 209 of 209 items');
    });
  });

  describe('items per page change', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator-status .total=${209} .activePage=${14} .itemsPerPage=${15}></sl-paginator-status>
      `);
    });

    it('should have a rendered proper text with information about visible items', async () => {
      let itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      el.itemsPerPage = 5;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('66 - 70 of 209 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 66 to 70 of 209 items');
    });
  });

  describe('total amount of items change', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator-status .total=${209} .activePage=${14} .itemsPerPage=${15}></sl-paginator-status>
      `);
    });

    it('should have a rendered proper text with information about visible items', async () => {
      let itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      el.total = 508;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 210 of 508 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently shown from 196 to 210 of 508 items');
    });
  });
});
