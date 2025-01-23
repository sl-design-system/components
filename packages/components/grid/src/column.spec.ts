import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { Avatar } from '@sl-design-system/avatar';
import '@sl-design-system/avatar/register.js';
import { FetchDataSourcePlaceholder } from '@sl-design-system/data-source';
import { html } from 'lit';
import { Person } from 'tools/example-data/index.js';
import '../register.js';
import { GridColumnDataRenderer } from './column.js';
import { type Grid } from './grid.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-column', () => {
  let el: Grid;
  let cells: HTMLElement[];

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="age" align="end" grow="3" header="Current age"></sl-grid-column>
        </sl-grid>
      `);
      el.items = [
        { firstName: 'John', lastName: 'Doe', age: 20 },
        { firstName: 'Jane', lastName: 'Smith', age: 40 }
      ];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;

      cells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));
    });

    it('should render column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col => col.textContent);

      expect(columns).to.deep.equal(['First name', 'Last name', 'Current age']);
    });

    it('should have the right justify-content value', () => {
      expect(cells.map(cell => getComputedStyle(cell).justifyContent)).to.deep.equal(['start', 'start', 'end']);
    });

    it('should have the right grow value', () => {
      expect(cells.map(cell => getComputedStyle(cell).flexGrow)).to.deep.equal(['1', '1', '3']);
    });

    it('should have the right parts', () => {
      expect(cells.map(cell => cell.getAttribute('part'))).to.deep.equal([
        'data first-name',
        'data last-name',
        'data age'
      ]);
    });

    it('should not ellipsize the text in the cells', () => {
      expect(el.renderRoot.querySelector('sl-ellipsize-text')).not.to.exist;
    });

    it('should ellipsize the text in the cells when set', async () => {
      el.ellipsizeText = true;
      await el.updateComplete;

      expect(
        Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td')).map(
          cell => cell.firstElementChild?.tagName === 'SL-ELLIPSIZE-TEXT'
        )
      ).to.deep.equal([true, true, false]);
    });

    it('should ellipsize the text in the cells when set on the column', async () => {
      el.querySelector('sl-grid-column')!.ellipsizeText = true;
      el.requestUpdate();
      await el.updateComplete;

      expect(
        Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td')).map(
          cell => cell.firstElementChild?.tagName === 'SL-ELLIPSIZE-TEXT'
        )
      ).to.deep.equal([true, false, false]);
    });
  });

  describe('custom renderer', () => {
    beforeEach(async () => {
      const avatarRenderer: GridColumnDataRenderer<Person> = ({ firstName, lastName }) => {
        return html`<sl-avatar .displayName=${[firstName, lastName].join(' ')} size="sm"></sl-avatar>`;
      };

      el = await fixture(html`
        <sl-grid>
          <sl-grid-column
            header="Person"
            .renderer=${avatarRenderer}
            .scopedElements=${{
              'sl-avatar': Avatar
            }}
          ></sl-grid-column>
          <sl-grid-column path="age" parts="number"></sl-grid-column>
        </sl-grid>
      `);
      el.items = [
        { firstName: 'John', lastName: 'Doe', age: 20 },
        { firstName: 'Jane', lastName: 'Smith', age: 40 }
      ];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;

      cells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));
    });

    it('should render the elements set with the custom renderer', () => {
      const avatar = cells[0].querySelector('sl-avatar') as Avatar;

      expect(avatar).to.exist;
      expect(avatar?.shadowRoot?.querySelector('[part="name"]')?.textContent).to.equal('John Doe');
    });

    it('should have the right parts, including one set on the column', () => {
      expect(cells.map(cell => cell.getAttribute('part'))).to.deep.equal(['data', 'data number age']);
    });
  });

  describe('skeleton', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
        </sl-grid>
      `);
      el.items = [FetchDataSourcePlaceholder];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;

      cells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));
    });

    it('should render skeleton cells', () => {
      const skeletons = Array.from(el.renderRoot.querySelectorAll('td > *')).map(el => el.tagName);

      expect(skeletons).to.deep.equal(['SL-SKELETON', 'SL-SKELETON']);
    });
  });
});
