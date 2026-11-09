import { ArrayListDataSource, FetchListDataSource } from '@sl-design-system/data-source';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { type Grid } from './grid.js';
import './register.js';

interface Student {
  name: string;
  grade: number;
  present: boolean;
}

const students: Student[] = [
  { name: 'Ann', grade: 6, present: true },
  { name: 'Ben', grade: 8, present: true },
  { name: 'Cleo', grade: 4, present: false },
  { name: 'Dan', grade: 7, present: true },
  { name: 'Eve', grade: 5, present: false }
];

const wait = async (el: Grid): Promise<void> => {
  await el.updateComplete;
  await new Promise(resolve => setTimeout(resolve, 150));
  await el.updateComplete;
};

describe('sl-grid summary row', () => {
  let el: Grid<Student>;

  const getCells = (selector = 'tr[part~="summary-row"]'): string[] =>
    Array.from(el.renderRoot.querySelectorAll(`${selector} td`)).map(cell => {
      // The text of the format menu is not part of the total
      const clone = cell.cloneNode(true) as HTMLElement;

      clone.querySelectorAll('sl-menu-button').forEach(menu => menu.remove());

      return clone.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name" summary-type="text" summary-label="students"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number"></sl-grid-column>
          <sl-grid-column path="present" summary-type="boolean"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);
    });

    it('should render the summary row in the footer by default', () => {
      expect(el.renderRoot.querySelector('tfoot tr[part~="summary-row"]')).to.exist;
      expect(el.renderRoot.querySelector('thead tr[part~="summary-row"]')).not.to.exist;
    });

    it('should show the totals per column type', () => {
      expect(getCells()).to.deep.equal(['5 students', '30', '3 / 5']);
    });

    it('should have a summary part on each cell', () => {
      const cells = el.renderRoot.querySelectorAll('tr[part~="summary-row"] td');

      expect(cells).to.have.length(3);
      cells.forEach(cell => expect(cell.getAttribute('part')).to.contain('summary'));
    });

    it('should link each cell to its column header', () => {
      const header = el.renderRoot.querySelector('th')!,
        cell = el.renderRoot.querySelector('tr[part~="summary-row"] td')!;

      expect(cell.getAttribute('headers')).to.equal(header.id);
    });

    it('should place the summary row at the top when summary-position is top', async () => {
      el.summaryPosition = 'top';
      await wait(el);

      expect(el.renderRoot.querySelector('thead tr[part~="summary-row"]')).to.exist;
      expect(el.renderRoot.querySelector('tfoot tr[part~="summary-row"]')).not.to.exist;
    });

    it('should show the totals when the position is top', async () => {
      el.summaryPosition = 'top';
      await wait(el);

      expect(getCells()).to.deep.equal(['5 students', '30', '3 / 5']);
    });

    it('should use the sunken surface as background', () => {
      const cell = el.renderRoot.querySelector('tr[part~="summary-row"] td')!;

      expect(getComputedStyle(cell).backgroundColor).not.to.equal('rgba(0, 0, 0, 0)');
    });
  });

  describe('automatic format menu', () => {
    const menus = (): HTMLElement[] =>
      Array.from(
        el.renderRoot.querySelectorAll<HTMLElement>('tr[part~="summary-row"] sl-menu-button')
      );

    it('should show the format menu in the first summary cell when there are boolean totals', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name" summary-type="text"></sl-grid-column>
          <sl-grid-column path="present" summary-type="boolean"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      expect(menus()).to.have.length(1);
      expect(el.renderRoot.querySelector('tr[part~="summary-row"] td:first-child sl-menu-button'))
        .to.exist;
    });

    it('should not show a menu without boolean totals', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name" summary-type="text"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      expect(menus()).to.have.length(0);
    });

    it('should not show a menu when all boolean totals have a fixed format', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name" summary-type="text"></sl-grid-column>
          <sl-grid-column
            path="present"
            summary-type="boolean"
            summary-format="count"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      expect(menus()).to.have.length(0);
    });

    it('should only use the columns that ask for a menu when summary-menu is set', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name" summary-type="text"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number" summary-menu></sl-grid-column>
          <sl-grid-column path="present" summary-type="boolean"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      expect(menus()).to.have.length(1);
      expect(el.renderRoot.querySelector('tr[part~="summary-row"] td:nth-child(2) sl-menu-button'))
        .to.exist;
    });
  });

  describe('without a summary', () => {
    it('should not render a summary row when no column has a summary configured', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name"></sl-grid-column>
          <sl-grid-column path="grade"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      expect(el.renderRoot.querySelector('tr[part~="summary-row"]')).not.to.exist;
    });

    it('should show a dash in columns without a summary', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      expect(getCells()).to.deep.equal(['-', '30']);
    });
  });

  describe('formats', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name" summary-type="text" summary-menu></sl-grid-column>
          <sl-grid-column
            path="grade"
            summary-type="number"
            summary-format="average"></sl-grid-column>
          <sl-grid-column path="present" summary-type="boolean"></sl-grid-column>
          <sl-grid-column
            path="present"
            summary-type="boolean"
            summary-format="count"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);
    });

    it('should show averages with a label', () => {
      expect(getCells()[1]).to.match(/^avg\.\s*6/);
    });

    it('should apply the grid format to boolean columns without a fixed format', async () => {
      el.summaryFormat = 'percentage';
      await wait(el);

      expect(getCells().slice(2)).to.deep.equal(['60%', '3']);
    });

    it('should not change a fixed format when the grid format changes', async () => {
      el.summaryFormat = 'percentage';
      await wait(el);

      expect(getCells()[3]).to.equal('3');
    });

    it('should render a format menu with the available formats', () => {
      const items = el.renderRoot.querySelectorAll('tr[part~="summary-row"] sl-menu-item');

      expect(Array.from(items).map(item => item.textContent?.trim())).to.deep.equal([
        'Fractions',
        'Count',
        'Percentage'
      ]);
    });

    it('should mark the current format in the menu', () => {
      const selected = el.renderRoot.querySelector(
        'tr[part~="summary-row"] sl-menu-item[selected]'
      );

      expect(selected?.textContent?.trim()).to.equal('Fractions');
    });

    it('should change the format of the compatible columns when selecting a menu item', async () => {
      const item = el.renderRoot.querySelectorAll<HTMLElement>(
        'tr[part~="summary-row"] sl-menu-item'
      )[2];

      item.click();
      await wait(el);

      expect(el.summaryFormat).to.equal('percentage');
      expect(getCells()[2]).to.equal('60%');
    });

    it('should have an accessible name for the menu', () => {
      const button = el.renderRoot.querySelector('tr[part~="summary-row"] sl-menu-button'),
        native = button?.shadowRoot
          ?.querySelector('sl-button')
          ?.shadowRoot?.querySelector('button');

      // The aria-label is forwarded to the native button inside the menu button
      expect(native?.getAttribute('aria-label')).to.equal('Summary format');
    });
  });

  describe('custom content', () => {
    it('should use a string as summary', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="name" .summary=${'Total'}></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      expect(getCells()).to.deep.equal(['Total', '30']);
    });

    it('should use a renderer with the totals', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column
            path="grade"
            summary-type="number"
            .summary=${(totals?: { sum: number }) => `Sum: ${totals?.sum}`}></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      expect(getCells()).to.deep.equal(['Sum: 30']);
    });
  });

  describe('pagination and filtering', () => {
    let ds: ArrayListDataSource<Student>;

    beforeEach(async () => {
      ds = new ArrayListDataSource(students, { pagination: true, pageSize: 2 });

      el = await fixture(html`
        <sl-grid .dataSource=${ds}>
          <sl-grid-column path="name" summary-type="text" summary-label="students"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number"></sl-grid-column>
        </sl-grid>
      `);
      await wait(el);
    });

    it('should calculate the totals over all pages', () => {
      expect(getCells()).to.deep.equal(['5 students (on the Grid)', '30']);
    });

    it('should not change the totals when the page changes', async () => {
      ds.setPage(1);
      await wait(el);

      expect(getCells()).to.deep.equal(['5 students (on the Grid)', '30']);
    });

    it('should not change the totals when the page size changes', async () => {
      ds.setPageSize(3);
      await wait(el);

      expect(getCells()).to.deep.equal(['5 students (on the Grid)', '30']);
    });

    it('should not change the totals when sorting', async () => {
      ds.setSort('grade', 'desc');
      ds.update();
      await wait(el);

      expect(getCells()).to.deep.equal(['5 students (on the Grid)', '30']);
    });

    it('should recalculate when a filter changes', async () => {
      ds.addFilter('present', item => item.present);
      ds.update();
      await wait(el);

      expect(getCells()).to.deep.equal(['3 students (on the Grid)', '21']);
    });

    it('should only use the current page when summary-scope is page', async () => {
      el.summaryScope = 'page';
      await wait(el);

      expect(getCells()).to.deep.equal(['2 students (Page total)', '14']);
    });
  });

  describe('grouping', () => {
    it('should not count group rows', async () => {
      const ds = new ArrayListDataSource(students, { groupBy: 'present' });

      el = await fixture(html`
        <sl-grid .dataSource=${ds}>
          <sl-grid-column path="name" summary-type="text"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number"></sl-grid-column>
        </sl-grid>
      `);
      await wait(el);

      expect(getCells()).to.deep.equal(['5', '30']);
    });
  });

  describe('fetch data source', () => {
    it('should use the totals returned by the fetch callback', async () => {
      const ds = new FetchListDataSource<Student>({
        pageSize: 2,
        fetchPage: ({ page, pageSize }) =>
          Promise.resolve({
            items: students.slice(page * pageSize, page * pageSize + pageSize),
            summary: {
              grade: {
                evaluated: 5,
                nonEmpty: 5,
                sum: 30,
                totalRecords: 5,
                trueCount: 0
              }
            },
            totalItems: students.length
          })
      });

      el = await fixture(html`
        <sl-grid .dataSource=${ds}>
          <sl-grid-column path="name"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number"></sl-grid-column>
        </sl-grid>
      `);
      await wait(el);

      expect(ds.summary).to.exist;
      expect(getCells()).to.deep.equal(['-', '30']);
    });

    it('should show a dash while no totals are available', async () => {
      const ds = new FetchListDataSource<Student>({
        pageSize: 2,
        fetchPage: () => new Promise(() => {})
      });

      el = await fixture(html`
        <sl-grid .dataSource=${ds}>
          <sl-grid-column path="grade" summary-type="number"></sl-grid-column>
        </sl-grid>
      `);
      await wait(el);

      expect(getCells()).to.deep.equal(['-']);
    });
  });

  describe('scrolling', () => {
    it('should keep the horizontal scrollbar below the summary row', async () => {
      el = await fixture(html`
        <sl-grid style="inline-size: 200px">
          <sl-grid-column path="name" summary-type="text" width="200"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number" width="200"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      const summary = el.renderRoot.querySelector('tfoot tr[part~="summary-row"]')!,
        scrollbar = el.renderRoot.querySelector('tfoot tr.scrollbar')!;

      expect(scrollbar).to.exist;
      expect(summary.compareDocumentPosition(scrollbar) & Node.DOCUMENT_POSITION_FOLLOWING).to.be
        .ok;
    });

    it('should scroll the summary row with the body', async () => {
      el = await fixture(html`
        <sl-grid style="inline-size: 200px">
          <sl-grid-column path="name" summary-type="text" width="200"></sl-grid-column>
          <sl-grid-column path="grade" summary-type="number" width="200"></sl-grid-column>
        </sl-grid>
      `);
      el.items = students;
      await wait(el);

      el.tbody.scrollLeft = 80;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el.tfoot.scrollLeft).to.equal(el.tbody.scrollLeft);
    });
  });
});
