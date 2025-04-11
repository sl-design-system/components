import { expect, fixture } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { SelectionController } from './selection.js';

class SelectionMockHost extends LitElement {
  selection = new SelectionController(this);
}

try {
  customElements.define('selection-mock-host', SelectionMockHost);
} catch {
  // Ignore error
}

describe('SelectionController', () => {
  let controller: SelectionController, host: SelectionMockHost;

  describe('single select', () => {});

  beforeEach(async () => {
    host = await fixture(html`<selection-mock-host></selection-mock-host>`);
    controller = host.selection;
  });

  it('should initialize with no selected items', () => {
    expect(controller.selected).to.equal(0);
    expect(controller.selection.size).to.equal(0);
  });
});
