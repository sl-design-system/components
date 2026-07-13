import { Avatar } from '@sl-design-system/avatar';
import '@sl-design-system/avatar/register.js';
import { ListDataSourcePlaceholder } from '@sl-design-system/data-source';
import { Person } from '@sl-design-system/example-data';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { GridColumnDataRenderer } from './column.js';
import { type Grid } from './grid.js';

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
      const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col =>
        col.textContent?.trim()
      );

      expect(columns).to.deep.equal(['First name', 'Last name', 'Current age']);
    });

    it('should visually hide the header text when set', async () => {
      el.querySelector('sl-grid-column')!.hideHeaderText = true;
      el.requestUpdate();
      await el.updateComplete;

      const span = el.renderRoot.querySelector('th span');

      expect(span).to.have.trimmed.text('First name');
      expect(span).to.have.class('visually-hidden');
    });

    it('should have the right justify-content value', () => {
      expect(cells.map(cell => getComputedStyle(cell).justifyContent)).to.deep.equal([
        'start',
        'start',
        'end'
      ]);
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

  describe('path', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="foo"></sl-grid-column>
          <sl-grid-column path="bar"></sl-grid-column>
          <sl-grid-column></sl-grid-column>
        </sl-grid>
      `);
      el.items = [{ foo: 'Foo' }];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should render "No path set" for the column that has no path', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('tbody td')).map(el =>
        el.textContent?.trim()
      );

      expect(cells).to.deep.equal(['Foo', '', 'No path set']);
    });
  });

  describe('form control label', () => {
    it('should fall back to the path label when the header is empty', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column header=" " path="address.zip"></sl-grid-column>
        </sl-grid>
      `);

      const column = el.querySelector('sl-grid-column')!;

      expect(column.getFormControlLabel({ address: { zip: '12345' } })).to.equal('Zip');
    });

    it('should add trimmed row context when provided', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="status" .formControlLabel=${() => ' John Doe '}></sl-grid-column>
        </sl-grid>
      `);

      const column = el.querySelector('sl-grid-column')!;

      expect(column.getFormControlLabel({ status: 'Available' })).to.equal('Status John Doe');
    });
  });

  describe('empty string value', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="foo"></sl-grid-column>
        </sl-grid>
      `);
      el.items = [{ foo: 'Bar' }, { foo: '' }];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should render nothing', () => {
      const data = Array.from(el.renderRoot.querySelectorAll('tbody td')).map(el =>
        el.textContent?.trim()
      );

      expect(data).to.deep.equal(['Bar', '']);
    });
  });

  describe('custom renderer', () => {
    beforeEach(async () => {
      const avatarRenderer: GridColumnDataRenderer<Person> = ({ firstName, lastName }) => {
        return html`
          <sl-avatar .displayName=${[firstName, lastName].join(' ')} size="sm"></sl-avatar>
        `;
      };

      el = await fixture(html`
        <sl-grid>
          <sl-grid-column
            header="Person"
            .renderer=${avatarRenderer}
            .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
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
      expect(cells.map(cell => cell.getAttribute('part'))).to.deep.equal([
        'data',
        'data number age'
      ]);
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
      el.items = [ListDataSourcePlaceholder];
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

  describe('sticky columns', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="firstName" sticky></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="age"></sl-grid-column>
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

    it('should add sticky class when sticky is set on first column', () => {
      expect(cells[0].classList.contains('sticky-start-first')).to.be.true;
    });

    it('should not add sticky class to non-sticky columns', () => {
      expect(cells[1].className).to.not.match(/sticky/);
      expect(cells[2].className).to.not.match(/sticky/);
    });

    it('should add sticky classes to header cells', () => {
      const headerCells = Array.from(el.renderRoot.querySelectorAll('thead tr th'));

      expect(headerCells[0].classList.contains('sticky-start-first')).to.be.true;
      expect(headerCells[1].className).to.not.match(/sticky/);
      expect(headerCells[2].className).to.not.match(/sticky/);
    });

    it('should update classes when sticky property changes', async () => {
      const column = el.querySelector('sl-grid-column');
      column!.sticky = false;
      el.requestUpdate();
      await el.updateComplete;

      const updatedCells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));

      expect(updatedCells[0].className).to.not.match(/sticky/);
    });

    it('should support sticky on last column', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="age" sticky></sl-grid-column>
        </sl-grid>
      `);
      el.items = [{ firstName: 'John', lastName: 'Doe', age: 20 }];
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;

      const endCells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));

      expect(endCells[2].classList.contains('sticky-end-first')).to.be.true;
    });

    it('should support multiple consecutive sticky columns', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="firstName" sticky></sl-grid-column>
          <sl-grid-column path="lastName" sticky></sl-grid-column>
          <sl-grid-column path="age"></sl-grid-column>
        </sl-grid>
      `);
      el.items = [{ firstName: 'John', lastName: 'Doe', age: 20 }];
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;

      const allCells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));

      expect(allCells[0].classList.contains('sticky-start-first')).to.be.true;
      expect(allCells[1].classList.contains('sticky-start-last')).to.be.true;
      expect(allCells[2].className).to.not.match(/sticky/);
    });
  });
});
