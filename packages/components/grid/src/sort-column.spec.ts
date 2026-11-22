import { type SlAnnounceEvent } from '@sl-design-system/announcer';
import '@sl-design-system/announcer/register.js';
import { Infotip } from '@sl-design-system/infotip';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Grid } from './grid.js';
import './register.js';
import { GridSortColumn } from './sort-column.js';
import { GridSorter } from './sorter.js';
import { waitForGridToRenderData } from './utils.js';

const ITEMS = [
  { firstName: 'John', lastName: 'Doe', age: 20 },
  { firstName: 'Jane', lastName: 'Smith', age: 40 },
  { firstName: 'Jimmy', lastName: 'Adams', age: 30 },
  { firstName: 'Jane', lastName: 'Brown', age: 15 }
];

describe('sl-sort-column', () => {
  let el: Grid;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
          <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
          <sl-grid-sort-column path="age"></sl-grid-sort-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should have a header row count of 1', () => {
      const headerRowCount = Array.from(el.querySelectorAll('sl-grid-sort-column')).map(
        col => col.headerRowCount
      );

      expect(headerRowCount).to.deep.equal([1, 1, 1]);
    });

    it('should render native column headers with scope', () => {
      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.every(th => th.tagName === 'TH')).to.be.true;
      expect(ths.every(th => th.getAttribute('scope') === 'col')).to.be.true;
    });

    it('should not have aria-sort set on the th elements', () => {
      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.every(th => !th.hasAttribute('aria-sort'))).to.be.true;
    });

    it('should set the correct parts on the th elements', () => {
      const parts = Array.from(el.renderRoot.querySelectorAll('th')).map(th => th.part.value);

      expect(parts).to.deep.equal([
        'header sort first-name',
        'header sort last-name',
        'header sort age'
      ]);
    });

    it('should render the sorter in the header row', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll('thead tr th > *'));

      expect(headers.every(h => h instanceof GridSorter)).to.be.true;
      expect(headers.map(h => h.textContent?.trim())).to.deep.equal([
        'First name',
        'Last name',
        'Age'
      ]);
    });

    it('should not be sorted on any column', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll<GridSorter>('thead tr th > *'));

      expect(headers.every(h => h.direction === undefined)).to.be.true;
    });
  });

  describe('sorted', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
          <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
          <sl-grid-sort-column path="age" direction="asc"></sl-grid-sort-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      // Give grid time to sort the data
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have sorted the data', () => {
      const rows = Array.from(el.renderRoot.querySelectorAll('tbody tr')).map(row =>
        Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim())
      );

      expect(rows).to.deep.equal([
        ['Jane', 'Brown', '15'],
        ['John', 'Doe', '20'],
        ['Jimmy', 'Adams', '30'],
        ['Jane', 'Smith', '40']
      ]);
    });

    it('should have aria-sort set on the sorted column', () => {
      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.map(th => th.getAttribute('aria-sort'))).to.deep.equal([null, null, 'ascending']);
    });

    it('should set the correct direction on the sorter element', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll<GridSorter>('thead tr th > *'));

      expect(headers.map(h => h.direction)).to.deep.equal([undefined, undefined, 'asc']);
    });

    it('should change the aria-sort when the direction changes', async () => {
      const sorter = el.renderRoot.querySelector<GridSorter>(
        'thead th:last-of-type sl-grid-sorter'
      );

      sorter?.renderRoot.querySelector('sl-button')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.renderRoot.querySelector('th:last-of-type')).to.have.attribute(
        'aria-sort',
        'descending'
      );
    });

    it('should change the sorting when clicking the sorter in another column', async () => {
      const sorter = el.renderRoot.querySelector<GridSorter>(
        'thead th:first-of-type sl-grid-sorter'
      );

      sorter?.renderRoot.querySelector('sl-button')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.map(th => th.getAttribute('aria-sort'))).to.deep.equal(['ascending', null, null]);
    });
  });

  describe('sorting announcements', () => {
    const onAnnounce = spy();

    beforeEach(() => {
      onAnnounce.resetHistory();
      document.body.addEventListener('sl-announce', onAnnounce);
    });

    afterEach(() => document.body.removeEventListener('sl-announce', onAnnounce));

    it('should announce the current sort after every user change', async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column header="Student" path="firstName"></sl-grid-sort-column>
          <sl-grid-sort-column path="age"></sl-grid-sort-column>
        </sl-grid>
      `);
      await waitForGridToRenderData(el);

      expect(onAnnounce).not.to.have.been.called;

      const sorter = el.renderRoot.querySelector<GridSorter>('sl-grid-sorter')!;

      for (const ariaSort of ['ascending', 'descending', null]) {
        sorter.renderRoot.querySelector('sl-button')!.click();
        await expect
          .poll(() => el.renderRoot.querySelector('th')!.getAttribute('aria-sort'))
          .to.equal(ariaSort);
      }

      expect(
        onAnnounce.getCalls().map(call => (call.args[0] as SlAnnounceEvent).detail)
      ).to.deep.equal([
        { message: 'Student sorting ascending', urgency: 'polite' },
        { message: 'Student sorting descending', urgency: 'polite' },
        { message: 'Student sorting removed', urgency: 'polite' }
      ]);
    });

    it('should update the live region when sorting with Space without moving focus', async () => {
      const wrapper = await fixture(html`
        <div>
          <sl-announcer></sl-announcer>
          <sl-grid .items=${ITEMS}>
            <sl-grid-sort-column header="Student" path="firstName"></sl-grid-sort-column>
          </sl-grid>
        </div>
      `);
      el = wrapper.querySelector('sl-grid')!;
      await waitForGridToRenderData(el);
      await el.recalculateColumnWidths();
      await el.updateComplete;

      const announcer = wrapper.querySelector('sl-announcer')!;
      await announcer.updateComplete;

      // Column measurement can rebuild the header. Focus the current button after it renders.
      await expect
        .poll(() => {
          const sorter = el.renderRoot.querySelector<GridSorter>('sl-grid-sorter'),
            button = sorter?.renderRoot.querySelector('sl-button');

          button?.button?.focus();
          return !!button?.button && button.shadowRoot?.activeElement === button.button;
        })
        .toBe(true);

      const sorter = el.renderRoot.querySelector<GridSorter>('sl-grid-sorter')!,
        button = sorter.renderRoot.querySelector('sl-button')!;

      await userEvent.keyboard('{Space}');

      expect(announcer.renderRoot.querySelector('[aria-live="polite"]')).to.have.text(
        'Student sorting ascending'
      );
      expect(button.shadowRoot!.activeElement).to.equal(button.button);
    });

    it('should announce only the newly sorted column when switching columns', async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column path="firstName" direction="asc"></sl-grid-sort-column>
          <sl-grid-sort-column
            header="Surname"
            path="lastName"
            hide-header-text
            form-control-column-label="Action"></sl-grid-sort-column>
        </sl-grid>
      `);
      await waitForGridToRenderData(el);

      expect(onAnnounce).not.to.have.been.called;

      const sorter = el.renderRoot.querySelectorAll<GridSorter>('sl-grid-sorter')[1];
      sorter.renderRoot.querySelector('sl-button')!.click();
      await waitForGridToRenderData(el);

      expect(onAnnounce).to.have.been.calledOnce;
      expect(onAnnounce).to.have.been.calledWithMatch({
        detail: { message: 'Surname sorting ascending', urgency: 'polite' }
      });
      await expect
        .poll(() =>
          Array.from(el.renderRoot.querySelectorAll('th'), th => th.getAttribute('aria-sort'))
        )
        .to.deep.equal([null, 'ascending']);
    });

    it('should use the explicit accessible name of a hidden custom header', async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column
            path="firstName"
            hide-header-text
            .header=${() => html`<span>Student</span>`}></sl-grid-sort-column>
        </sl-grid>
      `);
      await waitForGridToRenderData(el);

      const header = el.renderRoot.querySelector('th')!,
        sorter = header.querySelector<GridSorter>('sl-grid-sorter')!;

      expect(header.getAttribute('aria-label')).to.equal('First name');
      sorter.renderRoot.querySelector('sl-button')!.click();

      expect(onAnnounce).to.have.been.calledOnce;
      expect(onAnnounce).to.have.been.calledWithMatch({
        detail: { message: 'First name sorting ascending', urgency: 'polite' }
      });
    });

    it.each([
      ['hidden elements', html`<span hidden>Internal note</span>`],
      [
        'menu buttons',
        html`
          <sl-menu-button aria-label="Student options">
            <sl-menu-item>Option 1</sl-menu-item>
          </sl-menu-button>
        `
      ]
    ])('should omit %s from custom header announcements', async (_, auxiliaryContent) => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column
            path="firstName"
            .header=${() => html`<span>Student</span>${auxiliaryContent}`}
            .scopedElements=${{
              'sl-menu-button': MenuButton,
              'sl-menu-item': MenuItem
            }}></sl-grid-sort-column>
        </sl-grid>
      `);
      await waitForGridToRenderData(el);

      const sorter = el.renderRoot.querySelector<GridSorter>('sl-grid-sorter')!;
      sorter.renderRoot.querySelector('sl-button')!.click();

      expect(onAnnounce).to.have.been.calledOnce;
      expect(onAnnounce).to.have.been.calledWithMatch({
        detail: { message: 'Student sorting ascending', urgency: 'polite' }
      });
    });
  });

  describe('scopedElements', () => {
    it('should retain sl-grid-sorter in scopedElements after they are set post-connectedCallback', async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      const column = el.querySelector<GridSortColumn>('sl-grid-sort-column')!;

      // Simulate Angular (or another framework) setting scopedElements after connectedCallback
      column.scopedElements = { 'sl-other-element': HTMLElement };

      expect(column.scopedElements).to.have.property('sl-grid-sorter', GridSorter);
      expect(column.scopedElements).to.have.property('sl-other-element');
    });
  });

  describe('custom header renderer', () => {
    it('should render the result of the header renderer', async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column
            path="firstName"
            .header=${(column: GridSortColumn) => html`
              <span data-testid="custom-header">${column.path}</span>
            `}></sl-grid-sort-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      const sorter = el.renderRoot.querySelector<GridSorter>('sl-grid-sorter');

      expect(sorter?.querySelector('[data-testid="custom-header"]')).to.have.text('firstName');
    });

    it('should announce the header label without infotip content when sorting', async () => {
      const onAnnounce = spy();

      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column
            path="firstName"
            .header=${() => html`
              <span>First name</span>
              <sl-infotip describes="First name" size="sm">
                Sort students by their first name
              </sl-infotip>
            `}
            .scopedElements=${{ 'sl-infotip': Infotip }}></sl-grid-sort-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      document.body.addEventListener('sl-announce', onAnnounce);

      try {
        const sorter = el.renderRoot.querySelector<GridSorter>('sl-grid-sorter');

        sorter?.renderRoot.querySelector('sl-button')?.click();
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(onAnnounce).to.have.been.calledOnce;
        expect(onAnnounce).to.have.been.calledWithMatch({
          detail: { message: 'First name sorting ascending', urgency: 'polite' }
        });
      } finally {
        document.body.removeEventListener('sl-announce', onAnnounce);
      }
    });
  });
});
