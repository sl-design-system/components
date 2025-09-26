import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { SelectMonth } from './select-month.js';

// Define element if not already defined (no dedicated register file for select-month)
try {
  customElements.define('sl-select-month', SelectMonth);
} catch {
  /* already defined */
}

describe('sl-select-month', () => {
  let el: SelectMonth;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should generate 12 months', () => {
      expect(el.months).to.have.lengthOf(12);
      const buttonsOrSpans = el.renderRoot.querySelectorAll('ol li');
      expect(buttonsOrSpans).to.have.lengthOf(12);
    });

    it('should show a year toggle button (because navigation is possible)', () => {
      const toggleBtn = el.renderRoot.querySelector('sl-button.current-year');
      expect(toggleBtn).to.exist;
    });

    it('should have enabled previous and next year buttons', () => {
      const prev = el.renderRoot.querySelector('sl-button[aria-label^="Previous year"]');
      const next = el.renderRoot.querySelector('sl-button[aria-label^="Next year"]');
      expect(prev).to.exist.and.not.match(':disabled');
      expect(next).to.exist.and.not.match(':disabled');
    });
  });

  describe('min/max boundaries', () => {
    beforeEach(async () => {
      const currentYear = new Date().getFullYear();
      // Allow only months April (3) through September (8)
      const min = new Date(currentYear, 3, 1);
      const max = new Date(currentYear, 8, 1);
      el = await fixture(
        html`<sl-select-month .month=${new Date(currentYear, 5, 1)} .min=${min} .max=${max}></sl-select-month>`
      );
      await el.updateComplete;
    });

    it('should mark months outside range as unselectable buttons', () => {
      const unselectableParts = Array.from(el.renderRoot.querySelectorAll('[part~="unselectable"]'));
      // Months 0,1,2 and 9,10,11 -> 6 unselectables
      expect(unselectableParts).to.have.lengthOf(6);
      const allButtons = unselectableParts.every(node => node.tagName === 'BUTTON' && node.hasAttribute('disabled'));
      expect(allButtons).to.be.true;
    });

    it('should disable navigating to a previous year (since min is current year)', () => {
      const prev = el.renderRoot.querySelector('sl-button[aria-label^="Previous year"]');
      expect(prev).to.exist.and.match(':disabled');
    });

    it('should disable navigating to a next year (since max is current year)', () => {
      const next = el.renderRoot.querySelector('sl-button[aria-label^="Next year"]');
      expect(next).to.exist.and.match(':disabled');
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should emit sl-select when a month button is clicked', async () => {
      const onSelect = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', e => resolve(e as CustomEvent))
      );
      const firstButton = el.renderRoot.querySelector('ol button');
      (firstButton as HTMLButtonElement | null)?.click?.();
      const ev = await onSelect;
      expect(ev.detail).to.be.instanceOf(Date);
      expect((ev.detail as Date).getMonth()).to.equal(parseInt(firstButton!.textContent!.trim().slice(0, 2)) - 1 || 0); // simplistic, month names may vary but at least ensure Date returned
    });

    it('should emit sl-select with current month when Escape is pressed', async () => {
      const currentMonth = el.month.getMonth();
      const onSelect = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', e => resolve(e as CustomEvent))
      );
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const ev = await onSelect;
      expect((ev.detail as Date).getMonth()).to.equal(currentMonth);
    });
  });

  describe('navigation between years', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month .month=${new Date(new Date().getFullYear(), 6, 1)}></sl-select-month>`);
    });

    it('should increment year when next is clicked', async () => {
      const startYear = el.month.getFullYear();
      const next = el.renderRoot.querySelector('sl-button[aria-label^="Next year"]');
      (next as HTMLButtonElement | null)?.click?.();
      await el.updateComplete;
      expect(el.month.getFullYear()).to.equal(startYear + 1);
    });

    it('should decrement year when previous is clicked', async () => {
      const startYear = el.month.getFullYear();
      const prev = el.renderRoot.querySelector('sl-button[aria-label^="Previous year"]');
      (prev as HTMLButtonElement | null)?.click?.();
      await el.updateComplete;
      expect(el.month.getFullYear()).to.equal(startYear - 1);
    });
  });

  describe('toggle year select', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should emit sl-toggle with detail "year" when clicking current year button', async () => {
      const onToggle = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-toggle', e => resolve(e as CustomEvent))
      );
      const toggleBtn = el.renderRoot.querySelector('sl-button.current-year');
      (toggleBtn as HTMLButtonElement | null)?.click?.();
      const ev = await onToggle;
      expect(ev.detail).to.equal('year');
    });
  });
});
