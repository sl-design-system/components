import { expect, fixture } from '@open-wc/testing';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { Select } from '@sl-design-system/select';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import { spy } from 'sinon';
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
      const prev = el.renderRoot.querySelector('sl-button.prev'),
        next = el.renderRoot.querySelector('sl-button.next');

      expect(prev).to.exist;
      expect(next).to.exist;
    });

    it('should have proper pages', () => {
      const pages = el.renderRoot.querySelectorAll('sl-page');

      expect(pages).to.exist;
      expect(pages.length).to.equal(10);

      const pagesLabels = Array.from(pages).map(page => page.textContent?.trim());

      expect(pagesLabels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    it('should have not displayed compact variant', () => {
      const selectWrapper = el.renderRoot.querySelector('div.select-wrapper') as HTMLDivElement;

      expect(selectWrapper).to.exist;
      expect(getComputedStyle(selectWrapper).display).to.equal('none');
    });

    it('should have aria-live by default', () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently active page 1 of 10 pages');
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

    it('should have previous and next buttons with proper aria-labels', () => {
      const prev = el.renderRoot.querySelector('sl-button.prev') as Button,
        next = el.renderRoot.querySelector('sl-button.next') as Button;

      expect(prev).to.exist;
      expect(next).to.exist;

      const prevAriaLabel = prev.ariaLabel,
        nextAriaLabel = next.ariaLabel;

      expect(prevAriaLabel).to.equal('Go to the previous page (1)');
      expect(nextAriaLabel).to.equal('Go to the next page (3)');
    });

    it('should emit an sl-page-change event when the active page has changed', async () => {
      const onPageChange = spy();

      el.addEventListener('sl-page-change', onPageChange);

      el.activePage = 5;
      await el.updateComplete;

      expect(onPageChange).to.have.been.called;
    });

    it('should have a proper aria-live when the active page has changed', async () => {
      const ariaLive = el.renderRoot.querySelector('#live') as HTMLElement;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently active page 2 of 10 pages');

      el.activePage = 5;
      await el.updateComplete;

      expect(ariaLive).to.have.attribute('aria-live', 'polite');
      expect(ariaLive).to.have.rendered.text('Currently active page 5 of 10 pages');
    });

    it('should set the first page active when items per page amount has changed', async () => {
      el.itemsPerPage = 10;
      await el.updateComplete;

      expect(el.activePage).to.equal(1);
    });

    it('should set the first page active when items total amount of items has changed', async () => {
      el.total = 800;
      await el.updateComplete;

      expect(el.activePage).to.equal(1);
    });
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

    it('should be on the last page when the set page is larger than the number of pages', () => {
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
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    it('should have proper pages visible', () => {
      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
        visibleElements = Array.from(pages).filter(page => page.style.display !== 'none');

      expect(visibleElements.length).to.equal(13);

      const visiblePages = Array.from(visibleElements).map(page => page.querySelector<Page>('sl-page'));

      expect(visiblePages).to.exist;
      expect(visiblePages.length).to.equal(13);

      const visiblePagesLabels = Array.from(visiblePages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '20']);
    });

    it('should have proper pages hidden', () => {
      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
        hiddenElements = Array.from(pages).filter(page => page.style.display === 'none');

      expect(hiddenElements.length).to.equal(7);

      const hiddenPages = Array.from(hiddenElements).map(page => page.querySelector<Page>('sl-page'));

      expect(hiddenPages).to.exist;
      expect(hiddenPages.length).to.equal(7);

      const visiblePagesLabels = Array.from(hiddenPages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['13', '14', '15', '16', '17', '18', '19']);
    });

    it('should have one menu button with hidden pages before the last page', () => {
      const pagesWrapper = el.renderRoot.querySelector('.pages-wrapper');

      expect(pagesWrapper).to.exist;

      const menuButtons = pagesWrapper!.querySelectorAll('sl-menu-button');

      expect(menuButtons).to.exist;
      expect(menuButtons.length).to.equal(1);

      const liElements = Array.from(pagesWrapper!.querySelectorAll('li')),
        [lastItem] = liElements.slice(-1),
        [itemBefore] = liElements.slice(-2);

      expect(lastItem).to.exist;
      expect(itemBefore).to.exist;
      expect(itemBefore.querySelector('sl-menu-button')).to.exist;
    });

    it('should have one menu button with hidden pages after the first page', async () => {
      el.activePage = 20;
      await el.updateComplete;

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));

      const pagesWrapper = el.renderRoot.querySelector('.pages-wrapper');

      expect(pagesWrapper).to.exist;

      const menuButtons = pagesWrapper!.querySelectorAll('sl-menu-button');

      expect(menuButtons).to.exist;
      expect(menuButtons.length).to.equal(1);

      const liElements = Array.from(pagesWrapper!.querySelectorAll('li')),
        firstItem = liElements[0],
        secondItem = liElements[1];

      expect(firstItem).to.exist;
      expect(secondItem).to.exist;
      expect(secondItem.querySelector('sl-menu-button')).to.exist;
    });

    it('should have two menu buttons with hidden pages, one after the first page and before the last page', async () => {
      el.activePage = 10;
      await el.updateComplete;

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));

      const pagesWrapper = el.renderRoot.querySelector('.pages-wrapper');

      expect(pagesWrapper).to.exist;

      const menuButtons = pagesWrapper!.querySelectorAll('sl-menu-button');

      expect(menuButtons).to.exist;
      expect(menuButtons.length).to.equal(2);

      const liElements = Array.from(pagesWrapper!.querySelectorAll('li')),
        firstItem = liElements[0],
        secondItem = liElements[1];

      expect(firstItem).to.exist;
      expect(secondItem).to.exist;
      expect(secondItem.querySelector('sl-menu-button')).to.exist;

      const [lastItem] = liElements.slice(-1),
        [itemBefore] = liElements.slice(-2);

      expect(lastItem).to.exist;
      expect(itemBefore).to.exist;
      expect(itemBefore.querySelector('sl-menu-button')).to.exist;
    });
  });

  describe('Compact variant', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator
          style="inline-size: 300px;"
          .total=${100}
          .activePage=${2}
          .pageSizes=${[10, 15, 20]}
        ></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    it('should have not displayed default variant', () => {
      const pagesWrapper = el.renderRoot.querySelector('ul.pages-wrapper') as HTMLUListElement;

      expect(pagesWrapper).to.exist;
      expect(getComputedStyle(pagesWrapper).display).to.equal('none');
    });

    it('should have displayed compact variant', () => {
      const selectWrapper = el.renderRoot.querySelector('div.select-wrapper') as HTMLDivElement;

      expect(selectWrapper).to.exist;
      expect(getComputedStyle(selectWrapper).display).not.to.equal('none');
    });

    it('should have a container with mobile attribute', () => {
      const container = el.renderRoot.querySelector('.container') as HTMLDivElement;

      expect(container).to.exist;
      expect(container.getAttribute('mobile')).to.exist;
    });

    it('should not have previous and next buttons visible', () => {
      const prev = el.renderRoot.querySelector('sl-button.prev') as Button,
        next = el.renderRoot.querySelector('sl-button.next') as Button;

      expect(prev).to.exist;
      expect(next).to.exist;
      expect(getComputedStyle(prev).display).to.equal('none');
      expect(getComputedStyle(next).display).to.equal('none');
    });

    it('should contain select', () => {
      const selectEl = el.renderRoot.querySelector('sl-select') as Select;

      expect(selectEl).to.exist;
    });

    it('should have a proper aria-label', () => {
      const selectEl = el.renderRoot.querySelector('sl-select') as Select;

      expect(selectEl).to.exist;

      const ariaLabel = selectEl.ariaLabel;

      expect(ariaLabel).to.equal('2, page');
    });

    it('should have proper select options with pages to set', () => {
      const selectOptions = el.renderRoot.querySelectorAll('sl-select-option');

      expect(selectOptions).to.exist;

      const optionsLabels = Array.from(selectOptions).map(page => page.textContent?.trim());

      expect(optionsLabels).to.exist;
      expect(optionsLabels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    it('should have select options with proper aria-labels', () => {
      const selectOptions = el.renderRoot.querySelectorAll('sl-select-option');

      expect(selectOptions).to.exist;

      const optionsLabels = Array.from(selectOptions).map(page => page.ariaLabel);

      expect(optionsLabels).to.exist;
      expect(optionsLabels).to.deep.equal([
        '1, page',
        '2, page',
        '3, page',
        '4, page',
        '5, page',
        '6, page',
        '7, page',
        '8, page',
        '9, page',
        '10, page'
      ]);
    });

    it('should set the right active page on option click', async () => {
      const selectOptions = el.renderRoot.querySelectorAll('sl-select-option');

      expect(selectOptions).to.exist;

      selectOptions[4].click();
      await el.updateComplete;

      expect(el.activePage).to.equal(5);
    });
  });
});
