import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { spy } from 'sinon';
import { GridSorter } from './sorter.js';

try {
  customElements.define('sl-grid-sorter', GridSorter);
} catch {
  // empty
}

describe('sl-grid-sorter', () => {
  let el: GridSorter;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-grid-sorter>Name</sl-grid-sorter>`);
    });

    it('should slot the content', () => {
      const text = el.renderRoot
        .querySelector('slot')
        ?.assignedNodes()
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent)
        .join('');

      expect(text).to.equal('Name');
    });

    it('should not be sorted', () => {
      expect(el.direction).to.be.undefined;
      expect(el.shadowRoot?.querySelector('sl-icon')).to.have.attribute('name', 'sort');
    });

    it('should have an aria label on the button', () => {
      expect(el.renderRoot.querySelector('sl-button')).to.have.attribute('aria-label', 'Sort ascending');
    });

    it('should have a neutral ghost button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.have.attribute('fill', 'ghost');
      expect(button).to.have.attribute('variant', 'neutral');
    });

    it('should change the direction to ascending after clicking the button', async () => {
      el.renderRoot.querySelector('sl-button')?.click();
      await el.updateComplete;

      expect(el.direction).to.equal('asc');
      expect(el.shadowRoot?.querySelector('sl-icon')).to.have.attribute('name', 'sort-up');
    });

    it('should emit the sort direction change event after clicking the button', async () => {
      const onSortDirectionChange = spy();

      el.addEventListener('sl-sort-direction-change', onSortDirectionChange);
      el.renderRoot.querySelector('sl-button')?.click();
      await el.updateComplete;

      expect(onSortDirectionChange).to.have.been.calledOnce;
      expect(onSortDirectionChange).to.have.been.calledWithMatch({ detail: { direction: 'asc' } });
    });
  });

  describe('sort ascending', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-grid-sorter direction="asc">Name</sl-grid-sorter>`);
    });

    it('should be sorted ascending', () => {
      expect(el.direction).to.equal('asc');
      expect(el.shadowRoot?.querySelector('sl-icon')).to.have.attribute('name', 'sort-up');
    });

    it('should have an aria label on the button', () => {
      expect(el.renderRoot.querySelector('sl-button')).to.have.attribute('aria-label', 'Sort descending');
    });

    it('should have a primary solid button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.have.attribute('fill', 'solid');
      expect(button).to.have.attribute('variant', 'primary');
    });

    it('should change the direction to descending after clicking the button', async () => {
      el.renderRoot.querySelector('sl-button')?.click();
      await el.updateComplete;

      expect(el.direction).to.equal('desc');
      expect(el.shadowRoot?.querySelector('sl-icon')).to.have.attribute('name', 'sort-down');
    });

    it('should emit the sort direction change event after clicking the button', async () => {
      const onSortDirectionChange = spy();

      el.addEventListener('sl-sort-direction-change', onSortDirectionChange);
      el.renderRoot.querySelector('sl-button')?.click();
      await el.updateComplete;

      expect(onSortDirectionChange).to.have.been.calledOnce;
      expect(onSortDirectionChange).to.have.been.calledWithMatch({ detail: { direction: 'desc' } });
    });
  });

  describe('sort descending', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-grid-sorter direction="desc">Name</sl-grid-sorter>`);
    });

    it('should be sorted descending', () => {
      expect(el.direction).to.equal('desc');
      expect(el.shadowRoot?.querySelector('sl-icon')).to.have.attribute('name', 'sort-down');
    });

    it('should have an aria label on the button', () => {
      expect(el.renderRoot.querySelector('sl-button')).to.have.attribute('aria-label', 'Remove sort');
    });

    it('should have a primary solid button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.have.attribute('fill', 'solid');
      expect(button).to.have.attribute('variant', 'primary');
    });

    it('should unset the direction after clicking the button', async () => {
      el.renderRoot.querySelector('sl-button')?.click();
      await el.updateComplete;

      expect(el.direction).to.be.undefined;
      expect(el.shadowRoot?.querySelector('sl-icon')).to.have.attribute('name', 'sort');
    });

    it('should emit the sort direction change event after clicking the button', async () => {
      const onSortDirectionChange = spy();

      el.addEventListener('sl-sort-direction-change', onSortDirectionChange);
      el.renderRoot.querySelector('sl-button')?.click();
      await el.updateComplete;

      expect(onSortDirectionChange).to.have.been.calledOnce;
      expect(onSortDirectionChange).to.have.been.calledWithMatch({ detail: { direction: undefined } });
    });
  });

  describe('reset()', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-grid-sorter direction="desc">Name</sl-grid-sorter>`);
    });

    it('should set the direction to undefined', async () => {
      el.reset();
      await el.updateComplete;

      expect(el.direction).to.be.undefined;
      expect(el.shadowRoot?.querySelector('sl-icon')).to.have.attribute('name', 'sort');
    });

    it('should not emit the sort direction change event', async () => {
      const onSortDirectionChange = spy();

      el.addEventListener('sl-sort-direction-change', onSortDirectionChange);
      el.reset();
      await el.updateComplete;

      expect(onSortDirectionChange).not.to.have.been.called;
    });
  });
});
