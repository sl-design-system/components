import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
// import { spy } from 'sinon';
import { Button } from 'packages/components/button/index.js';
import '../register.js';
import { Page } from './page.js';
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
    });

    it('should have not displayed compact variant', () => {
      const selectWrapper = el.renderRoot.querySelector('div.select-wrapper') as HTMLDivElement;
      console.log('selectWrapper', selectWrapper, el.renderRoot);

      expect(selectWrapper).to.exist;
      expect(getComputedStyle(selectWrapper).display).to.equal('none');
    });
  });

  describe('active page', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator .total=${200} .activePage=${2} .pageSizes=${[20, 40, 60]}></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have a proper active page when set smaller than 1', async () => {
      el.activePage = -1;
      await el.updateComplete;

      expect(el.activePage).to.equal(1);
    });

    it('should have a proper active page when set bigger than the last one', async () => {
      el.activePage = 100;
      await el.updateComplete;

      expect(el.activePage).to.equal(10);
    });

    it('should set the right active page on page click', async () => {
      const pages = el.renderRoot.querySelectorAll('sl-page');

      pages[3].click();
      await el.updateComplete;

      expect(el.activePage).to.equal(4);
    });

    it('should set the next active page on next button click', async () => {
      // expect(el.activePage).to.equal(2);
      // console.log('activepage_1', el.activePage);
      const next = el.renderRoot.querySelector<Button>('sl-button.next');

      expect(next).to.exist;

      next!.click();

      await el.updateComplete;

      expect(el.activePage).to.equal(3);
    });

    it('should set the previous active page on prev button click', async () => {
      const prev = el.renderRoot.querySelector<Button>('sl-button.prev');

      expect(prev).to.exist;

      prev!.click();
      await el.updateComplete;

      expect(el.activePage).to.equal(1);
    });

    // it('should have active page with value of 1 when it is not explicitly set', () => {
    //   expect(el.activePage).to.equal(1);
    // });
    //
    // it('should have a proper value of items per page when it is not explicitly set', () => {
    //   expect(el.itemsPerPage).to.equal(20);
    // });
    //
    // it('should have previous and next buttons', () => {
    //   const prev = el.renderRoot.querySelector('sl-button.prev');
    //   const next = el.renderRoot.querySelector('sl-button.prev');
    //
    //   expect(prev).to.exist;
    //   expect(next).to.exist;
    // });
  });

  describe('smaller active page', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator .total=${200} .activePage=${-2} .pageSizes=${[20, 40, 60]}></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have a valid active page when set smaller than 1', () => {
      expect(el.activePage).to.equal(1);
    });
  });

  describe('bigger active page', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator .total=${200} .activePage=${2000} .pageSizes=${[20, 40, 60]}></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have a valid active page when set smaller than 1', () => {
      expect(el.activePage).to.equal(10);
    });
  });

  describe('Overflow', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator
          style="inline-size: 800px;"
          .total=${200}
          .activePage=${2}
          .pageSizes=${[10, 15, 20]}
        ></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 300));
    });

    it('should have proper pages visible', () => {
      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page');
      const visibleElements = Array.from(pages).filter(page => page.style.display !== 'none');

      expect(visibleElements.length).to.equal(13);

      const visiblePages = Array.from(visibleElements).map(page => page.querySelector<Page>('sl-page'));

      expect(visiblePages).to.exist;
      expect(visiblePages.length).to.equal(13);

      const visiblePagesLabels = Array.from(visiblePages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '20']);
    });

    it('should have proper pages hidden', () => {
      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page');
      const hiddenElements = Array.from(pages).filter(page => page.style.display === 'none');

      expect(hiddenElements.length).to.equal(7);

      const hiddenPages = Array.from(hiddenElements).map(page => page.querySelector<Page>('sl-page'));

      expect(hiddenPages).to.exist;
      expect(hiddenPages.length).to.equal(7);

      const visiblePagesLabels = Array.from(hiddenPages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['13', '14', '15', '16', '17', '18', '19']);
    });

    it('should have one menu button with hidden pages before the last page', () => {
      console.log('el.renderRoot', el.renderRoot.children.length, el.renderRoot);
      // const pages = el.renderRoot.querySelectorAll('li.page');
      // const visible = Array.from(el.renderRoot.querySelectorAll('sl-tag')).map(tag => tag.style.display !== 'none');
      // console.log('pages overflow', pages, pages.length);
      // expect(el.activePage).to.equal(10);
    });

    it('should have one menu button with hidden pages after the first page', () => {
      // const pages = el.renderRoot.querySelectorAll('li.page');
      // const visible = Array.from(el.renderRoot.querySelectorAll('sl-tag')).map(tag => tag.style.display !== 'none');
      // console.log('pages overflow', pages, pages.length);
      // expect(el.activePage).to.equal(10);
    });

    it('should have two menu buttons with hidden pages, one after the first page and before the last page', () => {
      // const pages = el.renderRoot.querySelectorAll('li.page');
      // const visible = Array.from(el.renderRoot.querySelectorAll('sl-tag')).map(tag => tag.style.display !== 'none');
      // console.log('pages overflow', pages, pages.length);
      // expect(el.activePage).to.equal(10);
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

// TODO: emit an event on active page change, mobile/compact variant when not enough space (+ set active there)
// TODO: click next, click prev, click page
