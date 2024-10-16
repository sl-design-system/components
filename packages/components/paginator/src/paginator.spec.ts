import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
// import { spy } from 'sinon';
import '../register.js';
import { Paginator } from './paginator.js';

describe('sl-paginator', () => {
  let el: Paginator;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html` <sl-paginator .total=${200} .pageSizes=${[20, 40, 60]}></sl-paginator> `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have active page with value of 1 when it is not explicitly set', () => {
      expect(el.activePage).to.equal(1);
    });

    it('should have a proper value of items per page when it is not explicitly set', () => {
      expect(el.itemsPerPage).to.equal(20);
    });

    it('should have previous and next buttons', () => {
      const prev = el.renderRoot.querySelector('sl-button.prev');
      const next = el.renderRoot.querySelector('sl-button.prev');

      expect(prev).to.exist;
      expect(next).to.exist;
    });

    it('should have proper pages', () => {
      const pages = el.renderRoot.querySelectorAll('sl-page');
      // console.log('el11111', pages);
      // expect(el.itemsPerPage).to.equal(20);
      expect(pages).to.exist;
      expect(pages.length).to.equal(10);
      expect(Array.from(pages).map(page => page.textContent?.trim())).to.deep.equal([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10'
      ]);
      // expect(next).to.exist;
    });
  });

  // describe('items per page', () => {
  //   beforeEach(async () => {
  //     el = await fixture(html` <sl-page-size .pageSizes=${[5, 10, 20]}></sl-page-size> `);
  //
  //     // Give the resize observer time to do its thing
  //     await new Promise(resolve => setTimeout(resolve, 300));
  //   });
  //
  //   it('should set first value of page sizes when there is no itemsPerPage value', () => {
  //     const slSelect = el.renderRoot.querySelector('sl-select');
  //
  //     expect(slSelect).to.exist;
  //     expect(slSelect?.value).to.equal(5);
  //   });
  //
  //   it('should set a proper items per page amount when the value has changed', async () => {
  //     const slSelect = el.renderRoot.querySelector('sl-select');
  //     expect(slSelect).to.exist;
  //
  //     const options = el.renderRoot.querySelectorAll('sl-select-option');
  //     expect(options).to.exist;
  //
  //     options[1].click();
  //     await el.updateComplete;
  //
  //     expect(slSelect?.value).to.equal(10);
  //   });
  //
  //   it('should emit an sl-page-size-change event when the value of the items per page has changed', async () => {
  //     const onPageSizeChange = spy();
  //
  //     el.addEventListener('sl-page-size-change', onPageSizeChange);
  //
  //     const slSelect = el.renderRoot.querySelector('sl-select');
  //     expect(slSelect).to.exist;
  //
  //     const options = el.renderRoot.querySelectorAll('sl-select-option');
  //     expect(options).to.exist;
  //
  //     options[1].click();
  //     await el.updateComplete;
  //
  //     expect(onPageSizeChange).to.have.been.called;
  //   });
  // });
});

// TODO: emit an event on active page change, mobile/compact variant when not enough space
