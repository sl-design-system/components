import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Grid } from './grid.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-grid', () => {
  let el: Grid;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column-group header="Name">
            <sl-grid-column path="firstName"></sl-grid-column>
            <sl-grid-column path="lastName"></sl-grid-column>
          </sl-grid-column-group>
          <sl-grid-column-group header="Grades">
            <sl-grid-column path="grades.biology"></sl-grid-column>
            <sl-grid-column path="grades.maths"></sl-grid-column>
            <sl-grid-column path="grades.english"></sl-grid-column>
            <sl-grid-column path="age"></sl-grid-column>
          </sl-grid-column-group>
        </sl-grid>
      `);
      el.items = [{ firstName: 'John', lastName: 'Doe', grades: { biology: 'A', maths: 'B', english: 'B+' } }];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should render column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col => col.textContent);

      expect(columns).to.deep.equal(['Name', 'Grades', 'First name', 'Last name', 'Biology', 'Maths', 'English']);
    });

    it('should have the correct width', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('th'));
      expect(cells.map(cell => Math.floor(parseFloat(getComputedStyle(cell).width)))).to.deep.equal([
        312, 469, 156, 156, 156, 156, 156
      ]);
    });

    // it('should emit an sl-column-update event after clicking the checkbox', async () => {
    //   const columnUpdateEvent = spy();
    //   const columnGoup = el.querySelector('sl-grid-column-group:first-of-type') as GridColumnGroup;
    //   columnGoup?.addEventListener('sl-column-update', columnUpdateEvent);

    //   const newColumn = document.createElement('sl-grid-column');
    //   await new Promise(resolve => setTimeout(resolve, 100));

    //   columnGoup?.appendChild(newColumn);

    //   // expect(columnUpdateEvent).to.have.been.called;
    //   expect(columnGoup?.columns).to.equal(3);
    // });
  });

  describe('explicit width', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column-group header="Name">
            <sl-grid-column path="firstName"></sl-grid-column>
            <sl-grid-column path="lastName"></sl-grid-column>
          </sl-grid-column-group>
          <sl-grid-column-group header="Grades" width="600">
            <sl-grid-column path="grades.biology"></sl-grid-column>
            <sl-grid-column path="grades.maths"></sl-grid-column>
            <sl-grid-column path="grades.english"></sl-grid-column>
          </sl-grid-column-group>
        </sl-grid>
      `);

      el.items = [{ firstName: 'John', lastName: 'Doe', grades: { biology: 'A', maths: 'B', english: 'B+' } }];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should have the correct width when one is set explicitly', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('th'));
      expect(cells.map(cell => Math.floor(parseFloat(getComputedStyle(cell).width)))).to.deep.equal([
        200, 600, 160, 160, 160, 160, 160
      ]);
    });
  });
});
