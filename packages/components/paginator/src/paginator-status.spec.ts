import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import '../register.js';
import { PaginatorStatus } from './paginator-status.js';

describe('sl-paginator-status', () => {
  let el: PaginatorStatus;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-status></sl-paginator-status>`);
    });

    it('should have a rendered text with information about items', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 1 of 1 items')).to.be.true;
    });

    it('should have aria-live by default', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 1 to 1 of 1 items');
    });
  });

  describe('first page', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-status .totalItems=${100} .pageSize=${15}></sl-paginator-status>`);
    });

    it('should have a rendered proper text with information about visible items on the first page', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 15 of 100 items')).to.be.true;
    });

    it('should have a proper aria-live', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 1 to 15 of 100 items');
    });
  });

  describe('last page', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-paginator-status .totalItems=${209} .page=${14} .pageSize=${15}></sl-paginator-status>`
      );
    });

    it('should have a rendered proper text with information about visible items on the first page', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;
    });

    it('should have a proper aria-live', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 196 to 209 of 209 items');
    });
  });

  describe('invalid page', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-paginator-status .totalItems=${209} .page=${-1} .pageSize=${15}></sl-paginator-status>`
      );
    });

    it('should have a rendered proper text with information about visible items on the first page', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 15 of 209 items')).to.be.true;
    });

    it('should have a proper aria-live', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 1 to 15 of 209 items');
    });
  });

  describe('page change', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-paginator-status .totalItems=${209} .page=${2} .pageSize=${15}></sl-paginator-status>`
      );
    });

    it('should have a rendered proper text with information about visible items on the page', async () => {
      el.page = 10;
      await el.updateComplete;

      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('136 - 150 of 209 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 136 to 150 of 209 items');
    });

    it('should have a proper page when set smaller than 1', async () => {
      el.page = -1;
      await new Promise(resolve => setTimeout(resolve, 100));

      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(el.page).to.equal(1);
      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 15 of 209 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 1 to 15 of 209 items');
    });

    it('should have set page to the last one when the number set is bigger than the total number of pages', async () => {
      el.page = 100;
      await new Promise(resolve => setTimeout(resolve, 100));

      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(el.page).to.equal(14);
      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 196 to 209 of 209 items');
    });
  });

  describe('items per page change', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-paginator-status .totalItems=${209} .page=${14} .pageSize=${15}></sl-paginator-status>`
      );
    });

    it('should have a rendered proper text with information about visible items', async () => {
      let itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      el.pageSize = 5;
      await new Promise(resolve => setTimeout(resolve, 100));

      itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('66 - 70 of 209 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 66 to 70 of 209 items');
    });
  });

  describe('total amount of items change', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-paginator-status .totalItems=${209} .page=${14} .pageSize=${15}></sl-paginator-status>`
      );
    });

    it('should have a rendered proper text with information about visible items', async () => {
      let itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      el.totalItems = 508;
      await new Promise(resolve => setTimeout(resolve, 100));

      itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 210 of 508 items')).to.be.true;

      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently showing 196 to 210 of 508 items');
    });
  });
});
