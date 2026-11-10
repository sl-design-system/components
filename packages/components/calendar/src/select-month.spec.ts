import { Button } from '@sl-design-system/button';
import { getForwardedAccessibleName } from '@sl-design-system/shared/helpers/forward-aria.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { SelectMonth } from './select-month.js';

try {
  customElements.define('sl-select-month', SelectMonth);
} catch {
  /* empty */
}

// Make sure the tests don't break when a new year starts
const currentYear = new Date().getFullYear();

describe('sl-select-month', () => {
  let el: SelectMonth;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should render 12 months', () => {
      const months = el.renderRoot.querySelectorAll('table button');

      expect(months).to.have.lengthOf(12);
      expect(el.months).to.have.lengthOf(12);
    });

    it('should show a year toggle button', () => {
      const toggleBtn = el.renderRoot.querySelector('sl-button.current-year');

      expect(toggleBtn).to.exist;
    });

    it('should not show the current month', () => {
      expect(el.showCurrent).not.to.be.true;
    });

    it('should highlight the current month when show-current is set', async () => {
      el.showCurrent = true;
      await el.updateComplete;

      const currentMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.current');

      expect(currentMonthButton).to.exist;
      expect(currentMonthButton).to.have.trimmed.text(
        new Date().toLocaleString('default', { month: 'long' })
      );
    });

    it('should not have a selected month', () => {
      const selectedMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.selected');

      expect(selectedMonthButton).to.not.exist;
      expect(el.selected).to.be.undefined;
    });

    it('should fill equal-width month tiles with a 48px selection background', async () => {
      el.style.inlineSize = '320px';
      el.selected = new Date(currentYear, 0, 1);
      await el.updateComplete;

      const selected = el.renderRoot.querySelector<HTMLButtonElement>('button.selected')!,
        selectedLabel = selected.querySelector('span')!,
        otherLabel = el.renderRoot.querySelector<HTMLSpanElement>('td:last-child button span')!,
        selectedBounds = selectedLabel.getBoundingClientRect(),
        otherBounds = otherLabel.getBoundingClientRect(),
        buttonBounds = selected.getBoundingClientRect();

      expect(selectedBounds.height).to.equal(48);
      expect(selectedBounds.width).to.be.closeTo(otherBounds.width, 0.1);
      expect(selectedBounds.width).to.be.closeTo(buttonBounds.width - 8, 0.1);
      expect(selectedBounds.width).to.be.greaterThan(60);
    });

    it('should truncate long German month names in narrow tiles while keeping full accessible names', async () => {
      el.style.inlineSize = '238px';
      el.style.font = '20px monospace';
      el.locale = 'de';
      el.month = new Date(2026, 0, 1);
      await el.updateComplete;

      const september = el.buttons[8],
        label = september.querySelector('span')!,
        labelStyle = getComputedStyle(label),
        october = el.buttons[9].querySelector('span')!,
        november = el.buttons[10].querySelector('span')!;

      expect(september).to.have.attribute('aria-label', 'September 2026');
      expect(label).to.have.trimmed.text('September');
      expect(label.scrollWidth).to.be.greaterThan(label.clientWidth);
      expect(labelStyle.overflowX).to.equal('hidden');
      expect(labelStyle.textOverflow).to.equal('ellipsis');
      expect(label.getBoundingClientRect().right).to.be.at.most(
        september.getBoundingClientRect().right
      );
      expect(october.scrollWidth).to.be.greaterThan(october.clientWidth);
      expect(getComputedStyle(october).textOverflow).to.equal('ellipsis');
      expect(november.scrollWidth).to.be.greaterThan(november.clientWidth);
      expect(getComputedStyle(november).textOverflow).to.equal('ellipsis');
    });

    it('should show the selected month when set', async () => {
      el.selected = new Date(currentYear, 5, 1); // June
      await el.updateComplete;

      const selectedMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.selected');

      expect(selectedMonthButton).to.exist;
      expect(selectedMonthButton).to.have.trimmed.text('June');
    });

    it('should have enabled previous and next year buttons', () => {
      const prev = el.renderRoot.querySelector('.arrows sl-button:first-of-type'),
        next = el.renderRoot.querySelector('.arrows sl-button:last-of-type');

      expect(prev).to.exist.and.not.match(':disabled');
      expect(next).to.exist.and.not.match(':disabled');
    });

    it('should have an accessible name for the previous year button', () => {
      const prev = el.renderRoot.querySelector<Button>('.arrows sl-button:first-of-type')!;

      expect(getForwardedAccessibleName(prev)).to.equal(`Previous year, ${currentYear - 1}`);
    });

    it('should have an accessible name for the next year button', () => {
      const next = el.renderRoot.querySelector<Button>('.arrows sl-button:last-of-type')!;

      expect(getForwardedAccessibleName(next)).to.equal(`Next year, ${currentYear + 1}`);
    });

    it('should emit sl-select with selected month when clicked', () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });
      el.renderRoot.querySelector('button')?.click();

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear, 0, 1));
    });

    it('should emit sl-select with selected month on enter', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });

      el.renderRoot.querySelector('button')?.focus();
      await userEvent.keyboard('{Enter}');

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear, 0, 1));
    });

    it('should emit sl-select with selected month on space', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });

      el.renderRoot.querySelector('button')?.focus();
      await userEvent.keyboard(' ');

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear, 0, 1));
    });
  });

  describe('selected range', () => {
    it('should highlight both partially selected boundary months', async () => {
      el = await fixture(html`
        <sl-select-month
          .month=${new Date(2027, 5, 1)}
          .range=${[new Date(2027, 5, 8), new Date(2027, 6, 22)]}></sl-select-month>
      `);

      const selected = el.renderRoot.querySelectorAll('button.selected');

      expect(Array.from(selected, button => button.textContent?.trim())).to.deep.equal([
        'June',
        'July'
      ]);
      expect(Array.from(selected, button => button.getAttribute('aria-pressed'))).to.deep.equal([
        'true',
        'true'
      ]);
      expect(el.buttons[4]).to.have.attribute('aria-pressed', 'false');
      expect(el.buttons[7]).to.have.attribute('aria-pressed', 'false');
    });

    it('should highlight a reversed range across both years without selecting the same months in the wrong year', async () => {
      el = await fixture(html`
        <sl-select-month
          number-of-months="2"
          .month=${new Date(2025, 0, 1)}
          .range=${[new Date(2026, 0, 15), new Date(2025, 11, 20)]}></sl-select-month>
      `);

      const selected = el.renderRoot.querySelectorAll('button.selected');

      expect(Array.from(selected, button => button.getAttribute('aria-label'))).to.deep.equal([
        'December 2025',
        'January 2026'
      ]);
    });

    it('should include a month when the range ends on its first day', async () => {
      el = await fixture(html`
        <sl-select-month
          .month=${new Date(2027, 0, 1)}
          .range=${[new Date(2027, 5, 30, 23), new Date(2027, 6, 1)]}></sl-select-month>
      `);

      expect(
        Array.from(el.renderRoot.querySelectorAll('button.selected'), button =>
          button.textContent?.trim()
        )
      ).to.deep.equal(['June', 'July']);
    });

    it('should remove range highlighting when the range is cleared', async () => {
      el = await fixture(html`
        <sl-select-month
          .month=${new Date(2027, 0, 1)}
          .range=${[new Date(2027, 5, 8), new Date(2027, 6, 22)]}></sl-select-month>
      `);
      el.range = undefined;
      await el.updateComplete;

      expect(el.renderRoot.querySelectorAll('button.selected')).to.have.lengthOf(0);
      expect(el.renderRoot.querySelectorAll('button[aria-pressed="true"]')).to.have.lengthOf(0);
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should increment year when next is clicked', async () => {
      el.renderRoot.querySelector<Button>('.arrows sl-button:last-of-type')?.click();
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(currentYear + 1);
    });

    it('should decrement year when previous is clicked', async () => {
      el.renderRoot.querySelector<Button>('.arrows sl-button:first-of-type')?.click();
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(currentYear - 1);
    });
  });

  describe('min/max', () => {
    beforeEach(async () => {
      // Allow only months April (3) through September (8)
      el = await fixture(html`
        <sl-select-month
          .min=${new Date(currentYear, 3, 1)}
          .max=${new Date(currentYear, 8, 1)}></sl-select-month>
      `);
    });

    it('should mark months outside range as disabled buttons', () => {
      const disabledButtons = Array.from(el.renderRoot.querySelectorAll('table button[disabled]'));

      // Months 0,1,2 and 9,10,11 -> 6 disabled

      expect(disabledButtons).to.have.lengthOf(6);
    });

    it('should disable navigating to a previous year (since min is current year)', () => {
      const prev = el.renderRoot.querySelector('.arrows sl-button:first-of-type');

      expect(prev).to.have.attribute('disabled');
      expect(prev).to.match(':disabled');
    });

    it('should disable navigating to a next year (since max is current year)', () => {
      const next = el.renderRoot.querySelector('.arrows sl-button:last-of-type');

      expect(next).to.have.attribute('disabled');
      expect(next).to.match(':disabled');
    });

    it('should have static year (span) when navigation is fully disabled by min and max', () => {
      const yearButton = el.renderRoot.querySelector('sl-button.current-year'),
        yearSpan = el.renderRoot.querySelector('span.current-year');

      expect(yearButton).to.not.exist;
      expect(yearSpan).to.exist;
    });
  });

  describe('keyboard navigation', () => {
    let month: Date;

    beforeEach(async () => {
      month = new Date(2025, 6, 1);

      el = await fixture(html`<sl-select-month .month=${month}></sl-select-month>`);

      await el.updateComplete;
    });

    it('should decrement year when ArrowLeft is pressed on first button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');
      const first = buttons[0] as HTMLButtonElement;

      first.focus();
      await userEvent.keyboard('{ArrowLeft}');

      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(month.getFullYear() - 1);
    });

    it('should increment year when ArrowRight is pressed on last button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');
      const last = buttons[buttons.length - 1] as HTMLButtonElement;

      last.focus();
      await userEvent.keyboard('{ArrowRight}');

      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(month.getFullYear() + 1);
    });

    it('should decrement year when ArrowUp is pressed on a top row button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');
      // pick index 1 (top row, middle)
      const target = buttons[1] as HTMLButtonElement;

      target.focus();
      await userEvent.keyboard('{ArrowUp}');

      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(month.getFullYear() - 1);
    });

    it('should keep column focus when ArrowUp loads previous year months', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');

      (buttons[1] as HTMLButtonElement).focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      const newButtons = el.renderRoot.querySelectorAll('table button');

      expect(el.shadowRoot?.activeElement).to.equal(newButtons[10]);
    });

    it('should increment year when ArrowDown is pressed on a last row button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');
      // For 12 months and 3 columns, lastRowStart is index 9, choose index 10
      const target = buttons[10] as HTMLButtonElement;

      target.focus();
      await userEvent.keyboard('{ArrowDown}');

      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(month.getFullYear() + 1);
    });

    it('should keep column focus when ArrowDown loads next year months', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');

      (buttons[10] as HTMLButtonElement).focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      const newButtons = el.renderRoot.querySelectorAll('table button');

      expect(el.shadowRoot?.activeElement).to.equal(newButtons[1]);
    });

    it('should move focus to next month when ArrowRight is pressed on a non-last button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button'),
        febButton = buttons[1] as HTMLButtonElement,
        marButton = buttons[2] as HTMLButtonElement;

      febButton.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot?.activeElement).to.equal(marButton);
    });

    it('should move focus to previous month when ArrowLeft is pressed on a non-first button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button'),
        febButton = buttons[1] as HTMLButtonElement,
        marButton = buttons[2] as HTMLButtonElement;

      marButton.focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.equal(febButton);
    });

    it('should move focus down one row when ArrowDown is pressed on a non-last-row button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button'),
        febButton = buttons[1] as HTMLButtonElement,
        mayButton = buttons[4] as HTMLButtonElement;

      febButton.focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot?.activeElement).to.equal(mayButton);
    });

    it('should move focus up one row when ArrowUp is pressed on a non-first-row button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button'),
        febButton = buttons[1] as HTMLButtonElement,
        mayButton = buttons[4] as HTMLButtonElement;

      mayButton.focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(el.shadowRoot?.activeElement).to.equal(febButton);
    });

    describe('when min/max are set', () => {
      let buttons: HTMLButtonElement[];

      beforeEach(async () => {
        el.min = new Date(month.getFullYear(), 3, 1); // April
        el.max = new Date(month.getFullYear(), 8, 1); // September
        await el.updateComplete;

        buttons = Array.from(el.renderRoot.querySelectorAll('table button'));
      });

      it('should do nothing when ArrowLeft is pressed on the first enabled button', async () => {
        const firstEnabledButton = buttons.find(b => !b.disabled);

        firstEnabledButton?.focus();
        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot?.activeElement).to.equal(firstEnabledButton);
      });

      it('should do nothing when ArrowRight is pressed on the last enabled button', async () => {
        const enabledButtons = buttons.filter(b => !b.disabled),
          lastEnabledButton = enabledButtons.at(-1);

        lastEnabledButton?.focus();
        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot?.activeElement).to.equal(lastEnabledButton);
      });

      it('should navigate to the second enabled button when you press ArrowLeft and then ArrowRight on the first enabled button', async () => {
        const enabledButtons = buttons.filter(b => !b.disabled),
          firstEnabled = enabledButtons[0],
          secondEnabled = enabledButtons[1];

        firstEnabled?.focus();

        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot?.activeElement).to.equal(firstEnabled);

        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot?.activeElement).to.equal(secondEnabled);
      });

      it('should move focus to the previous enabled button after ArrowRight then ArrowLeft on the last enabled button', async () => {
        const enabledButtons = buttons.filter(b => !b.disabled),
          lastEnabled = enabledButtons.at(-1),
          secondToLastEnabled = enabledButtons.at(-2);

        lastEnabled?.focus();

        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot?.activeElement).to.equal(lastEnabled);

        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot?.activeElement).to.equal(secondToLastEnabled);
      });
    });
  });

  describe('two-month layout', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select-month number-of-months="2" .month=${new Date(2025, 0, 1)}></sl-select-month>
      `);
    });

    it('should show two consecutive years as separate 3 by 4 month grids with a 24px gap', () => {
      const tables = el.renderRoot.querySelectorAll('table'),
        grids = el.renderRoot.querySelector('.month-grids')!;

      expect(el.months).to.have.lengthOf(24);
      expect(el.buttons).to.have.lengthOf(24);
      expect(tables).to.have.lengthOf(2);
      expect(tables[0]).to.have.attribute('aria-label', 'Months of 2025');
      expect(tables[1]).to.have.attribute('aria-label', 'Months of 2026');
      expect(tables[0].querySelectorAll('tbody tr')).to.have.lengthOf(4);
      expect(tables[1].querySelectorAll('tbody tr')).to.have.lengthOf(4);
      expect(tables[0].querySelector('tr')!.children).to.have.lengthOf(3);
      expect(tables[1].querySelector('tr')!.children).to.have.lengthOf(3);
      expect(getComputedStyle(grids).columnGap).to.equal('24px');
      expect(
        tables[1].getBoundingClientRect().left - tables[0].getBoundingClientRect().right
      ).to.be.closeTo(24, 0.5);
    });

    it('should select a month from the second year with the correct date', async () => {
      const onSelect = spy();
      el.addEventListener('sl-select', (event: CustomEvent<Date>) => {
        onSelect(event.detail);
      });
      el.buttons[17].click();
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(2026, 5, 1));
      expect(el.selected).to.equalDate(new Date(2026, 5, 1));
      expect(el.renderRoot.querySelectorAll('button.selected')).to.have.lengthOf(1);
      expect(el.renderRoot.querySelector('button.selected')).to.have.attribute(
        'aria-label',
        'June 2026'
      );
    });

    it('should highlight the current month only in its own year', async () => {
      el.month = new Date(currentYear - 1, 0, 1);
      el.showCurrent = true;
      await el.updateComplete;

      const current = el.renderRoot.querySelector('button.current')!;

      expect(el.renderRoot.querySelectorAll('button.current')).to.have.lengthOf(1);
      expect(current).to.equal(el.buttons[12 + new Date().getMonth()]);
    });

    it('should page forward by two years', async () => {
      el.renderRoot.querySelector<Button>('.arrows sl-button:last-of-type')!.click();
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(2027);
      expect(el.months.at(0)!.date).to.equalDate(new Date(2027, 0, 1));
      expect(el.months.at(-1)!.date).to.equalDate(new Date(2028, 11, 1));
    });

    it('should page backward by two years', async () => {
      el.renderRoot.querySelector<Button>('.arrows sl-button:first-of-type')!.click();
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(2023);
      expect(el.months.at(0)!.date).to.equalDate(new Date(2023, 0, 1));
      expect(el.months.at(-1)!.date).to.equalDate(new Date(2024, 11, 1));
    });

    it('should navigate from December in the first panel to January in the second', async () => {
      el.buttons[11].focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[12]);
      expect(el.shadowRoot?.activeElement).to.have.attribute('aria-label', 'January 2026');
      expect(el.month.getFullYear()).to.equal(2025);
    });

    it('should navigate back from January in the second panel to December in the first', async () => {
      el.buttons[12].focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[11]);
      expect(el.month.getFullYear()).to.equal(2025);
    });

    it('should keep the column when vertical navigation crosses into the next panel', async () => {
      el.buttons[10].focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[13]);
      expect(el.shadowRoot?.activeElement).to.have.attribute('aria-label', 'February 2026');
    });

    it('should keep the column when ArrowUp loads an earlier pair of years', async () => {
      el.buttons[1].focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(2023);
      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[22]);
      expect(el.shadowRoot?.activeElement).to.have.attribute('aria-label', 'November 2024');
    });

    it('should keep the column when ArrowDown loads a later pair of years', async () => {
      el.buttons[22].focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(2027);
      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[1]);
      expect(el.shadowRoot?.activeElement).to.have.attribute('aria-label', 'February 2027');
    });

    it('should keep all enabled months reachable when min and max span the two panels', async () => {
      el.min = new Date(2025, 10, 1);
      el.max = new Date(2026, 1, 28);
      await el.updateComplete;
      el.buttons[10].focus();
      await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');

      expect(Array.from(el.buttons).filter(button => !button.disabled)).to.have.lengthOf(4);
      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[13]);
      expect(el.renderRoot.querySelector('.arrows sl-button:first-of-type')).to.match(':disabled');
      expect(el.renderRoot.querySelector('.arrows sl-button:last-of-type')).to.match(':disabled');
    });

    it('should retain an enabled year when collapsing a browsed pair with header focus', async () => {
      el.month = new Date(2026, 0, 1);
      el.min = new Date(2025, 5, 1);
      await el.updateComplete;

      const previous = el.renderRoot.querySelector<Button>('.arrows sl-button:first-of-type')!;
      previous.click();
      await el.updateComplete;
      const next = el.renderRoot.querySelector<Button>('.arrows sl-button:last-of-type')!;
      next.focus();

      expect(el.shadowRoot?.activeElement).to.equal(next);
      expect(el.month.getFullYear()).to.equal(2024);
      expect(el.months[12].date.getFullYear()).to.equal(2025);

      el.numberOfMonths = 1;
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(2025);
      expect(el.buttons[4]).to.match(':disabled');
      expect(el.buttons[5]).not.to.match(':disabled');
      expect(el.buttons[11]).not.to.match(':disabled');
      expect(el.renderRoot.querySelector('.arrows sl-button:first-of-type')).to.match(':disabled');
    });

    it('should keep the focused month and browsed year when collapsing and expanding', async () => {
      el.buttons[22].focus();
      el.numberOfMonths = 1;
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(2026);
      expect(el.months).to.have.lengthOf(12);
      expect(el.shadowRoot?.activeElement).to.have.attribute('aria-label', 'November 2026');

      el.numberOfMonths = 2;
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(2026);
      expect(el.months).to.have.lengthOf(24);
      expect(el.shadowRoot?.activeElement).to.have.attribute('aria-label', 'November 2026');
    });
  });

  describe('dialog tab escape', () => {
    it('should not cycle back to the header when tabbing forward from the table', async () => {
      const dialog = await fixture<HTMLDialogElement>(html`
        <dialog open>
          <sl-select-month></sl-select-month>
        </dialog>
      `);
      const monthPicker = dialog.querySelector<SelectMonth>('sl-select-month')!;

      await monthPicker.updateComplete;

      const rightArrow = monthPicker.renderRoot.querySelector<HTMLElement>(
        '.arrows sl-button:last-of-type'
      );

      rightArrow?.focus();
      await userEvent.keyboard('{Tab}');
      await monthPicker.updateComplete;

      await userEvent.keyboard('{Tab}');
      await monthPicker.updateComplete;

      const activeInsideShadow = monthPicker.shadowRoot?.activeElement as HTMLElement | null;

      expect(activeInsideShadow).to.be.null;
    });
  });
});
