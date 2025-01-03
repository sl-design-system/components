import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { PaginatorSize } from './paginator-size';

describe('sl-paginator-size', () => {
  let el: PaginatorSize;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html` <sl-paginator-size></sl-paginator-size> `);
    });

    it('should have items per page with value of 10 by default', () => {
      expect(el.pageSize).to.equal(10);
    });

    it('should not have a select inside when pageSizes is not set', () => {
      const slSelect = el.renderRoot.querySelector('sl-select');

      expect(slSelect).not.to.exist;
    });
  });

  describe('page sizes', () => {
    beforeEach(async () => {
      el = await fixture(html` <sl-paginator-size .pageSizes=${[5, 10, 20]}></sl-paginator-size> `);
    });

    it('should have a select inside when pageSizes is set', async () => {
      el.pageSizes = [5, 10, 20];
      await el.updateComplete;

      const slSelect = el.renderRoot.querySelector('sl-select');

      expect(slSelect).to.exist;
    });

    it('should have proper options with possible page sizes', async () => {
      el.pageSizes = [5, 10, 20];
      await el.updateComplete;

      const options = el.renderRoot.querySelectorAll('sl-select-option');

      expect(options).to.exist;

      const pageSizes = Array.from(options)?.map(option => option.value);

      expect(pageSizes).to.deep.equal([5, 10, 20]);
    });
  });

  describe('items per page', () => {
    beforeEach(async () => {
      el = await fixture(html` <sl-paginator-size .pageSizes=${[5, 10, 20]}></sl-paginator-size> `);
    });

    it('should set first value of page sizes when there is no pageSize value', () => {
      const slSelect = el.renderRoot.querySelector('sl-select');

      expect(slSelect).to.exist;
      expect(slSelect?.value).to.equal(5);
    });

    it('should set a proper items per page amount when the value has changed', async () => {
      const slSelect = el.renderRoot.querySelector('sl-select');

      expect(slSelect).to.exist;

      const options = el.renderRoot.querySelectorAll('sl-select-option');

      expect(options).to.exist;

      options[1].click();
      await el.updateComplete;

      expect(slSelect?.value).to.equal(10);
    });

    it('should emit an sl-paginator-size-change event when the value of the items per page has changed', async () => {
      const onPageSizeChange = spy();
      el.addEventListener('sl-page-size-change', onPageSizeChange);
      const slSelect = el.renderRoot.querySelector('sl-select');

      expect(slSelect).to.exist;

      const options = el.renderRoot.querySelectorAll('sl-select-option');

      expect(options).to.exist;

      options[1].click();
      await el.updateComplete;

      expect(onPageSizeChange).to.have.been.called;
    });
  });
});
