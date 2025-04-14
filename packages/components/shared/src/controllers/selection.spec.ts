import { expect, fixture } from '@open-wc/testing';
import { LitElement, type PropertyValues, html } from 'lit';
import { property } from 'lit/decorators.js';
import { SelectionController } from './selection.js';

class SelectionMockHost extends LitElement {
  @property({ type: Boolean }) multiple?: boolean;
  @property({ type: Number }) size = 100;

  selection = new SelectionController(this);

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('multiple')) {
      this.selection.multiple = this.multiple ?? false;
    }

    if (changes.has('size')) {
      this.selection.size = this.size;
    }
  }
}

try {
  customElements.define('selection-mock-host', SelectionMockHost);
} catch {
  // Ignore error
}

describe('SelectionController', () => {
  let controller: SelectionController, host: SelectionMockHost;

  describe('defaults', () => {
    beforeEach(async () => {
      host = await fixture(html`<selection-mock-host></selection-mock-host>`);
      controller = host.selection;
    });

    it('should initialize with no items', () => {
      expect(controller.selected).to.equal(0);
      expect(controller.selection.size).to.equal(0);
    });

    it('should be set to single select', () => {
      expect(controller.multiple).to.be.false;
    });

    it('should have a size', () => {
      expect(controller.size).to.equal(100);
    });

    it('should select an item', () => {
      controller.select(1);

      expect(controller.isSelected(1)).to.be.true;
      expect(controller.selected).to.equal(1);
      expect(controller.selection.has(1)).to.be.true;
      expect(controller.areSomeSelected()).to.be.true;
    });

    it('should deselect an item', () => {
      controller.select(1);
      controller.deselect(1);

      expect(controller.isSelected(1)).to.be.false;
      expect(controller.selected).to.equal(0);
      expect(controller.selection.has(1)).to.be.false;
    });

    it('should automatically deselect the previous item', () => {
      controller.select(1);
      controller.select(2);

      expect(controller.isSelected(1)).to.be.false;
      expect(controller.isSelected(2)).to.be.true;
      expect(controller.selected).to.equal(1);
      expect(controller.selection.has(1)).to.be.false;
      expect(controller.selection.has(2)).to.be.true;
    });
  });

  describe('multiple', () => {
    beforeEach(async () => {
      host = await fixture(html`<selection-mock-host multiple></selection-mock-host>`);
      controller = host.selection;
    });

    it('should be set to multiple select', () => {
      expect(controller.multiple).to.be.true;
    });

    it('should select an item', () => {
      controller.select(1);

      expect(controller.isSelected(1)).to.be.true;
      expect(controller.selected).to.equal(1);
      expect(controller.selection.has(1)).to.be.true;
    });

    it('should deselect an item', () => {
      controller.select(1);
      controller.deselect(1);

      expect(controller.isSelected(1)).to.be.false;
      expect(controller.selected).to.equal(0);
      expect(controller.selection.has(1)).to.be.false;
    });

    it('should toggle an item', () => {
      controller.toggle(1);

      expect(controller.isSelected(1)).to.be.true;
      expect(controller.selected).to.equal(1);
      expect(controller.selection.has(1)).to.be.true;

      controller.toggle(1);

      expect(controller.isSelected(1)).to.be.false;
      expect(controller.selected).to.equal(0);
      expect(controller.selection.has(1)).to.be.false;
    });

    it('should select multiple items', () => {
      controller.select(1);
      controller.select(2);

      expect(controller.isSelected(1)).to.be.true;
      expect(controller.isSelected(2)).to.be.true;
      expect(controller.selected).to.equal(2);
      expect(controller.selection.has(1)).to.be.true;
      expect(controller.selection.has(2)).to.be.true;
    });

    it('should select all items', () => {
      controller.selectAll();

      expect(controller.isSelected(1)).to.be.true;
      expect(controller.isSelected(2)).to.be.true;
      expect(controller.selected).to.equal(100);
      expect(controller.areAllSelected()).to.be.true;
    });

    it('should indicate if select all is toggled', () => {
      expect(controller.isSelectAllToggled()).to.be.false;

      controller.selectAll();

      expect(controller.isSelectAllToggled()).to.be.true;
    });

    it('should keep track of deselected items when selecting all', () => {
      controller.selectAll();
      controller.deselect(1);

      expect(controller.isSelected(1)).to.be.false;
      expect(controller.isSelected(2)).to.be.true;
      expect(controller.selected).to.equal(99);
      expect(controller.selection.has(1)).to.be.true;
      expect(controller.selection.has(2)).to.be.false;
    });

    it('should deselect all items', () => {
      controller.select(1);
      controller.deselectAll();

      expect(controller.isSelected(1)).to.be.false;
      expect(controller.selected).to.equal(0);
      expect(controller.selection.size).to.equal(0);
    });
  });

  describe('active', () => {
    beforeEach(async () => {
      host = await fixture(html`<selection-mock-host></selection-mock-host>`);
      controller = host.selection;
    });

    it('should toggle active item', () => {
      expect(controller.isActive(1)).to.be.false;

      controller.toggleActive(1);

      expect(controller.isActive(1)).to.be.true;

      controller.toggleActive(2);

      expect(controller.isActive(1)).to.be.false;
      expect(controller.isActive(2)).to.be.true;
    });
  });
});
