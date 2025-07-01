import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { PaginatorPageSize } from './page-size.js';

describe('sl-paginator-page-size', () => {
  let el: PaginatorPageSize;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-page-size></sl-paginator-page-size>`);
    });

    it('should have items per page with value of 10', () => {
      expect(el.pageSize).to.equal(10);
    });

    it('should have a label', () => {
      const label = el.renderRoot.querySelector('sl-label'),
        select = el.renderRoot.querySelector('sl-select');

      expect(label).to.exist;
      expect(label).to.have.attribute('for', select?.id);
      expect(label).to.have.trimmed.text('Items per page:');
    });

    it('should have a disabled select', () => {
      const select = el.renderRoot.querySelector('sl-select');

      expect(select).to.exist;
      expect(select).to.have.attribute('disabled');
    });
  });

  describe('page sizes', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator-page-size page-sizes="[5,10,20]"></sl-paginator-page-size>`);
    });

    it('should have an enabled select', () => {
      const select = el.renderRoot.querySelector('sl-select');

      expect(select).to.exist;
      expect(select).not.to.have.attribute('disabled');
    });

    it('should have options for possible page sizes', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const pageSizes = Array.from(el.renderRoot.querySelectorAll('sl-option')).map(o => o.value);

      expect(pageSizes).to.deep.equal([5, 10, 20]);
    });

    it('should default to the first page size', () => {
      expect(el.renderRoot.querySelector('sl-select')?.value).to.equal(5);
    });

    it('should set the page size when you select a different page size', async () => {
      el.renderRoot.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(el.pageSize).to.equal(5);
    });

    it('should emit a sl-page-size-change event when the page size has changed', () => {
      const onPageSizeChange = spy();

      el.addEventListener('sl-page-size-change', onPageSizeChange);
      el.renderRoot.querySelector('sl-option')?.click();

      expect(onPageSizeChange).to.have.been.calledOnce;
      expect(onPageSizeChange).to.have.been.calledWithMatch({ detail: 5 });
    });
  });

  describe('custom item label', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-paginator-page-size .itemLabel=${'Students'} page-sizes="[5,10,20]"></sl-paginator-page-size>`
      );
    });

    it('should have a proper label', () => {
      const label = el.renderRoot.querySelector('sl-label');

      expect(label).to.exist;
      expect(label).to.have.trimmed.text('Students per page:');
    });

    it('should have options with proper aria-label', () => {
      const pageSizes = Array.from(el.renderRoot.querySelectorAll('sl-option')).map(o => o.ariaLabel);

      expect(pageSizes).to.deep.equal(['5 Students per page', '10 Students per page', '20 Students per page']);
    });
  });
});
