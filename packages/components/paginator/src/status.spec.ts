import { expect, fixture } from '@open-wc/testing';
import { type SlAnnounceEvent } from '@sl-design-system/announcer';
import { html } from 'lit';
import { type SinonSpy, spy } from 'sinon';
import '../register.js';
import { PaginatorStatus } from './status.js';

describe('sl-paginator-status', () => {
  let el: PaginatorStatus;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-status></sl-paginator-status>`);
    });

    it('should have sane defaults', () => {
      expect(el.page).to.equal(0);
      expect(el.pageCount).to.equal(1);
      expect(el.pageSize).to.equal(10);
      expect(el.totalItems).to.equal(1);
    });

    it('should display the status', () => {
      expect(el.renderRoot).to.have.trimmed.text('1 - 1 of 1 items');
    });
  });

  describe('first page', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-status page-size="15" total-items="100"></sl-paginator-status>`);
    });

    it('should display the status', () => {
      expect(el.renderRoot).to.have.trimmed.text('1 - 15 of 100 items');
    });
  });

  describe('current page', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-status page="7" page-size="15" total-items="209"></sl-paginator-status>`);
    });

    it('should display the status', () => {
      expect(el.renderRoot).to.have.trimmed.text('106 - 120 of 209 items');
    });
  });

  describe('last page', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-status page="14" page-size="15" total-items="209"></sl-paginator-status>`);
    });

    it('should display the status', () => {
      expect(el.renderRoot).to.have.trimmed.text('196 - 209 of 209 items');
    });
  });

  describe('invalid page', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-status page-size="15" total-items="209"></sl-paginator-status>`);
    });

    it('should show the first page, if the page number is negative', async () => {
      el.page = -10;
      await el.updateComplete;

      expect(el.renderRoot).to.have.trimmed.text('1 - 15 of 209 items');
    });

    it('should show the last page, if the page number is too big', async () => {
      el.page = 400;
      await el.updateComplete;

      expect(el.renderRoot).to.have.trimmed.text('196 - 209 of 209 items');
    });
  });

  describe('announcements', () => {
    let announce: SinonSpy;

    beforeEach(async () => {
      announce = spy();
      document.body.addEventListener('sl-announce', announce);

      el = await fixture(html`<sl-paginator-status page="7" page-size="15" total-items="209"></sl-paginator-status>`);
    });

    afterEach(() => document.body.removeEventListener('sl-announce', announce));

    it('should announce the status', async () => {
      expect(announce).not.to.have.been.called;

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(announce).to.have.been.calledOnce;

      const event = announce.lastCall.firstArg as SlAnnounceEvent;
      expect(event.detail.message).to.equal('Currently showing 106 to 120 of 209 items');
      expect(event.detail.urgency).to.be.undefined;
    });

    it('should announce the status when the page changes', async () => {
      el.page = 8;
      await new Promise(resolve => setTimeout(resolve, 101));

      expect(announce).to.have.been.calledOnce;

      const event = announce.lastCall.firstArg as SlAnnounceEvent;
      expect(event.detail.message).to.equal('Currently showing 121 to 135 of 209 items');
      expect(event.detail.urgency).to.be.undefined;
    });

    it('should announce the status when the page size changes', async () => {
      el.pageSize = 10;
      await new Promise(resolve => setTimeout(resolve, 101));

      expect(announce).to.have.been.calledOnce;

      const event = announce.lastCall.firstArg as SlAnnounceEvent;
      expect(event.detail.message).to.equal('Currently showing 71 to 80 of 209 items');
      expect(event.detail.urgency).to.be.undefined;
    });

    it('should announce the status when the total number of items changes', async () => {
      el.totalItems = 300;
      await new Promise(resolve => setTimeout(resolve, 101));

      expect(announce).to.have.been.calledOnce;

      const event = announce.lastCall.firstArg as SlAnnounceEvent;
      expect(event.detail.message).to.equal('Currently showing 106 to 120 of 300 items');
      expect(event.detail.urgency).to.be.undefined;
    });
  });
});
