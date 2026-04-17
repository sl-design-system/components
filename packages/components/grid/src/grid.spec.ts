import '@sl-design-system/button/register.js';
import { isPopoverOpen } from '@sl-design-system/shared';
import { tooltip } from '@sl-design-system/tooltip';
import '@sl-design-system/tooltip/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { type SinonSpy, spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { type Grid, type SlActiveRowChangeEvent } from './grid.js';
import { waitForGridToRenderData } from './utils.js';

type Person = { firstName: string; lastName: string };

describe('sl-grid', () => {
  let el: Grid<Person>;
  const findTooltip = (id: string): HTMLElement | null => {
    return (
      el.querySelector<HTMLElement>(`#${CSS.escape(id)}`) ??
      el.renderRoot.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    );
  };

  const findTooltipByText = (text: string): HTMLElement | null =>
    Array.from(el.renderRoot.querySelectorAll<HTMLElement>('sl-tooltip')).find(tooltipEl =>
      tooltipEl.textContent?.includes(text)
    ) ?? null;

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

    it('should set the selects property on the new data source when items are updated', async () => {
      const newItems = [
        { firstName: 'Alice', lastName: 'Johnson' },
        { firstName: 'Bob', lastName: 'Wilson' }
      ];

      el.items = newItems;
      await el.updateComplete;

      expect(el.dataSource?.selects).to.equal('multiple');
    });

    it('should show a lazy tooltip on a bulk action button in the floating action bar', async () => {
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

          <sl-button
            ${tooltip('I am a tooltip')}
            aria-disabled="true"
            fill="outline"
            slot="bulk-actions"
            variant="inverted"
          >
            Action 2
          </sl-button>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const bulkActions = el.renderRoot.querySelector<HTMLElement>('[part="bulk-actions"]'),
        button = el.querySelector<HTMLElement>('sl-button[slot="bulk-actions"]');

      expect(bulkActions).to.exist;
      expect(button).to.exist;
      expect(isPopoverOpen(bulkActions!)).to.be.true;

      await userEvent.hover(button!);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 250));

      const lazyTooltip = findTooltipByText('I am a tooltip');

      expect(lazyTooltip).to.exist;
      expect(lazyTooltip?.tagName).to.equal('SL-TOOLTIP');
      expect(isPopoverOpen(lazyTooltip!)).to.be.true;
    });

    it('should keep showing an explicit tooltip for a bulk action button on repeated hover', async () => {
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

          <sl-tooltip id="bulk-action-tooltip" show-delay="0" hide-delay="0">Bulk action tooltip</sl-tooltip>
          <sl-button aria-describedby="bulk-action-tooltip" fill="outline" slot="bulk-actions" variant="inverted">
            Action 2
          </sl-button>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const button = el.querySelector<HTMLElement>('sl-button[slot="bulk-actions"]'),
        explicitTooltip = findTooltip('bulk-action-tooltip');

      expect(button).to.exist;
      expect(explicitTooltip).to.exist;

      await userEvent.hover(button!);
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(isPopoverOpen(explicitTooltip!)).to.be.true;

      await userEvent.unhover(button!);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(isPopoverOpen(explicitTooltip!)).to.be.false;

      await userEvent.hover(button!);
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(isPopoverOpen(explicitTooltip!)).to.be.true;
    });

    it('should show the explicit bulk action tooltip when hovering the sl-button proxy target', async () => {
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

          <sl-tooltip id="bulk-action-tooltip" show-delay="0" hide-delay="0">Bulk action tooltip</sl-tooltip>
          <sl-button aria-describedby="bulk-action-tooltip" fill="outline" slot="bulk-actions" variant="inverted">
            Action 2
          </sl-button>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const button = el.querySelector<HTMLElement & { updateComplete?: Promise<unknown>; renderRoot?: ShadowRoot }>(
          'sl-button[slot="bulk-actions"]'
        ),
        explicitTooltip = findTooltip('bulk-action-tooltip');

      await button?.updateComplete;

      const proxyTarget = button?.renderRoot?.querySelector<HTMLElement>('button');

      expect(proxyTarget).to.exist;
      expect(explicitTooltip).to.exist;

      await userEvent.hover(proxyTarget!);
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(isPopoverOpen(explicitTooltip!)).to.be.true;
    });

    it('should switch between the cancel tooltip and a bulk action tooltip in the floating action bar', async () => {
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

          <sl-button
            ${tooltip('I am a tooltip')}
            aria-disabled="true"
            fill="outline"
            slot="bulk-actions"
            variant="inverted"
          >
            Action 2
          </sl-button>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td[part~="selection"]')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const cancelButton = el.renderRoot.querySelector<HTMLElement>('[part="bulk-actions"] > sl-button:last-of-type'),
        cancelTooltip = el.renderRoot.querySelector<HTMLElement>('#tooltip'),
        bulkButton = el.querySelector<HTMLElement & { updateComplete?: Promise<unknown>; renderRoot?: ShadowRoot }>(
          'sl-button[slot="bulk-actions"]'
        );

      await bulkButton?.updateComplete;

      const bulkProxyTarget = bulkButton?.renderRoot?.querySelector<HTMLElement>('button');

      expect(cancelButton).to.exist;
      expect(cancelTooltip).to.exist;
      expect(bulkButton).to.exist;
      expect(bulkProxyTarget).to.exist;

      await userEvent.hover(cancelButton!);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 250));

      expect(isPopoverOpen(cancelTooltip!)).to.be.true;

      await userEvent.hover(bulkProxyTarget!);
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 250));

      const bulkTooltip =
        Array.from(el.renderRoot.querySelectorAll<HTMLElement>('sl-tooltip')).find(tooltipEl =>
          tooltipEl.textContent?.includes('I am a tooltip')
        ) ?? null;

      expect(bulkTooltip).to.exist;
      expect(bulkTooltip?.tagName).to.equal('SL-TOOLTIP');
      expect(isPopoverOpen(cancelTooltip!)).to.be.false;
      expect(isPopoverOpen(bulkTooltip!)).to.be.true;
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
          row-action="select"
        >
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

    it('should toggle the "selected" part of the row when clicking in the row', async () => {
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;
    });

    it('should allow only one row to be selected at a time', async () => {
      // Select first row
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      let selectedRows = el.renderRoot.querySelectorAll<HTMLTableRowElement>('tbody tr[part~="selected"]');
      expect(selectedRows).to.have.lengthOf(1);

      // Select second row - should deselect first row
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:nth-of-type(2) td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      selectedRows = el.renderRoot.querySelectorAll<HTMLTableRowElement>('tbody tr[part~="selected"]');
      expect(selectedRows).to.have.lengthOf(1);

      // Verify first row is no longer selected
      const firstRow = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(firstRow?.part.contains('selected')).to.be.false;

      // Verify second row is selected
      const secondRow = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:nth-of-type(2)');
      expect(secondRow?.part.contains('selected')).to.be.true;
    });

    it('should deselect a row when clicking it again', async () => {
      // Select a row
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      let row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.true;

      // Click again to deselect
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      row = el.renderRoot.querySelector<HTMLTableRowElement>('tbody tr:first-of-type');
      expect(row?.part.contains('selected')).to.be.false;
    });

    it('should emit an sl-grid-selection-change event when the selection changes', () => {
      const onSelectionChange = spy();

      el.addEventListener('sl-grid-selection-change', onSelectionChange);

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();
      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:nth-of-type(2) td:last-of-type')?.click();

      expect(onSelectionChange).to.have.been.calledTwice;
    });

    it('should call toggle() on the data source when a row is selected', () => {
      const toggleSpy = spy(el.dataSource!, 'toggle');

      el.renderRoot.querySelector<HTMLTableCellElement>('tbody tr:first-of-type td:last-of-type')?.click();

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
