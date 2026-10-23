import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { type Grid } from './grid.js';
import './register.js';

describe('sl-column-group', () => {
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
      await page.viewport(1024, 1024);
      el.items = [
        { firstName: 'John', lastName: 'Doe', grades: { biology: 'A', maths: 'B', english: 'B+' } }
      ];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should render column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col =>
        col.innerText.trim()
      );

      expect(columns).to.deep.equal([
        'Name',
        'Grades',
        'First name',
        'Last name',
        'Biology',
        'Maths',
        'English',
        'Age'
      ]);
    });

    it('should expose the total column count on the table', () => {
      expect(el.renderRoot.querySelector('table')).to.have.attribute('aria-colcount', '6');
    });

    it('should mark grouped headers as column groups', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll('th')),
        dataCells = Array.from(el.renderRoot.querySelectorAll('tbody tr td'));

      expect(headers[0]).to.have.attribute('role', 'cell');
      expect(headers[0]).not.to.have.attribute('aria-hidden');
      expect(headers[1]).to.have.attribute('role', 'cell');
      expect(headers[1]).not.to.have.attribute('aria-hidden');

      headers.slice(2).forEach(header => {
        expect(header).to.have.attribute('role', 'cell');
      });

      expect(headers[0]).not.to.have.attribute('aria-labelledby');
      expect(headers[1]).not.to.have.attribute('aria-labelledby');

      expect(headers[2]).not.to.have.attribute('aria-label');
      expect(headers[2]).to.have.attribute('aria-colindex', '1');
      expect(headers[2]).not.to.have.attribute('headers');
      expect(headers[2]).not.to.have.attribute('abbr');
      expect(headers[2].textContent?.trim()).to.equal('First name');

      expect(headers[3]).not.to.have.attribute('aria-label');
      expect(headers[3]).to.have.attribute('aria-colindex', '2');
      expect(headers[3]).not.to.have.attribute('headers');
      expect(headers[3]).not.to.have.attribute('abbr');
      expect(headers[3].textContent?.trim()).to.equal('Last name');

      expect(headers[4]).not.to.have.attribute('aria-label');
      expect(headers[4]).to.have.attribute('aria-colindex', '3');
      expect(headers[4]).not.to.have.attribute('headers');
      expect(headers[4]).not.to.have.attribute('abbr');
      expect(headers[4].textContent?.trim()).to.equal('Biology');

      expect(headers[5]).not.to.have.attribute('aria-label');
      expect(headers[5]).to.have.attribute('aria-colindex', '4');
      expect(headers[5]).not.to.have.attribute('headers');
      expect(headers[5]).not.to.have.attribute('abbr');
      expect(headers[5].textContent?.trim()).to.equal('Maths');

      expect(headers[6]).not.to.have.attribute('aria-label');
      expect(headers[6]).to.have.attribute('aria-colindex', '5');
      expect(headers[6]).not.to.have.attribute('headers');
      expect(headers[6]).not.to.have.attribute('abbr');
      expect(headers[6].textContent?.trim()).to.equal('English');

      expect(headers[7]).not.to.have.attribute('aria-label');
      expect(headers[7]).to.have.attribute('aria-colindex', '6');
      expect(headers[7]).not.to.have.attribute('headers');
      expect(headers[7]).not.to.have.attribute('abbr');
      expect(headers[7].textContent?.trim()).to.equal('Age');

      expect(dataCells[0]).to.have.attribute('headers', `${headers[2].id}`);
      expect(dataCells[1]).to.have.attribute('headers', `${headers[3].id}`);
      expect(dataCells[2]).to.have.attribute('headers', `${headers[4].id}`);
      expect(dataCells[3]).to.have.attribute('headers', `${headers[5].id}`);
      expect(dataCells[4]).to.have.attribute('headers', `${headers[6].id}`);
      expect(dataCells[5]).to.have.attribute('headers', `${headers[7].id}`);

      // Data cells are named by their group header followed by their column header
      expect(dataCells[0]).to.have.attribute(
        'aria-labelledby',
        `${headers[0].id} ${headers[2].id}`
      );
      expect(dataCells[1]).to.have.attribute(
        'aria-labelledby',
        `${headers[0].id} ${headers[3].id}`
      );
      expect(dataCells[2]).to.have.attribute(
        'aria-labelledby',
        `${headers[1].id} ${headers[4].id}`
      );
      expect(dataCells[3]).to.have.attribute(
        'aria-labelledby',
        `${headers[1].id} ${headers[5].id}`
      );
      expect(dataCells[4]).to.have.attribute(
        'aria-labelledby',
        `${headers[1].id} ${headers[6].id}`
      );
      // Cells without a value keep their group context too
      expect(dataCells[5]).to.have.attribute(
        'aria-labelledby',
        `${headers[1].id} ${headers[7].id}`
      );
    });

    it('should associate grouped headers through table header relationships', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(headers[0]).not.to.have.attribute('aria-hidden');
      expect(headers[1]).not.to.have.attribute('aria-hidden');
      expect(headers[2]).not.to.have.attribute('headers');
      expect(headers[3]).not.to.have.attribute('headers');
      expect(headers[4]).not.to.have.attribute('headers');
    });

    it('should not wrap grouped leaf header labels in spans', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll('th')).slice(2);

      headers.forEach(header => {
        expect(header.querySelector('span')).not.to.exist;
      });
    });

    it('should have the correct width', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('th'));
      const expectedWidths = [376, 645, 188, 187, 170, 159, 168, 147];
      const actualWidths = cells.map(cell => Math.floor(parseFloat(getComputedStyle(cell).width)));

      actualWidths.forEach((actual, i) => {
        expect(actual).to.be.closeTo(expectedWidths[i], 3);
      });
    });
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
      await page.viewport(1024, 1024);

      el.items = [
        { firstName: 'John', lastName: 'Doe', grades: { biology: 'A', maths: 'B', english: 'B+' } }
      ];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should have the correct width when one is set explicitly', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('th'));
      const expectedWidths = [278, 743, 218, 217, 199, 189, 197];
      const actualWidths = cells.map(cell => Math.floor(parseFloat(getComputedStyle(cell).width)));

      actualWidths.forEach((actual, i) => {
        expect(actual).to.be.closeTo(expectedWidths[i], 3);
      });
    });
  });
});
