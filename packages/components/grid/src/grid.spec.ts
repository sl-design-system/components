import '@sl-design-system/button/register.js';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import '@sl-design-system/menu/register.js';
import { type ToolBar } from '@sl-design-system/tool-bar';
import '@sl-design-system/tooltip/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { type SinonSpy, spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type Grid, type SlActiveRowChangeEvent } from './grid.js';
import { waitForGridToRenderData } from './utils.js';

type Person = { firstName: string; lastName: string; email?: string };
type Student = Person & { school: { id: number; name: string } };

describe('sl-grid', () => {
  let el: Grid<Person>;
  const multipleSelectItems = [
    { firstName: 'John', lastName: 'Doe' },
    { firstName: 'Jane', lastName: 'Smith' }
  ];

  const mountMultipleSelectGrid = async (bulkActions?: unknown): Promise<Grid<Person>> => {
    el = await fixture(html`
      <sl-grid .items=${multipleSelectItems}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        ${bulkActions}
      </sl-grid>
    `);

    await waitForGridToRenderData(el);

    return el;
  };

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' }
          ]}>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should not have the row-action property set', () => {
      expect(el).not.to.have.attribute('row-action');
      expect(el.rowAction).to.be.undefined;
    });

    it('should render a table with header and body', () => {
      const table = el.renderRoot.querySelector('table');

      expect(table).to.exist;
      expect(table).to.contain('thead');
      expect(table).to.contain('tbody');
    });

    it('should render column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col =>
        col.textContent?.trim()
      );

      expect(columns).to.deep.equal(['First name', 'Last name']);
    });

    it('should render table rows', () => {
      const rows = Array.from(el.renderRoot.querySelectorAll('tbody tr')).map(row =>
        Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim())
      );

      expect(rows).to.deep.equal([
        ['John', 'Doe'],
        ['Jane', 'Smith']
      ]);
    });

    it('should render aria-rowindex values starting at 1', () => {
      const rowIndices = Array.from(el.renderRoot.querySelectorAll('tbody tr')).map(row =>
        row.getAttribute('aria-rowindex')
      );

      expect(rowIndices).to.deep.equal(['1', '2']);
    });

    it('should not have aria-selected when no row action or selection is configured', () => {
      const rows = el.renderRoot.querySelectorAll<HTMLTableRowElement>('tbody tr');

      rows.forEach(row => {
        expect(row).not.to.have.attribute('aria-selected');
      });
    });
  });

  describe('multiple select', () => {
    beforeEach(async () => {
      await mountMultipleSelectGrid();
    });

    it('should toggle the "selected" part of the row when clicking in the selection column', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      const row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;
    });

    it('should not toggle the "selected" part of the row when clicking anywhere in the row', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      const selectedRow = el.renderRoot.querySelector<HTMLTableRowElement>(
        'tbody tr[part~="selected"]'
      );
      expect(selectedRow).to.be.null;
    });

    it('should support multiple selection by clicking different rows', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:last-of-type td[part~="selection"]')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      const rows = el.renderRoot.querySelectorAll<HTMLTableRowElement>(
        'tbody tr[part~="selected"]'
      );
      expect(rows).to.have.lengthOf(2);
    });

    it('should emit an sl-grid-selection-change event when the selection changes', () => {
      const onSelectionChange = spy();

      el.addEventListener('sl-grid-selection-change', onSelectionChange);

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:last-of-type td[part~="selection"]')
        ?.click();

      expect(onSelectionChange).to.have.been.calledTwice;
    });

    it('should call toggle() on the data source when a row is selected', () => {
      const toggleSpy = spy(el.dataSource!, 'toggle');

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();

      expect(toggleSpy).to.have.been.calledOnce;
      expect(toggleSpy.firstCall.args[0]).to.have.property('data', el.items?.at(0));
    });

    it('should set the selects property on the new data source when items are updated', async () => {
      const newItems = [
        { firstName: 'Alice', lastName: 'Johnson' },
        { firstName: 'Bob', lastName: 'Wilson' }
      ];

      el.items = newItems;
      await el.updateComplete;

      expect(el.dataSource?.selects).to.equal('multiple');
    });
  });

  describe('grouping', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .dataSource=${new ArrayListDataSource<Student>(
            [
              {
                firstName: 'John',
                lastName: 'Doe',
                school: { id: 1, name: 'School A' }
              },
              {
                firstName: 'Jane',
                lastName: 'Smith',
                school: { id: 2, name: 'School B' }
              }
            ],
            {
              groupBy: 'school.id',
              groupLabelPath: 'school.name'
            }
          )}>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should render aria-rowindex values for group and data rows', () => {
      const rowIndices = Array.from(el.renderRoot.querySelectorAll('tbody tr')).map(row =>
        row.getAttribute('aria-rowindex')
      );

      expect(rowIndices).to.deep.equal(['1', '2', '3', '4']);
    });
  });

  describe('single select', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' },
            { firstName: 'Alice', lastName: 'Johnson' }
          ]}
          selects="single"
          row-action="select">
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should have the selects property set to "single"', () => {
      expect(el.selects).to.equal('single');
      expect(el.dataSource?.selects).to.equal('single');
    });

    it('should set aria-selected="true" on the selected row', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      const row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type'),
        otherRow = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:nth-of-type(2)');

      expect(row).to.have.attribute('aria-selected', 'true');
      expect(otherRow).to.have.attribute('aria-selected', 'false');
    });

    it('should toggle the "selected" part of the row when clicking in the row', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      const row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;
    });

    it('should allow only one row to be selected at a time', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      let selectedRows = el.renderRoot.querySelectorAll<HTMLTableRowElement>(
        'tbody tr[part~="selected"]'
      );
      expect(selectedRows).to.have.lengthOf(1);

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:nth-of-type(2) td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      selectedRows = el.renderRoot.querySelectorAll<HTMLTableRowElement>(
        'tbody tr[part~="selected"]'
      );
      expect(selectedRows).to.have.lengthOf(1);

      const firstRow = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(firstRow?.part.contains('selected')).to.be.false;

      const secondRow = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:nth-of-type(2)');
      expect(secondRow?.part.contains('selected')).to.be.true;
    });

    it('should deselect a row when clicking it again', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      let row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.false;
    });

    it('should emit an sl-grid-selection-change event when the selection changes', () => {
      const onSelectionChange = spy();

      el.addEventListener('sl-grid-selection-change', onSelectionChange);

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:nth-of-type(2) td:last-of-type')
        ?.click();

      expect(onSelectionChange).to.have.been.calledTwice;
    });

    it('should call toggle() on the data source when a row is selected', () => {
      const toggleSpy = spy(el.dataSource!, 'toggle');

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();

      expect(toggleSpy).to.have.been.calledOnce;
      expect(toggleSpy.firstCall.args[0]).to.have.property('data', el.items?.at(0));
    });

    it('should set the selects property on the new data source when items are updated', async () => {
      const newItems = [
        { firstName: 'Alice', lastName: 'Johnson' },
        { firstName: 'Bob', lastName: 'Wilson' }
      ];

      el.items = newItems;
      await el.updateComplete;

      expect(el.dataSource?.selects).to.equal('single');
    });
  });

  describe('scrolling', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' }
          ]}
          style="inline-size: 320px">
          <sl-grid-selection-column sticky></sl-grid-selection-column>
          <sl-grid-sort-column grow="0" path="firstName" width="220"></sl-grid-sort-column>
          <sl-grid-sort-column grow="0" path="lastName" width="220"></sl-grid-sort-column>
          <sl-grid-sort-column grow="0" path="email" width="220"></sl-grid-sort-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should sync the body when the header is scrolled', () => {
      const thead = el.renderRoot.querySelector<HTMLTableSectionElement>('thead')!,
        tbody = el.renderRoot.querySelector<HTMLTableSectionElement>('tbody')!;

      thead.scrollLeft = 240;
      thead.dispatchEvent(new Event('scroll'));

      expect(tbody.scrollLeft).to.equal(thead.scrollLeft);
    });

    it('should sync the header when the body is scrolled', () => {
      const thead = el.renderRoot.querySelector<HTMLTableSectionElement>('thead')!,
        tbody = el.renderRoot.querySelector<HTMLTableSectionElement>('tbody')!;

      tbody.scrollLeft = 240;
      tbody.dispatchEvent(new Event('scroll'));

      expect(thead.scrollLeft).to.equal(tbody.scrollLeft);
    });
  });

  describe('row action activate', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' }
          ]}
          row-action="activate">
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should have the row-action property set to "activate"', () => {
      expect(el.rowAction).to.equal('activate');
    });

    it('should not have an active row by default', () => {
      const activeRow = el.renderRoot.querySelector('[part~="active"]');

      expect(activeRow).to.be.null;
      expect(el.activeRow).to.be.undefined;
    });

    it('should add the "active" part to the active row', async () => {
      el.activeRow = el.items!.at(1);
      await el.updateComplete;

      const row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type');
      expect(row?.part.contains('active')).to.be.true;
    });

    it('should toggle the "active" part of the row when clicking in the row', async () => {
      const tbody = el.renderRoot.querySelector('tbody')!;

      tbody.querySelector<HTMLTableRowElement>('tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(tbody.querySelector<HTMLTableRowElement>('tr:last-of-type')).to.match(
        '[part~="active"]'
      );
      expect(el.activeRow).to.deep.equal(el.items!.at(1));

      tbody.querySelector<HTMLTableRowElement>('tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(tbody.querySelector<HTMLTableRowElement>('tr:last-of-type')).to.not.match(
        '[part~="active"]'
      );
      expect(el.activeRow).to.be.undefined;
    });

    it('should emit an sl-grid-active-row-change event when clicking in the row', async () => {
      const onActiveRowChange = spy() as SinonSpy<[SlActiveRowChangeEvent], void>;

      el.addEventListener('sl-grid-active-row-change', onActiveRowChange);
      el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onActiveRowChange).to.have.been.calledOnce;
      expect(onActiveRowChange.firstCall.args[0].detail).to.deep.equal(el.items!.at(1));
    });

    it('should set aria-selected="true" on the active row', async () => {
      el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type'),
        otherRow = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');

      expect(row).to.have.attribute('aria-selected', 'true');
      expect(otherRow).to.have.attribute('aria-selected', 'false');
    });

    it('should set aria-selected="false" when deactivating', async () => {
      el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      let row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type');

      expect(row).to.have.attribute('aria-selected', 'true');

      row?.click();
      await new Promise(resolve => setTimeout(resolve));

      row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type');

      expect(row).to.have.attribute('aria-selected', 'false');
    });

    it('should dispatch sl-announce event when activating a row', async () => {
      const announceSpy = spy();
      document.body.addEventListener('sl-announce', announceSpy);

      el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(announceSpy).to.have.been.calledOnce;

      const event = announceSpy.firstCall.args[0] as CustomEvent<{
        message: string;
        urgency: string;
      }>;

      expect(event.detail.message).to.equal('Row 3 activated');
      expect(event.detail.urgency).to.equal('polite');

      document.body.removeEventListener('sl-announce', announceSpy);
    });

    it('should dispatch sl-announce event when deactivating a row', async () => {
      el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const announceSpy = spy();
      document.body.addEventListener('sl-announce', announceSpy);
      el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(announceSpy).to.have.been.calledOnce;

      const event = announceSpy.firstCall.args[0] as CustomEvent<{
        message: string;
        urgency: string;
      }>;

      expect(event.detail.message).to.equal('Row 3 deactivated');
      expect(event.detail.urgency).to.equal('polite');

      document.body.removeEventListener('sl-announce', announceSpy);
    });

    it('should dispatch sl-announce with force=true when focusing into an active row', async () => {
      el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const tbody = el.renderRoot.querySelector('tbody')!;
      tbody.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve));

      const announceSpy = spy();
      document.body.addEventListener('sl-announce', announceSpy);

      const td = el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td');
      td?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve));

      expect(announceSpy).to.have.been.calledOnce;

      const event = announceSpy.firstCall.args[0] as CustomEvent<{
        message: string;
        urgency: string;
        force: boolean;
      }>;

      expect(event.detail.message).to.equal('In activated row 2');
      expect(event.detail.urgency).to.equal('assertive');
      expect(event.detail.force).to.be.true;

      document.body.removeEventListener('sl-announce', announceSpy);
    });

    it('should keep sticky active row cells opaque', async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' }
          ]}
          row-action="activate"
          style="
            --sl-elevation-surface-raised-default: rgb(255 255 255);
            --sl-color-background-input-interactive: rgb(0 0 0);
            --sl-color-background-selected-interactive-plain: rgb(0 80 160);
            --sl-color-background-selected-subtlest: transparent;
            --sl-opacity-interactive-plain-idle: 0.1;
          ">
          <sl-grid-column path="firstName" sticky></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      el.activeRow = el.items!.at(0);
      await el.updateComplete;

      const cell = el.renderRoot.querySelector<HTMLTableCellElement>(
        'tbody tr:first-of-type td.sticky-start-first'
      );

      expect(cell).to.exist;

      const style = getComputedStyle(cell!);

      expect(style.backgroundColor).to.equal('rgb(255, 255, 255)');
      expect(style.backgroundImage).to.contain('linear-gradient');
    });
  });

  describe('row action select', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' }
          ]}
          row-action="select">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should toggle the "selected" part of the row when clicking in the selection column', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      let row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.false;
    });

    it('should toggle the "selected" part of the row when clicking anywhere in the row', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      let row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.false;
    });

    it('should support multiple selection by clicking different rows', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:last-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      const rows = el.renderRoot.querySelectorAll<HTMLTableRowElement>(
        'tbody tr[part~="selected"]'
      );
      expect(rows).to.have.lengthOf(2);
    });

    it('should emit an sl-grid-selection-change event when the selection changes', () => {
      const onSelectionChange = spy();

      el.addEventListener('sl-grid-selection-change', onSelectionChange);

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:last-of-type td:last-of-type')
        ?.click();

      expect(onSelectionChange).to.have.been.calledTwice;
    });

    it('should call toggle() on the data source when a row is selected', () => {
      const toggleSpy = spy(el.dataSource!, 'toggle');

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();

      expect(toggleSpy).to.have.been.calledOnce;
      expect(toggleSpy.firstCall.args[0]).to.have.property('data', el.items?.at(0));
    });

    it('should dispatch sl-announce event when selecting a row', async () => {
      const announceSpy = spy();
      document.body.addEventListener('sl-announce', announceSpy);

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(announceSpy).to.have.been.calledOnce;

      const event = announceSpy.firstCall.args[0] as CustomEvent<{
        message: string;
        urgency: string;
      }>;
      expect(event.detail.message).to.equal('Row 2 activated');
      expect(event.detail.urgency).to.equal('polite');

      document.body.removeEventListener('sl-announce', announceSpy);
    });

    it('should dispatch sl-announce event when deselecting a row', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      const announceSpy = spy();
      document.body.addEventListener('sl-announce', announceSpy);

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')
        ?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(announceSpy).to.have.been.calledOnce;

      const event = announceSpy.firstCall.args[0] as CustomEvent<{
        message: string;
        urgency: string;
      }>;
      expect(event.detail.message).to.equal('Row 2 deactivated');
      expect(event.detail.urgency).to.equal('polite');

      document.body.removeEventListener('sl-announce', announceSpy);
    });
  });

  describe('bulk actions', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          style="inline-size: 1200px"
          .items=${[
            { firstName: 'Sophie', lastName: 'Müller', email: 'sophie.muller@school1.edu' },
            { firstName: 'Luca', lastName: 'van Dijk', email: 'luca.vandijk@school4.edu' },
            { firstName: 'Clara', lastName: 'de Vries', email: 'clara.devries@school4.edu' }
          ]}>
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted"
            >Duplicate to workspace</sl-button
          >
          <sl-button fill="outline" slot="bulk-actions" variant="inverted"
            >Move to folder</sl-button
          >
          <sl-menu-button slot="bulk-actions" variant="inverted" fill="outline">
            <span slot="button">More actions</span>
            <sl-menu-item>Export as PDF</sl-menu-item>
            <sl-menu-item>Archive selected</sl-menu-item>
          </sl-menu-button>
          <sl-button fill="outline" slot="bulk-actions" variant="inverted"
            >Assign to learning pathway</sl-button
          >
          <sl-button fill="outline" slot="bulk-actions" variant="inverted">Delete</sl-button>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should show the bulk-actions when rows are selected', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const popover = el.renderRoot.querySelector<HTMLElement>('[part="bulk-actions"]');

      expect(popover).to.match(':popover-open');
    });

    it('should not overflow bulk-action buttons when there is enough space', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const toolBar = el.renderRoot.querySelector<ToolBar>('sl-tool-bar');

      expect(toolBar).to.exist;
      expect(toolBar!.menuItems.length).to.equal(0);
      expect(toolBar!.items.filter(item => item.visible).length).to.equal(5);
    });

    it('should move bulk-action buttons into the overflow menu when the grid is narrow', async () => {
      el.style.inlineSize = '250px';
      await new Promise(resolve => setTimeout(resolve, 100));

      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      await new Promise(resolve => setTimeout(resolve, 150));

      const toolBar = el.renderRoot.querySelector<ToolBar>('sl-tool-bar');

      expect(toolBar).to.exist;
      expect(toolBar!.menuItems.length).to.equal(5);
    });

    it('should restore visible bulk-action buttons when the grid grows back', async () => {
      el.renderRoot
        .querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')
        ?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      el.style.inlineSize = '250px';
      await new Promise(resolve => setTimeout(resolve, 150));

      const toolBar = el.renderRoot.querySelector<ToolBar>('sl-tool-bar');

      expect(toolBar).to.exist;
      expect(toolBar!.menuItems.length).to.equal(5);

      el.style.inlineSize = '1200px';
      await new Promise(resolve => setTimeout(resolve, 500));

      expect(toolBar!.menuItems.length).to.equal(0);
      expect(toolBar!.items.filter(item => item.visible).length).to.equal(5);
    });
  });
});
