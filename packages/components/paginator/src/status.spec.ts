import { expect, fixture } from '@open-wc/testing';
import { SlAnnounceEvent } from '@sl-design-system/announcer';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { PaginatorStatus } from './status.js';

describe('sl-paginator-status', () => {
  let el: PaginatorStatus;
  const sendToAnnouncerSpy = spy();

  beforeEach(() => {
    document.body.addEventListener('sl-announce', sendToAnnouncerSpy);
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-status></sl-paginator-status>`);
    });

    it('should have a rendered text with information about items', () => {
      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 1 of 1 items')).to.be.true;
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

      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if sendToAnnouncer was called
      expect((sendToAnnouncerSpy.getCall(-1).args[0] as SlAnnounceEvent).detail.message).to.equal(
        'Currently showing 136 to 150 of 209 items'
      );
    });

    it('should have a proper page when set smaller than 1', async () => {
      el.page = -1;
      await new Promise(resolve => setTimeout(resolve, 100));

      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(el.page).to.equal(1);
      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('1 - 15 of 209 items')).to.be.true;

      expect((sendToAnnouncerSpy.getCall(-1).args[0] as SlAnnounceEvent).detail.message).to.equal(
        'Currently showing 1 to 15 of 209 items'
      );
    });

    it('should have set page to the last one when the number set is bigger than the total number of pages', async () => {
      el.page = 100;
      await new Promise(resolve => setTimeout(resolve, 100));

      const itemsCounterLabel = el.renderRoot.textContent?.trim();

      expect(el.page).to.equal(14);
      expect(itemsCounterLabel).to.exist;
      expect(itemsCounterLabel!.includes('196 - 209 of 209 items')).to.be.true;

      expect((sendToAnnouncerSpy.getCall(-1).args[0] as SlAnnounceEvent).detail.message).to.equal(
        'Currently showing 196 to 209 of 209 items'
      );
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

      expect((sendToAnnouncerSpy.getCall(-1).args[0] as SlAnnounceEvent).detail.message).to.equal(
        'Currently showing 66 to 70 of 209 items'
      );
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

      expect((sendToAnnouncerSpy.getCall(-1).args[0] as SlAnnounceEvent).detail.message).to.equal(
        'Currently showing 196 to 210 of 508 items'
      );
    });
  });
});
