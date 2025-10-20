import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
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
      const years = Array.from(el.renderRoot.querySelectorAll('table.years button')); // 12 year buttons

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

      // ensure they are disabled buttons
      const allDisabled = unselectable.every(node => node.tagName === 'BUTTON' && node.hasAttribute('disabled'));
      expect(allDisabled).to.be.true;
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

    it('should disable prev/next buttons when navigation is fully restricted by min/max', async () => {
      const baseYear = 2025;
      el = await fixture(html`
        <sl-select-year
          .year=${new Date(baseYear, 0, 1)}
          .min=${new Date(baseYear - 5, 0, 1)}
          .max=${new Date(baseYear + 6, 11, 31)}
        ></sl-select-year>
      `);
      await el.updateComplete;

      const prevBtn = el.renderRoot.querySelector('sl-button:nth-of-type(1)');
      const nextBtn = el.renderRoot.querySelector('sl-button:nth-of-type(2)');

      expect(prevBtn).to.have.attribute('disabled');
      expect(nextBtn).to.have.attribute('disabled');
    });

    it('should set "today" and "selected" parts when applicable and "unselectable" when outside min/max', async () => {
      el = await fixture(html`<sl-select-year .year=${new Date(new Date().getFullYear(), 0, 1)}></sl-select-year>`);
      await el.updateComplete;

      el.selected = new Date(new Date().getFullYear(), 0, 1);
      await el.updateComplete;

      const year = el.renderRoot.querySelector('[part~="today"]');

      expect(year).to.exist;
      expect(year?.matches('[part~="today"]')).to.be.true;
      expect(year?.matches('[part~="selected"]')).to.be.true;

      // make current year unselectable by moving min/max beyond it
      el.min = new Date(new Date().getFullYear() + 1, 0, 1);
      el.max = new Date(new Date().getFullYear() + 2, 11, 31);
      await el.updateComplete;

      const yearUnselectable = el.renderRoot.querySelector('[part~="today"]');

      expect(yearUnselectable).to.exist;
      expect(yearUnselectable?.matches('[part~="unselectable"]')).to.be.true;
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
      const button = el.renderRoot.querySelector('table.years button');
      (button as HTMLButtonElement | null)?.click?.();
      const ev = await onSelect;
      expect(ev.detail).to.be.instanceOf(Date);
      expect((ev.detail as Date).getFullYear()).to.equal(parseInt(button!.textContent!.trim()));
    });

    it('should emit sl-select for Escape key returning current year', async () => {
      const currentYear = el.year.getFullYear();
      const onSelect = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', e => resolve(e as CustomEvent), { once: true })
      );

      el.focus();
      await userEvent.keyboard('{Escape}');

      const ev = await onSelect;
      expect(ev.detail).to.be.instanceOf(Date);
      expect((ev.detail as Date).getFullYear()).to.equal(currentYear);
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-year .year=${new Date(2025, 0, 1)}></sl-select-year>`);

      await el.updateComplete;
    });

    it('keydown ArrowLeft on first button should decrement year range by 12', async () => {
      const initialFirst = el.years[0];
      const buttons = el.renderRoot.querySelectorAll('table.years button');
      const first = buttons[0] as HTMLButtonElement;

      first.focus();

      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;

      expect(el.years[0]).to.equal(initialFirst - 12);
    });

    it('keydown ArrowRight on last button should increment year range by 12', async () => {
      const initialLast = el.years.at(-1)!;
      const buttons = el.renderRoot.querySelectorAll('table.years button');
      const last = buttons[buttons.length - 1] as HTMLButtonElement;

      last.focus();

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      expect(el.years.at(-1)).to.equal(initialLast + 12);
    });

    it('keydown ArrowUp on a top-row button should decrement year range by 12', async () => {
      const initialFirst = el.years[0];
      const buttons = el.renderRoot.querySelectorAll('table.years button');
      const target = buttons[1] as HTMLButtonElement; // top row (index 1)

      target.focus();

      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.years[0]).to.equal(initialFirst - 12);
    });

    it('keydown ArrowDown on a last-row button should increment year range by 12', async () => {
      const initialFirst = el.years[0];
      const buttons = el.renderRoot.querySelectorAll('table.years button');
      const target = buttons[10] as HTMLButtonElement; // pick an index in the last row

      target.focus();

      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.years[0]).to.equal(initialFirst + 12);
    });
  });
});
