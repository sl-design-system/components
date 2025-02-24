import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { ArrayListDataSource, type ListDataSource } from '@sl-design-system/data-source';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import { spy, stub } from 'sinon';
import '../register.js';
import { Paginator } from './paginator.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-paginator', () => {
  let el: Paginator;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator total-items="200"></sl-paginator>`);
    });

    it('should ignore negative page values', async () => {
      el.page = -10;
      await el.updateComplete;

      expect(el.page).to.equal(0);
    });

    it('should ignore page values greater than the total number of pages', async () => {
      el.page = 100;
      await el.updateComplete;

      expect(el.page).to.equal(19);
    });

    it('should have a disabled previous button', () => {
      const button = el.renderRoot.querySelector(':nth-child(1 of sl-button.nav)');

      expect(button).to.exist;
      expect(button).to.have.attribute('aria-label', 'Go to the previous page (0)');
      expect(button).to.match(':disabled');
    });

    it('should enable the previous button when the current page is not the first', async () => {
      el.page = 1;
      await el.updateComplete;

      const button = el.renderRoot.querySelector(':nth-child(1 of sl-button.nav)');

      expect(button).to.exist;
      expect(button).not.to.match(':disabled');
    });

    it('should have a enabled next button', () => {
      const button = el.renderRoot.querySelector(':nth-child(2 of sl-button.nav)');

      expect(button).to.exist;
      expect(button).to.have.attribute('aria-label', 'Go to the next page (2)');
      expect(button).not.to.match(':disabled');
    });

    it('should disable the next button when the current page is the last', async () => {
      el.page = 19;
      await el.updateComplete;

      const button = el.renderRoot.querySelector(':nth-child(2 of sl-button.nav)');

      expect(button).to.exist;
      expect(button).to.match(':disabled');
    });

    it('should have the current page set to the first page', () => {
      const button = el.renderRoot.querySelector('sl-button[aria-current="page"]');

      expect(button).to.exist;
      expect(button).to.have.trimmed.text('1');
      expect(button).to.match('.current');
    });

    it('should have a page size of 10', () => {
      const buttons = el.renderRoot.querySelectorAll('sl-button.page'),
        labels = Array.from(buttons).map(button => button.textContent?.trim());

      expect(el.pageSize).to.equal(10);
      expect(buttons).to.have.lengthOf(20);
      expect(labels).to.deep.equal(Array.from({ length: 20 }).map((_, i) => `${i + 1}`));
    });

    it('should only show 10 pages', () => {
      const buttons = Array.from(el.renderRoot.querySelectorAll<Button>('sl-button.page')).filter(
        button => button.style.display !== 'none'
      );

      const labels = buttons.map(button => button.textContent?.trim());

      expect(buttons).to.have.lengthOf(10);
      expect(labels).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '20']);
    });

    it('should have a select element with all the pages', () => {
      const select = el.renderRoot.querySelector('sl-select'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        options = Array.from(select?.querySelectorAll('sl-option') ?? []).map(o => o.value);

      expect(select).to.exist;
      expect(options).to.have.lengthOf(20);
      expect(options).to.deep.equal(Array.from({ length: 20 }).map((_, i) => i));
    });

    it('should have a menu button with hidden pages before the last page if the current page is near the start', () => {
      const menuButton = el.renderRoot.querySelector('sl-menu-button'),
        pages = Array.from(menuButton?.querySelectorAll('sl-menu-item') ?? []).map(o => o.textContent?.trim());

      expect(menuButton).to.exist;
      expect(pages).to.have.lengthOf(10);
      expect(pages).to.deep.equal(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19']);
    });

    it('should have a menu button with hidden pages after the first page if the current page is near the end', async () => {
      el.page = 19;
      await el.updateComplete;

      const menuButton = el.renderRoot.querySelector('sl-menu-button'),
        pages = Array.from(menuButton?.querySelectorAll('sl-menu-item') ?? []).map(o => o.textContent?.trim());

      expect(menuButton).to.exist;
      expect(pages).to.have.lengthOf(10);
      expect(pages).to.deep.equal(['2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
    });

    it('should have two menu buttons with hidden pages if the current page is in the middle', async () => {
      el.page = 10;
      await el.updateComplete;

      const menuButtons = Array.from(el.renderRoot.querySelectorAll('sl-menu-button')),
        startPages = Array.from(menuButtons[0].querySelectorAll('sl-menu-item')).map(o => o.textContent?.trim()),
        endPages = Array.from(menuButtons[1].querySelectorAll('sl-menu-item')).map(o => o.textContent?.trim());

      expect(menuButtons).to.have.lengthOf(2);
      expect(startPages).to.deep.equal(['2', '3', '4', '5', '6', '7']);
      expect(endPages).to.deep.equal(['15', '16', '17', '18', '19']);
    });

    it('should increment the current page when the next button is clicked', async () => {
      const button = el.renderRoot.querySelector<Button>(':nth-child(2 of sl-button.nav)');

      button?.click();
      await el.updateComplete;

      expect(el.page).to.equal(1);

      const currentPage = el.renderRoot.querySelector('sl-button[aria-current="page"]');
      expect(currentPage).to.have.trimmed.text('2');
      expect(currentPage).to.match('.current');
    });

    it('should update the current page when a page button is clicked', async () => {
      el.renderRoot.querySelector<Button>(':nth-child(3 of sl-button.page)')?.click();
      await el.updateComplete;

      expect(el.page).to.equal(2);

      const currentPage = el.renderRoot.querySelector('sl-button[aria-current="page"]');
      expect(currentPage).to.have.trimmed.text('3');
      expect(currentPage).to.match('.current');
    });

    it('should update the current page when a menu item is clicked', async () => {
      el.renderRoot.querySelector('sl-menu-item')?.click();
      await el.updateComplete;

      expect(el.page).to.equal(9);

      const currentPage = el.renderRoot.querySelector('sl-button[aria-current="page"]');
      expect(currentPage).to.have.trimmed.text('10');
      expect(currentPage).to.match('.current');
    });

    it('should update the current page when the page property is changed', async () => {
      el.page = 5;
      await el.updateComplete;

      const currentPage = el.renderRoot.querySelector('sl-button[aria-current="page"]');
      expect(currentPage).to.have.trimmed.text('6');
      expect(currentPage).to.match('.current');
    });

    it('should decrement the current page when the previous button is clicked', async () => {
      el.page = 10;
      await el.updateComplete;

      el.renderRoot.querySelector<Button>(':nth-child(1 of sl-button.nav')?.click();
      await el.updateComplete;

      expect(el.page).to.equal(9);

      const currentPage = el.renderRoot.querySelector('sl-button[aria-current="page"]');
      expect(currentPage).to.have.trimmed.text('10');
      expect(currentPage).to.match('.current');
    });

    it('should emit an sl-page-change event when the page has changed', async () => {
      const onPageChange = spy();

      el.addEventListener('sl-page-change', onPageChange);
      el.renderRoot.querySelector<Button>(':nth-child(5 of sl-button.page)')?.click();
      await el.updateComplete;

      expect(onPageChange).to.have.been.calledOnce;
      expect(onPageChange).to.have.been.calledWithMatch({ detail: 4 });
    });
  });

  describe('announcement', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-paginator page="5" total-items="200"></sl-paginator>`);
    });

    it('should announce the current page after clicking the previous button', async () => {
      const announce = spy();
      document.body.addEventListener('sl-announce', announce);

      el.renderRoot.querySelector<Button>(':nth-child(1 of sl-button.nav)')?.click();
      await el.updateComplete;

      expect(announce).to.have.been.calledOnce;
      expect(announce).to.have.been.calledWithMatch({ detail: { message: 'Page 5 of 20' } });
    });

    it('should announce the current page after clicking the next button', async () => {
      const announce = spy();
      document.body.addEventListener('sl-announce', announce);

      el.renderRoot.querySelector<Button>(':nth-child(2 of sl-button.nav)')?.click();
      await el.updateComplete;

      expect(announce).to.have.been.calledOnce;
      expect(announce).to.have.been.calledWithMatch({ detail: { message: 'Page 7 of 20' } });
    });
  });

  describe('dataSource', () => {
    let ds: ListDataSource;

    beforeEach(async () => {
      ds = new ArrayListDataSource(Array.from({ length: 80 }, (_, index) => ({ nr: index + 1 })));

      el = await fixture(html`<sl-paginator .dataSource=${ds}></sl-paginator>`);
    });

    it('should have sane defaults', () => {
      expect(el.page).to.equal(0);
      expect(el.pageSize).to.equal(10);
      expect(el.totalItems).to.equal(80);
    });

    it('should update the paginator when the data source changes', async () => {
      ds.setPage(5);
      ds.setPageSize(15);
      ds.update();
      await el.updateComplete;

      expect(el.page).to.equal(5);
      expect(el.pageSize).to.equal(15);

      const currentPage = el.renderRoot.querySelector('sl-button[aria-current="page"]');
      expect(currentPage).to.have.trimmed.text('6');
    });

    it('should update the data source when the current page changes', async () => {
      el.renderRoot.querySelector<Button>(':nth-child(2 of sl-button.nav)')?.click();
      await el.updateComplete;

      expect(ds.page).to.equal(1);
    });

    it('should set the current page to the first page when the page size changes', async () => {
      ds.setPageSize(5);
      ds.update();
      await el.updateComplete;

      expect(el.page).to.equal(0);
    });

    it('should set the current page to the first page when the size has changed', async () => {
      stub(ds, 'size').get(() => 100);

      ds.update();
      await el.updateComplete;

      expect(el.page).to.equal(0);
    });

    it('should announce the current page when the page size has changed', async () => {
      const announce = spy();
      document.body.addEventListener('sl-announce', announce);

      ds.setPageSize(5);
      ds.update();
      await el.updateComplete;

      expect(announce).to.have.been.calledOnce;
      expect(announce).to.have.been.calledWithMatch({ detail: { message: 'Page 1 of 16' } });
    });

    it('should announce the current page when the size has changed', async () => {
      const announce = spy();
      document.body.addEventListener('sl-announce', announce);

      stub(ds, 'size').get(() => 100);
      ds.update();
      await el.updateComplete;

      expect(announce).to.have.been.calledOnce;
      expect(announce).to.have.been.calledWithMatch({ detail: { message: 'Page 1 of 10' } });
    });
  });

  describe('size', () => {
    it('should have a large size when there is enough space', async () => {
      el = await fixture(html`<sl-paginator total-items="200"></sl-paginator>`);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el).to.have.attribute('size', 'lg');
      expect(el.width).to.equal('lg');
    });

    // TODO: size tests

    it('should have a medium size when there is limited space', async () => {
      el = await fixture(html`<sl-paginator total-items="200" style="inline-size: 500px;"></sl-paginator>`);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el).to.have.attribute('size', 'md');
      expect(el.width).to.equal('md');
    });

    it('should have a small size when there is very limited space', async () => {
      el = await fixture(html`<sl-paginator total-items="200" style="inline-size: 450px;"></sl-paginator>`);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el).to.have.attribute('size', 'sm');
      expect(el.width).to.equal('sm');
    });

    it('should have an extra small size when there is very limited space', async () => {
      el = await fixture(html`<sl-paginator total-items="200" style="inline-size: 400px;"></sl-paginator>`);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el).to.have.attribute('size', 'xs');
      expect(el.width).to.equal('xs');
    });

    it('should not grow larger than the initial set size', async () => {
      el = await fixture(html`<sl-paginator total-items="200" size="md"></sl-paginator>`);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el).to.have.attribute('size', 'md');
      expect(el.width).to.equal('md');
    });

    it('should shrink smaller than the initial set size', async () => {
      el = await fixture(html`<sl-paginator total-items="200" size="md" style="inline-size: 400px;"></sl-paginator>`);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el).to.have.attribute('size', 'xs');
      expect(el.width).to.equal('xs');
    });

    describe('visible pages', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-paginator total-items="200"></sl-paginator>`);

        await new Promise(resolve => setTimeout(resolve, 100));
      });

      it('should display 10 pages when the size is lg', () => {
        const buttons = Array.from(el.renderRoot.querySelectorAll<Button>('sl-button.page')).filter(
          button => button.style.display !== 'none'
        );

        expect(buttons).to.have.lengthOf(10);
      });

      it('should display 8 pages when the size is md', async () => {
        el.width = 'md';
        await el.updateComplete;

        const buttons = Array.from(el.renderRoot.querySelectorAll<Button>('sl-button.page')).filter(
          button => button.style.display !== 'none'
        );

        expect(buttons).to.have.lengthOf(8);
      });

      it('should display 6 pages when the size is sm', async () => {
        el.width = 'sm';
        await el.updateComplete;

        const buttons = Array.from(el.renderRoot.querySelectorAll<Button>('sl-button.page')).filter(
          button => button.style.display !== 'none'
        );

        expect(buttons).to.have.lengthOf(6);
      });

      it('should display the select instead when the size is xs', async () => {
        const wrapper = el.renderRoot.querySelector('.wrapper')!;

        // expect(wrapper).not.to.be.displayed;
        expect(getComputedStyle(wrapper).display).to.equal('none');

        el.width = 'xs';
        await el.updateComplete;

        // expect(wrapper).to.be.displayed;
        expect(getComputedStyle(wrapper).display).not.to.equal('none');
      });

      it('should not show any buttons when the size is xs', async () => {
        el.width = 'xs';
        await el.updateComplete;

        const buttons = Array.from(el.renderRoot.querySelectorAll<Button>('sl-button')).filter(
          b => getComputedStyle(b).display !== 'none'
        );

        expect(buttons).to.have.lengthOf(0);
      });
    });
  });
});
