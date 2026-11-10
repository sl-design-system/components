import { Button } from '@sl-design-system/button';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './register.js';
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

    it('should fill equal-width year tiles with a 48px selection background', async () => {
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

    it('should show the selected year when set', async () => {
      el.selected = new Date(currentYear, 0, 1);
      await el.updateComplete;

      const selectedMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.selected');

      expect(selectedMonthButton).to.exist;
      expect(selectedMonthButton).to.have.trimmed.text(currentYear.toString());
    });

    it('should have enabled back and forward buttons', () => {
      const prev = el.renderRoot.querySelector('header sl-button:first-of-type'),
        next = el.renderRoot.querySelector('header sl-button:last-of-type');

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

  describe('selected range', () => {
    it('should highlight both boundary years and every year between them', async () => {
      el = await fixture(html`
        <sl-select-year
          .year=${new Date(2026, 0, 1)}
          .range=${[new Date(2025, 5, 8), new Date(2027, 6, 22)]}></sl-select-year>
      `);

      const selected = el.renderRoot.querySelectorAll('button.selected');

      expect(Array.from(selected, button => button.textContent?.trim())).to.deep.equal([
        '2025',
        '2026',
        '2027'
      ]);
      expect(Array.from(selected, button => button.getAttribute('aria-pressed'))).to.deep.equal([
        'true',
        'true',
        'true'
      ]);
    });

    it('should highlight the same years for a reversed range', async () => {
      el = await fixture(html`
        <sl-select-year
          .year=${new Date(2026, 0, 1)}
          .range=${[new Date(2027, 6, 22), new Date(2025, 5, 8)]}></sl-select-year>
      `);

      expect(
        Array.from(el.renderRoot.querySelectorAll('button.selected'), button =>
          button.textContent?.trim()
        )
      ).to.deep.equal(['2025', '2026', '2027']);
    });

    it('should include a year when the range ends on January first', async () => {
      el = await fixture(html`
        <sl-select-year
          .year=${new Date(2026, 0, 1)}
          .range=${[new Date(2025, 11, 31, 23), new Date(2026, 0, 1)]}></sl-select-year>
      `);

      expect(
        Array.from(el.renderRoot.querySelectorAll('button.selected'), button =>
          button.textContent?.trim()
        )
      ).to.deep.equal(['2025', '2026']);
    });

    it('should remove range highlighting when the range is cleared', async () => {
      el = await fixture(html`
        <sl-select-year
          .year=${new Date(2026, 0, 1)}
          .range=${[new Date(2025, 5, 8), new Date(2027, 6, 22)]}></sl-select-year>
      `);
      el.range = undefined;
      await el.updateComplete;

      expect(el.renderRoot.querySelectorAll('button.selected')).to.have.lengthOf(0);
      expect(el.renderRoot.querySelectorAll('button[aria-pressed="true"]')).to.have.lengthOf(0);
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
          .max=${new Date(currentYear + 2, 11, 31)}></sl-select-year>
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

      expect(disabled).to.deep.equal([
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true
      ]);
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

    it('should keep column focus when ArrowUp loads previous years', async () => {
      buttons.at(1)?.focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      const newButtons = Array.from(
        el.renderRoot.querySelectorAll<HTMLButtonElement>('table button')
      );

      expect(el.shadowRoot?.activeElement).to.equal(newButtons.at(10));
    });

    it('should continue arrow navigation after loading a new range', async () => {
      buttons.at(1)?.focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      const newButtons = Array.from(
        el.renderRoot.querySelectorAll<HTMLButtonElement>('table button')
      );

      expect(el.shadowRoot?.activeElement).to.equal(newButtons.at(11));
    });

    it('should increment year range by 12 when ArrowDown is pressed on a last-row button', async () => {
      const initialFirst = el.years[0];

      buttons.at(11)?.focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.years[0]).to.equal(initialFirst + 12);
    });

    it('should keep column focus when ArrowDown loads next years', async () => {
      buttons.at(10)?.focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      const newButtons = Array.from(
        el.renderRoot.querySelectorAll<HTMLButtonElement>('table button')
      );

      expect(el.shadowRoot?.activeElement).to.equal(newButtons.at(1));
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

      it('should move focus to the previous enabled button after ArrowRight then ArrowLeft on the last enabled button', async () => {
        const enabledButtons = buttons.filter(b => !b.disabled),
          lastEnabled = enabledButtons.at(-1),
          secondToLastEnabled = enabledButtons.at(-2);

        lastEnabled?.focus();

        // ArrowRight on last button - should do nothing
        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot?.activeElement).to.equal(lastEnabled);

        // ArrowLeft should now move focus to the previous enabled button
        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot?.activeElement).to.equal(secondToLastEnabled);
      });
    });
  });

  describe('two-month layout', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-year number-of-months="2"></sl-select-year>`);
    });

    it('should render 20 years in four rows of five columns', () => {
      const rows = el.renderRoot.querySelectorAll('tbody tr');

      expect(el.years).to.have.lengthOf(20);
      expect(el.years.at(0)).to.equal(currentYear - 5);
      expect(el.years.at(-1)).to.equal(currentYear + 14);
      expect(rows).to.have.lengthOf(4);
      expect(Array.from(rows, row => row.children.length)).to.deep.equal([5, 5, 5, 5]);
      expect(
        el.renderRoot.querySelector('td[aria-rowindex="4"][aria-colindex="5"] button')
      ).to.have.trimmed.text(String(currentYear + 14));
    });

    it('should move forward by 20 years and describe that step', async () => {
      const next = el.renderRoot.querySelector<Button>('sl-button:last-of-type')!;

      expect(next.renderRoot.querySelector('button')).to.have.attribute(
        'aria-label',
        'Go forward 20 years'
      );

      next.click();
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(currentYear + 15);
      expect(el.years.at(-1)).to.equal(currentYear + 34);
    });

    it('should move back by 20 years and describe that step', async () => {
      const previous = el.renderRoot.querySelector<Button>('sl-button:first-of-type')!;

      expect(previous.renderRoot.querySelector('button')).to.have.attribute(
        'aria-label',
        'Go back 20 years'
      );

      previous.click();
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(currentYear - 25);
      expect(el.years.at(-1)).to.equal(currentYear - 6);
    });

    it('should move down five years within the grid', async () => {
      el.buttons[2].focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[7]);
    });

    it('should keep the column when ArrowUp loads the previous 20 years', async () => {
      el.buttons[2].focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(currentYear - 25);
      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[17]);
    });

    it('should keep the column when ArrowDown loads the next 20 years', async () => {
      el.buttons[17].focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(currentYear + 15);
      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[2]);
    });

    it('should respect min and max in the expanded grid', async () => {
      el.min = new Date(currentYear - 2, 0, 1);
      el.max = new Date(currentYear + 2, 11, 31);
      await el.updateComplete;

      const enabled = Array.from(el.buttons).filter(button => !button.disabled),
        firstYear = el.years[0];
      enabled[0].focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(enabled.map(button => button.textContent?.trim())).to.deep.equal([
        String(currentYear - 2),
        String(currentYear - 1),
        String(currentYear),
        String(currentYear + 1),
        String(currentYear + 2)
      ]);
      expect(el.renderRoot.querySelector('sl-button:first-of-type')).to.match(':disabled');
      expect(el.renderRoot.querySelector('sl-button:last-of-type')).to.match(':disabled');
      expect(el.years[0]).to.equal(firstYear);
      expect(el.shadowRoot?.activeElement).to.equal(enabled[0]);
    });

    it('should preserve the browsed start when collapsing after paging forward', async () => {
      el.year = new Date(2026, 0, 1);
      await el.updateComplete;
      el.renderRoot.querySelector<Button>('sl-button:last-of-type')!.click();
      await el.updateComplete;
      el.numberOfMonths = 1;
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(2041);
      expect(el.years.at(-1)).to.equal(2052);

      el.numberOfMonths = 2;
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(2041);
      expect(el.years.at(-1)).to.equal(2060);
    });

    it('should preserve the browsed start when collapsing after paging backward', async () => {
      el.year = new Date(2026, 0, 1);
      await el.updateComplete;
      el.renderRoot.querySelector<Button>('sl-button:first-of-type')!.click();
      await el.updateComplete;
      el.numberOfMonths = 1;
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(2001);
      expect(el.years.at(-1)).to.equal(2012);
    });

    it('should keep a focused year visible when it would fall outside the smaller grid', async () => {
      el.year = new Date(2026, 0, 1);
      await el.updateComplete;
      el.renderRoot.querySelector<Button>('sl-button:last-of-type')!.click();
      await el.updateComplete;
      el.buttons[19].focus();
      el.numberOfMonths = 1;
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(2049);
      expect(el.years.at(-1)).to.equal(2060);
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('2060');

      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('2059');
    });

    it('should preserve focus on the same year when expanding a browsed grid', async () => {
      el.year = new Date(2026, 0, 1);
      el.numberOfMonths = 1;
      await el.updateComplete;
      el.renderRoot.querySelector<Button>('sl-button:last-of-type')!.click();
      await el.updateComplete;
      el.buttons[7].focus();
      el.numberOfMonths = 2;
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(2033);
      expect(el.years.at(-1)).to.equal(2052);
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('2040');

      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('2045');
    });

    it('should recenter on an explicit year change even after browsing and resizing', async () => {
      el.year = new Date(2026, 0, 1);
      await el.updateComplete;
      el.renderRoot.querySelector<Button>('sl-button:last-of-type')!.click();
      await el.updateComplete;
      el.year = new Date(2030, 0, 1);
      el.numberOfMonths = 1;
      await el.updateComplete;

      expect(el.years.at(0)).to.equal(2025);
      expect(el.years.at(-1)).to.equal(2036);
    });

    it('should restore the 12-year grid when collapsing to one month', async () => {
      el.numberOfMonths = 1;
      await el.updateComplete;
      el.buttons[1].focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(el.years).to.have.lengthOf(12);
      expect(el.renderRoot.querySelector('tbody tr')!.children).to.have.lengthOf(3);
      expect(el.shadowRoot?.activeElement).to.equal(el.buttons[4]);
    });
  });

  describe('dialog tab escape', () => {
    it('should not cycle back to header when tabbing forward from the table', async () => {
      const dialog = await fixture<HTMLDialogElement>(html`
        <dialog open>
          <sl-select-year></sl-select-year>
        </dialog>
      `);
      const yearPicker = dialog.querySelector<SelectYear>('sl-select-year')!;

      await yearPicker.updateComplete;

      const rightArrow = yearPicker.renderRoot.querySelector<HTMLElement>(
        'header sl-button:last-of-type'
      );

      rightArrow?.focus();
      await userEvent.keyboard('{Tab}');
      await yearPicker.updateComplete;

      await userEvent.keyboard('{Tab}');
      await yearPicker.updateComplete;

      const activeInsideShadow = yearPicker.shadowRoot?.activeElement as HTMLElement | null;

      expect(activeInsideShadow).to.be.null;
    });
  });
});
