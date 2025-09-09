import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { SelectYear } from './select-year.js';

// Ensure the element is defined for direct usage if not already via calendar/register
try {
  customElements.define('sl-select-year', SelectYear);
} catch {
  /* already defined */
}

describe('sl-select-year', () => {
  let el: SelectYear;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-year></sl-select-year>`);
    });

    it('should render 12 years by default (current year -5 .. current year +6)', () => {
      const current = new Date().getFullYear();
      const years = Array.from(el.renderRoot.querySelectorAll('ol li')); // list items (12)

      expect(years).to.have.lengthOf(12);
      expect(el.years[0]).to.equal(current - 5);
      expect(el.years.at(-1)).to.equal(current + 6);
    });

    it('should highlight today year when show-today is set', async () => {
      el.showToday = true;
      await el.updateComplete;

      const today = new Date().getFullYear();
      const todayButton = el.renderRoot.querySelector('[part~="today"]');
      expect(todayButton).to.exist;
      expect(todayButton?.textContent?.trim()).to.equal(String(today));
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-year></sl-select-year>`);
    });

    it('should go to previous 12 years when previous button clicked', async () => {
      const initialFirst = el.years[0];
      const prevBtn = el.renderRoot.querySelector('sl-button:nth-of-type(1)');
      (prevBtn as HTMLButtonElement | null)?.click?.();
      await el.updateComplete;
      expect(el.years[0]).to.equal(initialFirst - 12);
    });

    it('should go to next 12 years when next button clicked', async () => {
      const initialLast = el.years.at(-1)!;
      const nextBtn = el.renderRoot.querySelector('sl-button:nth-of-type(2)');
      (nextBtn as HTMLButtonElement | null)?.click?.();
      await el.updateComplete;
      expect(el.years.at(-1)).to.equal(initialLast + 12);
    });
  });

  describe('min/max', () => {
    beforeEach(async () => {
      const year = new Date().getFullYear();
      el = await fixture(
        html`<sl-select-year .min=${new Date(year - 2, 0, 1)} .max=${new Date(year + 2, 11, 31)}></sl-select-year>`
      );
    });

    it('should render disabled (unselectable) years outside min/max', () => {
      const unselectable = Array.from(el.renderRoot.querySelectorAll('[part~="unselectable"]'));
      expect(unselectable.length).to.be.greaterThan(0);
      // ensure they are spans not buttons
      const allSpans = unselectable.every(node => node.tagName === 'SPAN');
      expect(allSpans).to.be.true;
    });

    it('should not allow navigating before min boundary', async () => {
      // navigate backwards many times until disabled (safeguard 5 iterations)
      for (let i = 0; i < 5; i++) {
        const prev = el.renderRoot.querySelector('sl-button:nth-of-type(1)');
        if (!prev || prev.hasAttribute('disabled')) break;
        (prev as HTMLButtonElement | null)?.click?.();
        await el.updateComplete;
      }
      const prevBtn = el.renderRoot.querySelector('sl-button:nth-of-type(1)');
      expect(prevBtn).to.have.attribute('disabled');
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-year></sl-select-year>`);
    });

    it('should emit sl-select with selected year on click', async () => {
      const onSelect = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', e => resolve(e as CustomEvent))
      );
      // click middle year (should be a button) - choose the first button
      const button = el.renderRoot.querySelector('ol button');
      (button as HTMLButtonElement | null)?.click?.();
      const ev = await onSelect;
      expect(ev.detail).to.be.instanceOf(Date);
      expect((ev.detail as Date).getFullYear()).to.equal(parseInt(button!.textContent!.trim()));
    });

    it('should emit sl-select for Escape key returning current year', async () => {
      const currentYear = el.year.getFullYear();
      const onSelect = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', e => resolve(e as CustomEvent))
      );
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const ev = await onSelect;
      expect((ev.detail as Date).getFullYear()).to.equal(currentYear);
    });
  });
});
