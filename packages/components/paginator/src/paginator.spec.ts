import { expect, fixture } from '@open-wc/testing';
import { SlAnnounceEvent } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { Select } from '@sl-design-system/select';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { PaginatorPage } from './paginator-page.js';
import { Paginator } from './paginator.js';

describe('sl-paginator', () => {
  let el: Paginator;
  const sendToAnnouncerSpy = spy();

  beforeEach(() => {
    document.body.addEventListener('sl-announce', sendToAnnouncerSpy);
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html` <sl-paginator .totalItems=${200} .pageSizes=${[20, 40, 60]}></sl-paginator> `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have active page with value of 1 when it is not explicitly set', () => {
      expect(el.page).to.equal(1);
    });

    it('should have a proper value of items per page when it is not explicitly set', () => {
      expect(el.pageSize).to.equal(20);
    });

    it('should have no mobile attribute', () => {
      expect(el).not.to.have.attribute('mobile');
    });

    it('should have previous and next buttons', () => {
      const prev = el.renderRoot.querySelector('sl-button.prev'),
        next = el.renderRoot.querySelector('sl-button.next');

      expect(prev).to.exist;
      expect(next).to.exist;
    });

    it('should have proper pages', () => {
      const pages = el.renderRoot.querySelectorAll('sl-paginator-page');

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
  });

  describe('page', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator .totalItems=${200} .page=${2} .pageSizes=${[20, 40, 60]}></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should go to page 1 when set page is smaller than 1', async () => {
      el.page = -1;
      await el.updateComplete;

      expect(el.page).to.equal(1);
    });

    it('should have set page to the last one when the number set is bigger than the total number of pages', async () => {
      el.page = 100;
      await el.updateComplete;

      expect(el.page).to.equal(10);
    });

    it('should set the right page on page click', async () => {
      const pages = el.renderRoot.querySelectorAll('sl-paginator-page');

      pages[3].click();
      await el.updateComplete;

      expect(el.page).to.equal(4);
    });

    it('should set the next page on next button click', async () => {
      const next = el.renderRoot.querySelector<Button>('sl-button.next');
      expect(next).to.exist;

      next!.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el.page).to.equal(2);
    });

    it('should set the previous page on prev button click', async () => {
      const prev = el.renderRoot.querySelector<Button>('sl-button.prev');

      expect(prev).to.exist;

      prev!.click();
      await el.updateComplete;

      expect(el.page).to.equal(1);
    });

    it('should have previous and next buttons with proper aria-labels', async () => {
      el.page = 3;
      await el.updateComplete;

      const prev = el.renderRoot.querySelector('sl-button.prev') as Button,
        next = el.renderRoot.querySelector('sl-button.next') as Button;

      expect(prev).to.exist;
      expect(next).to.exist;

      const prevAriaLabel = prev.ariaLabel,
        nextAriaLabel = next.ariaLabel;

      expect(prevAriaLabel).to.equal('Go to the previous page (2)');
      expect(nextAriaLabel).to.equal('Go to the next page (4)');
    });

    it('should emit an sl-page-change event when the page has changed', async () => {
      const onPageChange = spy();

      el.addEventListener('sl-page-change', onPageChange);

      el.page = 5;
      await el.updateComplete;

      expect(onPageChange).to.have.been.called;
    });

    it('should send an announcement when the page has changed', async () => {
      el.page = 5;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect((sendToAnnouncerSpy.getCall(-1).args[0] as SlAnnounceEvent).detail.message).to.equal('Page 5 of 10');
    });

    it('should set the first page when items per page amount has changed', async () => {
      el.pageSize = 10;
      await el.updateComplete;

      expect(el.page).to.equal(1);
    });

    it('should set the first page when items total amount of items has changed', async () => {
      el.totalItems = 800;
      await el.updateComplete;

      expect(el.page).to.equal(1);
    });
  });

  describe('smaller page', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator .totalItems=${200} .page=${-2} .pageSizes=${[20, 40, 60]}></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have a valid active page when set smaller than 1', () => {
      expect(el.page).to.equal(1);
    });
  });

  describe('bigger page', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator .totalItems=${200} page="2000" .pageSizes=${[20, 40, 60]}></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    it('should be on the last page when the set page is larger than the number of pages', async () => {
      el.page = 2000;
      await el.updateComplete;

      expect(el.page).to.equal(10);
    });
  });

  describe('Overflow', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator
          style="inline-size: 800px;"
          .totalItems=${200}
          .page=${2}
          .pageSizes=${[10, 15, 20]}
        ></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    it('should have proper pages visible', () => {
      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
        visibleElements = Array.from(pages).filter(page => page.style.display !== 'none');

      expect(visibleElements.length).to.equal(10);

      const visiblePages = Array.from(visibleElements).map(page =>
        page.querySelector<PaginatorPage>('sl-paginator-page')
      );

      expect(visiblePages).to.exist;
      expect(visiblePages.length).to.equal(10);

      const visiblePagesLabels = Array.from(visiblePages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '20']);
    });

    it('should have proper pages hidden', () => {
      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
        hiddenElements = Array.from(pages).filter(page => page.style.display === 'none');

      expect(hiddenElements.length).to.equal(10);

      const hiddenPages = Array.from(hiddenElements).map(page =>
        page.querySelector<PaginatorPage>('sl-paginator-page')
      );

      expect(hiddenPages).to.exist;
      expect(hiddenPages.length).to.equal(10);

      const visiblePagesLabels = Array.from(hiddenPages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19']);
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
      el.page = 20;
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
      el.page = 10;
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

  describe('Size', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator .totalItems=${200} page="1" .pageSizes=${[10, 15, 20]} size="sm"></sl-paginator>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    it('should have proper pages visible', () => {
      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
        visibleElements = Array.from(pages).filter(page => page.style.display !== 'none');

      expect(visibleElements.length).to.equal(6);

      const visiblePages = Array.from(visibleElements).map(page =>
        page.querySelector<PaginatorPage>('sl-paginator-page')
      );

      expect(visiblePages).to.exist;
      expect(visiblePages.length).to.equal(6);

      const visiblePagesLabels = Array.from(visiblePages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['1', '2', '3', '4', '5', '20']);
    });

    it('should have proper pages visible when md size is set', async () => {
      el.size = 'md';
      await new Promise(resolve => setTimeout(resolve, 200));

      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
        visibleElements = Array.from(pages).filter(page => page.style.display !== 'none');

      expect(visibleElements.length).to.equal(8);

      const visiblePages = Array.from(visibleElements).map(page =>
        page.querySelector<PaginatorPage>('sl-paginator-page')
      );

      expect(visiblePages).to.exist;
      expect(visiblePages.length).to.equal(8);

      const visiblePagesLabels = Array.from(visiblePages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '20']);
    });

    it('should have proper pages visible when lg size is set', async () => {
      el.size = 'lg';
      await new Promise(resolve => setTimeout(resolve, 200));

      const pages = el.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
        visibleElements = Array.from(pages).filter(page => page.style.display !== 'none');

      expect(visibleElements.length).to.equal(10);

      const visiblePages = Array.from(visibleElements).map(page =>
        page.querySelector<PaginatorPage>('sl-paginator-page')
      );

      expect(visiblePages).to.exist;
      expect(visiblePages.length).to.equal(10);

      const visiblePagesLabels = Array.from(visiblePages).map(page => page!.textContent?.trim());

      expect(visiblePagesLabels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '20']);
    });

    it('should have proper select options to set when xs size is set', async () => {
      el.size = 'xs';
      await new Promise(resolve => setTimeout(resolve, 200));

      const selectOptions = el.renderRoot.querySelectorAll('sl-select-option');

      expect(selectOptions).to.exist;

      const optionsLabels = Array.from(selectOptions).map(page => page.textContent?.trim());

      expect(optionsLabels).to.exist;
      expect(optionsLabels).to.deep.equal([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20'
      ]);
    });
  });

  describe('Compact variant', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-paginator
          style="inline-size: 300px;"
          .totalItems=${100}
          .page=${1}
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

    it('should have a mobile attribute', () => {
      expect(el).to.have.attribute('mobile');
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

      expect(ariaLabel).to.equal('1, page');
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

    it('should set the right page on option click', async () => {
      const selectOptions = el.renderRoot.querySelectorAll('sl-select-option');

      expect(selectOptions).to.exist;

      selectOptions[4].click();
      await el.updateComplete;

      expect(el.page).to.equal(5);
    });
  });

  describe('DataSource', () => {
    const items = Array.from({ length: 80 }, (_, index) => ({
      nr: index + 1
    }));

    const dataSource = new ArrayListDataSource(items);
    const totalItems = dataSource.items.length;

    beforeEach(async () => {
      el = await fixture(html` <sl-paginator .dataSource=${dataSource} .pageSizes=${[10, 15, 20]}></sl-paginator> `);

      dataSource.paginate(2, 10, totalItems);
      dataSource.update();

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    it('should have proper pages', () => {
      const pages = el.renderRoot.querySelectorAll('sl-paginator-page');

      expect(pages).to.exist;
      expect(pages.length).to.equal(8);

      const pagesLabels = Array.from(pages).map(page => page.textContent?.trim());

      expect(pagesLabels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8']);
    });

    it('should have a proper active page', () => {
      dataSource.update();
      expect(el.page).to.equal(2);
    });

    it('should set the right page on page click', async () => {
      const pages = el.renderRoot.querySelectorAll('sl-paginator-page');

      pages[3].click();
      await el.updateComplete;

      expect(el.page).to.equal(4);
      expect(el.dataSource?.page?.page).to.equal(4);
    });

    it('should set the next page on next button click', async () => {
      dataSource.update();
      const next = el.renderRoot.querySelector<Button>('sl-button.next');

      expect(next).to.exist;

      next!.click();
      await el.updateComplete;

      expect(el.page).to.equal(3);
      expect(el.dataSource?.page?.page).to.equal(3);
    });

    it('should set the previous page on prev button click', async () => {
      dataSource.update();
      const prev = el.renderRoot.querySelector<Button>('sl-button.prev');

      expect(prev).to.exist;

      prev!.click();
      await el.updateComplete;

      expect(el.page).to.equal(2);
      expect(el.dataSource?.page?.page).to.equal(2);
    });
  });
});
