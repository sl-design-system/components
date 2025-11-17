import { Button } from '@sl-design-system/button';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { SelectYear } from './select-year.js';

try {
  customElements.define('sl-select-year', SelectYear);
} catch {
  /* empty */
}

// Make sure the tests don't break when a new year starts
const currentYear = new Date().getFullYear();

describe('sl-select-year', () => {
  let el: SelectYear;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-year></sl-select-year>`);
    });

    it('should render 12 years', () => {
      const years = Array.from(el.renderRoot.querySelectorAll('table button'));

      expect(years).to.have.lengthOf(12);
      expect(el.years.at(0)).to.equal(currentYear - 5);
      expect(el.years.at(-1)).to.equal(currentYear + 6);
    });

    it('should not show the current year', () => {
      expect(el.showCurrent).not.to.be.true;
    });

    it('should highlight the current year when show-current is set', async () => {
      el.showCurrent = true;
      await el.updateComplete;

      const current = el.renderRoot.querySelector('button.current');

      expect(current).to.exist;
      expect(current).to.have.trimmed.text(currentYear.toString());
    });

    it('should not have a selected year', () => {
      const selectedMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.selected');

      expect(selectedMonthButton).to.not.exist;
      expect(el.selected).to.be.undefined;
    });

    it('should show the selected year when set', async () => {
      el.selected = new Date(currentYear, 0, 1);
      await el.updateComplete;

      const selectedMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.selected');

      expect(selectedMonthButton).to.exist;
      expect(selectedMonthButton).to.have.trimmed.text(currentYear.toString());
    });

    it('should have enabled back and forward buttons', () => {
      const prev = el.renderRoot.querySelector('sl-button[aria-label^="Go back 12 years"]'),
        next = el.renderRoot.querySelector('sl-button[aria-label^="Go forward 12 years"]');

      expect(prev).to.exist.and.not.match(':disabled');
      expect(next).to.exist.and.not.match(':disabled');
    });

    it('should emit sl-select with selected year on click', () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: SlSelectEvent<number>) => {
        onSelect(e.detail);
      });
      el.renderRoot.querySelector<HTMLButtonElement>('table button')?.click();

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear - 5, 0, 1));
    });

    it('should emit sl-select with selected year on enter', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: SlSelectEvent<number>) => {
        onSelect(e.detail);
      });

      const button = el.renderRoot.querySelector<HTMLButtonElement>('table button');
      button?.focus();

      await userEvent.keyboard('{Enter}');

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear - 5, 0, 1));
    });

    it('should emit sl-select with selected year on space', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: SlSelectEvent<number>) => {
        onSelect(e.detail);
      });

      const button = el.renderRoot.querySelector<HTMLButtonElement>('table button');
      button?.focus();

      await userEvent.keyboard(' ');

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear - 5, 0, 1));
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-year></sl-select-year>`);
    });

    it('should go to previous 12 years when previous button clicked', async () => {
      const initialFirst = el.years[0];

      el.renderRoot.querySelector<Button>('sl-button:first-of-type')?.click();
      await el.updateComplete;

      expect(el.years[0]).to.equal(initialFirst - 12);
    });

    it('should go to next 12 years when next button clicked', async () => {
      const initialLast = el.years.at(-1)!;

      el.renderRoot.querySelector<Button>('sl-button:last-of-type')?.click();
      await el.updateComplete;

      expect(el.years.at(-1)).to.equal(initialLast + 12);
    });
  });

  describe('min/max', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select-year
          .min=${new Date(currentYear - 2, 0, 1)}
          .max=${new Date(currentYear + 2, 11, 31)}
        ></sl-select-year>
      `);
    });

    it('should not allow navigating before min boundary', () => {
      const prev = el.renderRoot.querySelector('sl-button:first-of-type');

      expect(prev).to.exist;
      expect(prev).to.match(':disabled');
    });

    it('should not allow navigating after max boundary', () => {
      const next = el.renderRoot.querySelector('sl-button:last-of-type');

      expect(next).to.exist;
      expect(next).to.match(':disabled');
    });

    it('should disable buttons that fall outside min/max', () => {
      const disabled = Array.from(el.renderRoot.querySelectorAll('button')).map(button =>
        button.hasAttribute('disabled')
      );

      expect(disabled).to.deep.equal([true, true, true, false, false, false, false, false, true, true, true, true]);
    });
  });

  describe('keyboard navigation', () => {
    let buttons: HTMLButtonElement[];

    beforeEach(async () => {
      el = await fixture(html`<sl-select-year></sl-select-year>`);
      buttons = Array.from(el.renderRoot.querySelectorAll('button'));
    });

    it('should focus the first year button on focus()', () => {
      el.focus();

      expect(el.shadowRoot?.activeElement).to.equal(buttons.at(0));
    });

    it('should decrement year range by 12 when ArrowLeft is pressed on first button', async () => {
      const initialFirst = el.years[0];

      buttons.at(0)?.focus();
      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(initialFirst - 12);
    });

    it('should increment year range by 12 when ArrowRight is pressed on last button', async () => {
      const initialLast = el.years.at(-1)!;

      buttons.at(-1)?.focus();
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      expect(el.years.at(-1)).to.equal(initialLast + 12);
    });

    it('should decrement year range by 12 when ArrowUp is pressed on a top-row button', async () => {
      const initialFirst = el.years[0];

      buttons.at(1)?.focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.years[0]).to.equal(initialFirst - 12);
    });

    it('should increment year range by 12 when ArrowDown is pressed on a last-row button', async () => {
      const initialFirst = el.years[0];

      buttons.at(11)?.focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.years[0]).to.equal(initialFirst + 12);
    });

    describe('when min/max are set', () => {
      beforeEach(async () => {
        el.min = new Date(currentYear - 1, 0, 1);
        el.max = new Date(currentYear + 1, 11, 31);
        await el.updateComplete;

        buttons = Array.from(el.renderRoot.querySelectorAll('button'));
      });

      it('should do nothing when ArrowLeft is pressed on the first enabled button', async () => {
        const firstEnabledButton = buttons.find(b => !b.disabled),
          initialYears = [...el.years];

        firstEnabledButton?.focus();
        await userEvent.keyboard('{ArrowLeft}');
        await el.updateComplete;

        expect(el.years).to.deep.equal(initialYears);
        expect(el.shadowRoot?.activeElement).to.equal(firstEnabledButton);
      });

      it('should do nothing when ArrowRight is pressed on the last enabled button', async () => {
        const enabledButtons = buttons.filter(b => !b.disabled),
          lastEnabledButton = enabledButtons.at(-1),
          initialYears = [...el.years];

        lastEnabledButton?.focus();
        await userEvent.keyboard('{ArrowRight}');
        await el.updateComplete;

        expect(el.years).to.deep.equal(initialYears);
        expect(el.shadowRoot?.activeElement).to.equal(lastEnabledButton);
      });

      it('should skip disabled buttons when navigating with Arrow keys', async () => {
        const enabledButtons = buttons.filter(b => !b.disabled),
          firstEnabled = enabledButtons[0],
          secondEnabled = enabledButtons[1];

        firstEnabled?.focus();
        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot?.activeElement).to.equal(secondEnabled);
      });

      it('should navigate to the second enabled button when you press ArrowLeft and then ArrowRight on the first enabled button', async () => {
        const enabledButtons = buttons.filter(b => !b.disabled),
          firstEnabled = enabledButtons[0],
          secondEnabled = enabledButtons[1];

        firstEnabled?.focus();

        // ArrowLeft on first button - should do nothing (boundary)
        await userEvent.keyboard('{ArrowLeft}');
        expect(el.shadowRoot?.activeElement).to.equal(firstEnabled);

        // ArrowRight should now work and move to second button
        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot?.activeElement).to.equal(secondEnabled);
      });

      it('should navigate to the second to last enabled button when you press ArrowRight and then ArrowLeft on the last enabled button', async () => {
        const enabledButtons = buttons.filter(b => !b.disabled),
          lastEnabled = enabledButtons.at(-1),
          secondToLastEnabled = enabledButtons.at(-2);

        lastEnabled?.focus();

        // ArrowRight on last button - should do nothing (boundary)
        await userEvent.keyboard('{ArrowRight}');
        expect(el.shadowRoot?.activeElement).to.equal(lastEnabled);

        // ArrowLeft should now work and move to second-to-last button
        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot?.activeElement).to.equal(secondToLastEnabled);
      });
    });
  });
});
