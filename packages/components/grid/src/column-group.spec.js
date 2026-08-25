import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import '../register.js';
describe('sl-column-group', () => {
  let el;
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
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });
    it('should render column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col =>
        col.textContent?.trim()
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
    it('should have the correct width', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('th'));
      const expectedWidths = [376, 645, 188, 187, 170, 159, 168, 147];
      const actualWidths = cells.map(cell => Math.floor(parseFloat(getComputedStyle(cell).width)));
      actualWidths.forEach((actual, i) => {
        expect(actual).to.be.closeTo(expectedWidths[i], 1);
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
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });
    it('should have the correct width when one is set explicitly', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('th'));
      const expectedWidths = [278, 743, 218, 217, 199, 189, 197];
      const actualWidths = cells.map(cell => Math.floor(parseFloat(getComputedStyle(cell).width)));
      actualWidths.forEach((actual, i) => {
        expect(actual).to.be.closeTo(expectedWidths[i], 1);
      });
    });
  });
});
//# sourceMappingURL=column-group.spec.js.map
