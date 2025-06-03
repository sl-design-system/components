import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { html } from 'lit';
import '../register.js';
import { GridDragHandleColumn } from './drag-handle-column.js';
import { type Grid } from './grid.js';
import { waitForGridToRenderData } from './utils.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach, { suppressErrorLogging: true });

describe('sl-grid-drag-handle-column', () => {
  let el: Grid;
  let column: GridDragHandleColumn;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' }
          ]}
        >
          <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
          <sl-grid-column path="name"></sl-grid-column>
        </sl-grid>
      `);

      column = el.querySelector('sl-grid-drag-handle-column')!;

      await waitForGridToRenderData(el);
    });

    it('should set grow to 0 after connecting', () => {
      expect(column.grow).to.equal(0);
    });

    it('should register the sl-icon scoped element', () => {
      expect(column.scopedElements).to.have.property('sl-icon', Icon);
    });

    it('should set draggableRows to "between" on the grid', () => {
      expect(el.draggableRows).to.equal('between');
    });

    it('should render an empty header', () => {
      const header = el.renderRoot.querySelector('th[part*="drag-handle"]');

      expect(header).to.exist;
      expect(header).to.have.trimmed.text('');
      expect(header).to.have.attribute('role', 'columnheader');
    });

    it('should render draggable cells with grip icon', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('td[part*="drag-handle"]'));
      expect(cells).to.have.lengthOf(2);

      cells.forEach(cell => {
        expect(cell).to.have.attribute('part').that.includes('data drag-handle');
        expect(cell).to.have.attribute('part').that.does.not.include('fixed');

        const icon = cell.querySelector('sl-icon');
        expect(icon).to.exist;
        expect(icon).to.have.attribute('name', 'grip-lines');
      });
    });
  });

  describe('conditional dragging with path', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { id: 1, name: 'Draggable Item', draggable: true },
            { id: 2, name: 'Fixed Item', draggable: false },
            { id: 3, name: 'No draggable property' }
          ]}
        >
          <sl-grid-drag-handle-column path="draggable"></sl-grid-drag-handle-column>
          <sl-grid-column path="name"></sl-grid-column>
        </sl-grid>
      `);

      column = el.querySelector('sl-grid-drag-handle-column')!;

      await waitForGridToRenderData(el);
    });

    it('should render draggable cell when path value is truthy', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('td[part*="drag-handle"]'));
      const draggableCell = cells[0];

      expect(draggableCell).to.have.attribute('part').that.includes('data drag-handle');
      expect(draggableCell).to.have.attribute('part').that.does.not.include('fixed');

      const icon = draggableCell.querySelector('sl-icon');
      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'grip-lines');
    });

    it('should render fixed cell when path value is falsy', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('td[part*="drag-handle"]'));
      const fixedCell = cells[1];

      expect(fixedCell).to.have.attribute('part').that.includes('data drag-handle fixed');

      const icon = fixedCell.querySelector('sl-icon');
      expect(icon).to.not.exist;
    });

    it('should render fixed cell when path value is undefined', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('td[part*="drag-handle"]'));
      const undefinedCell = cells[2];

      expect(undefinedCell).to.have.attribute('part').that.includes('data drag-handle fixed');

      const icon = undefinedCell.querySelector('sl-icon');
      expect(icon).to.not.exist;
    });
  });

  describe('drag functionality', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' }
          ]}
        >
          <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
          <sl-grid-column path="name"></sl-grid-column>
        </sl-grid>
      `);

      column = el.querySelector('sl-grid-drag-handle-column')!;

      await waitForGridToRenderData(el);
    });

    it('should set draggable attribute on row when mousedown event is fired', () => {
      const cell = el.renderRoot.querySelector('td[part*="drag-handle"]')!;
      const row = cell.closest('tr')!;

      expect(row).to.not.have.attribute('draggable');

      cell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(row).to.have.attribute('draggable', 'true');
    });

    it('should set draggable attribute on row when touchstart event is fired', () => {
      const cell = el.renderRoot.querySelector('td[part*="drag-handle"]')!;
      const row = cell.closest('tr')!;

      expect(row).to.not.have.attribute('draggable');

      cell.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));

      expect(row).to.have.attribute('draggable', 'true');
    });
  });

  describe('conditional drag functionality with path', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid
          .items=${[
            { id: 1, name: 'Draggable Item', draggable: true },
            { id: 2, name: 'Fixed Item', draggable: false }
          ]}
        >
          <sl-grid-drag-handle-column path="draggable"></sl-grid-drag-handle-column>
          <sl-grid-column path="name"></sl-grid-column>
        </sl-grid>
      `);

      column = el.querySelector('sl-grid-drag-handle-column')!;

      await waitForGridToRenderData(el);
    });

    it('should set draggable attribute when path value is truthy', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('td[part*="drag-handle"]'));
      const draggableCell = cells[0];
      const row = draggableCell.closest('tr')!;

      expect(row).to.not.have.attribute('draggable');

      draggableCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(row).to.have.attribute('draggable', 'true');
    });

    it('should not set draggable attribute when path value is falsy', () => {
      const cells = Array.from(el.renderRoot.querySelectorAll('td[part*="drag-handle"]'));
      const fixedCell = cells[1];
      const row = fixedCell.closest('tr')!;

      expect(row).to.not.have.attribute('draggable');

      fixedCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(row).to.not.have.attribute('draggable');
    });
  });

  describe('integration with grid', () => {
    it('should not override existing draggableRows setting', async () => {
      el = await fixture(html`
        <sl-grid draggable-rows="within">
          <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
          <sl-grid-column path="name"></sl-grid-column>
        </sl-grid>
      `);

      column = el.querySelector('sl-grid-drag-handle-column')!;
      await el.updateComplete;

      expect(el.draggableRows).to.equal('within');
    });

    it('should set draggableRows to "between" when not already set', async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
          <sl-grid-column path="name"></sl-grid-column>
        </sl-grid>
      `);

      column = el.querySelector('sl-grid-drag-handle-column')!;
      await el.updateComplete;

      expect(el.draggableRows).to.equal('between');
    });
  });
});
