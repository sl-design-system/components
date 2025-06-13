import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { type SinonSpy, spy } from 'sinon';
import '../register.js';
import { type Grid, type SlActiveRowChangeEvent } from './grid.js';
import { waitForGridToRenderData } from './utils.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach, { suppressErrorLogging: true });

type Person = { firstName: string; lastName: string };

describe('sl-grid', () => {
  let el: Grid<Person>;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' }
          ]}
        >
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
      const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col => col.textContent?.trim());

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
  });

  describe('multiple select', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' }
          ]}
        >
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should toggle the "selected" part of the row when clicking in the selection column', async () => {
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;
    });

    it('should not toggle the "selected" part of the row when clicking anywhere in the row', async () => {
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const selectedRow = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr[part~="selected"]');
      expect(selectedRow).to.be.null;
    });

    it('should support multiple selection by clicking different rows', async () => {
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:last-of-type td[part~="selection"]')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const rows = el.renderRoot.querySelectorAll<HTMLTableRowElement>('tbody tr[part~="selected"]');
      expect(rows).to.have.lengthOf(2);
    });

    it('should emit an sl-grid-selection-change event when the selection changes', () => {
      const onSelectionChange = spy();

      el.addEventListener('sl-grid-selection-change', onSelectionChange);

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:last-of-type td[part~="selection"]')?.click();

      expect(onSelectionChange).to.have.been.calledTwice;
    });

    it('should call toggle() on the data source when a row is selected', () => {
      const toggleSpy = spy(el.dataSource!, 'toggle');

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();

      expect(toggleSpy).to.have.been.calledOnce;
      expect(toggleSpy.firstCall.args[0]).to.have.property('data', el.items?.at(0));
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
          row-action="activate"
        >
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

      expect(tbody.querySelector<HTMLTableRowElement>('tr:last-of-type')).to.match('[part~="active"]');
      expect(el.activeRow).to.deep.equal(el.items!.at(1));

      tbody.querySelector<HTMLTableRowElement>('tr:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(tbody.querySelector<HTMLTableRowElement>('tr:last-of-type')).to.not.match('[part~="active"]');
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
  });

  describe('row action select', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' }
          ]}
          row-action="select"
        >
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should toggle the "selected" part of the row when clicking in the selection column', async () => {
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      await new Promise(resolve => setTimeout(resolve));

      let row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      await new Promise(resolve => setTimeout(resolve));

      row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.false;
    });

    it('should toggle the "selected" part of the row when clicking anywhere in the row', async () => {
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      let row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.false;
    });

    it('should support multiple selection by clicking different rows', async () => {
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:last-of-type td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const rows = el.renderRoot.querySelectorAll<HTMLTableRowElement>('tbody tr[part~="selected"]');
      expect(rows).to.have.lengthOf(2);
    });

    it('should emit an sl-grid-selection-change event when the selection changes', () => {
      const onSelectionChange = spy();

      el.addEventListener('sl-grid-selection-change', onSelectionChange);

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:last-of-type td:last-of-type')?.click();

      expect(onSelectionChange).to.have.been.calledTwice;
    });

    it('should call toggle() on the data source when a row is selected', () => {
      const toggleSpy = spy(el.dataSource!, 'toggle');

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();

      expect(toggleSpy).to.have.been.calledOnce;
      expect(toggleSpy.firstCall.args[0]).to.have.property('data', el.items?.at(0));
    });
  });
});
