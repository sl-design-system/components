import { type SlAnnounceEvent } from '@sl-design-system/announcer';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { type LitElement, html } from 'lit';
import sinon, { type SinonSpy, spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { type MonthView } from './month-view.js';
import { SelectDay } from './select-day.js';

try {
  customElements.define('sl-select-day', SelectDay);
} catch {
  /* already defined */
}

describe('sl-select-day', () => {
  let el: SelectDay;

  beforeEach(() => {
    // March 2023
    // --------------------
    // Mo Tu We Th Fr Sa Su
    // 27 28  1  2  3  4  5
    //  6  7  8  9 10 11 12
    // 13 14 15 16 17 18 19
    // 20 21 22 23 24 25 26
    // 27 28 29 30 31  1  2
    vi.setSystemTime(new Date(2023, 2, 14));
  });

  afterEach(() => vi.useRealTimers());

  it('should measure rem spacing tokens in pixels with a 16px root font', async () => {
    const rootStyle = document.documentElement.style,
      previousFontSize = rootStyle.fontSize;
    rootStyle.fontSize = '16px';
    try {
      const controlsGap = 8,
        headerGap = 24;
      el = await fixture(html`
        <sl-select-day
          locale="en-GB"
          style=${`--sl-size-100: ${controlsGap}px; --sl-size-300: ${headerGap}px`}></sl-select-day>
      `);
      await document.fonts.ready;

      await vi.waitFor(() =>
        expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
      );
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const pixelHeaderSize = el.style.getPropertyValue('--_header-inline-size'),
        pixelControlsSize = el.style.getPropertyValue('--_header-controls-inline-size');

      el.style.setProperty('--sl-size-100', '0.5rem');
      el.style.setProperty('--sl-size-300', '1.5rem');
      // Trigger the same header measurement used when navigating the calendar.
      el.month = new Date(2026, 8, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);

      await vi.waitFor(() => {
        expect(el.style.getPropertyValue('--_header-inline-size')).to.equal(pixelHeaderSize);
        expect(el.style.getPropertyValue('--_header-controls-inline-size')).to.equal(
          pixelControlsSize
        );
      });
    } finally {
      rootStyle.fontSize = previousFontSize;
    }
  });

  it('should measure rem spacing tokens in pixels with a 20px root font', async () => {
    const rootStyle = document.documentElement.style,
      previousFontSize = rootStyle.fontSize;
    rootStyle.fontSize = '20px';
    try {
      const controlsGap = 10,
        headerGap = 30;
      el = await fixture(html`
        <sl-select-day
          locale="en-GB"
          style=${`--sl-size-100: ${controlsGap}px; --sl-size-300: ${headerGap}px`}></sl-select-day>
      `);
      await document.fonts.ready;
      await vi.waitFor(() =>
        expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
      );
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const pixelHeaderSize = el.style.getPropertyValue('--_header-inline-size'),
        pixelControlsSize = el.style.getPropertyValue('--_header-controls-inline-size');
      el.style.setProperty('--sl-size-100', '0.5rem');
      el.style.setProperty('--sl-size-300', '1.5rem');
      // Trigger the same header measurement used when navigating the calendar.
      el.month = new Date(2026, 8, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      await vi.waitFor(() => {
        expect(el.style.getPropertyValue('--_header-inline-size')).to.equal(pixelHeaderSize);
        expect(el.style.getPropertyValue('--_header-controls-inline-size')).to.equal(
          pixelControlsSize
        );
      });
    } finally {
      rootStyle.fontSize = previousFontSize;
    }
  });

  it('should keep header controls stable across all months in en-GB with 1 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="en-GB" number-of-months="1"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );

    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);

    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );

      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in en-GB with 2 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="en-GB" number-of-months="2"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);

      {
        const label = el.renderRoot.querySelector<HTMLElement>('.following-month-label')!,
          secondMonth = el.renderRoot.querySelectorAll('.days-of-week')[1],
          labelStart =
            label.getBoundingClientRect().left +
            Number.parseFloat(getComputedStyle(label).paddingInlineStart);

        expect(labelStart).to.be.closeTo(secondMonth.getBoundingClientRect().left, 1);
      }
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in nl-NL with 1 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="nl-NL" number-of-months="1"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in nl-NL with 2 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="nl-NL" number-of-months="2"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);

      {
        const label = el.renderRoot.querySelector<HTMLElement>('.following-month-label')!,
          secondMonth = el.renderRoot.querySelectorAll('.days-of-week')[1],
          labelStart =
            label.getBoundingClientRect().left +
            Number.parseFloat(getComputedStyle(label).paddingInlineStart);

        expect(labelStart).to.be.closeTo(secondMonth.getBoundingClientRect().left, 1);
      }
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in pl-PL with 1 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="pl-PL" number-of-months="1"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in pl-PL with 2 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="pl-PL" number-of-months="2"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);

      {
        const label = el.renderRoot.querySelector<HTMLElement>('.following-month-label')!,
          secondMonth = el.renderRoot.querySelectorAll('.days-of-week')[1],
          labelStart =
            label.getBoundingClientRect().left +
            Number.parseFloat(getComputedStyle(label).paddingInlineStart);

        expect(labelStart).to.be.closeTo(secondMonth.getBoundingClientRect().left, 1);
      }
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in de-DE with 1 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="de-DE" number-of-months="1"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in de-DE with 2 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="de-DE" number-of-months="2"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);

      {
        const label = el.renderRoot.querySelector<HTMLElement>('.following-month-label')!,
          secondMonth = el.renderRoot.querySelectorAll('.days-of-week')[1],
          labelStart =
            label.getBoundingClientRect().left +
            Number.parseFloat(getComputedStyle(label).paddingInlineStart);

        expect(labelStart).to.be.closeTo(secondMonth.getBoundingClientRect().left, 1);
      }
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in fi-FI with 1 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="fi-FI" number-of-months="1"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep header controls stable across all months in fi-FI with 2 visible months', async () => {
    el = await fixture(html` <sl-select-day locale="fi-FI" number-of-months="2"></sl-select-day> `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    // Font loading and child control updates can schedule a final header measurement.
    await new Promise(requestAnimationFrame);
    const header = el.renderRoot.querySelector<HTMLElement>('header')!,
      year = el.renderRoot.querySelector<HTMLElement>('.current-year')!,
      previous = el.renderRoot.querySelector<HTMLElement>('.previous-month')!,
      next = el.renderRoot.querySelector<HTMLElement>('.next-month')!,
      initialWidth = el.getBoundingClientRect().width,
      initialYear = year.getBoundingClientRect().left,
      initialPrevious = previous.getBoundingClientRect().left,
      initialNext = next.getBoundingClientRect().left;
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2026, month, 1);
      await el.updateComplete;
      await Promise.all(
        Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
          label => label.updateComplete
        )
      );
      const controls = el.renderRoot.querySelector<HTMLElement>('.month-year-controls')!,
        monthBounds = el.renderRoot.querySelector('.current-month')!.getBoundingClientRect(),
        yearBounds = year.getBoundingClientRect(),
        previousBounds = previous.getBoundingClientRect(),
        nextBounds = next.getBoundingClientRect();
      const monthLabel = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!;

      expect(monthLabel.scrollWidth).to.be.at.most(monthLabel.clientWidth + 1);
      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(yearBounds.left).to.be.closeTo(initialYear, 1);
      expect(previousBounds.left).to.equal(initialPrevious);
      expect(nextBounds.left).to.equal(initialNext);
      expect(yearBounds.left - monthBounds.right).to.equal(8);
      expect(nextBounds.left - previousBounds.right).to.equal(4);
      expect(controls.getBoundingClientRect().right).to.be.at.most(previousBounds.left);
      expect(nextBounds.right).to.be.at.most(header.getBoundingClientRect().right);

      {
        const label = el.renderRoot.querySelector<HTMLElement>('.following-month-label')!,
          secondMonth = el.renderRoot.querySelectorAll('.days-of-week')[1],
          labelStart =
            label.getBoundingClientRect().left +
            Number.parseFloat(getComputedStyle(label).paddingInlineStart);

        expect(labelStart).to.be.closeTo(secondMonth.getBoundingClientRect().left, 1);
      }
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep navigation stationary across years with 1 preferred months', async () => {
    el = await fixture(html`
      <sl-select-day
        locale="es"
        number-of-months="1"
        .month=${new Date(2019, 0, 1)}
        style="font-family: Georgia, serif; font-variant-numeric: proportional-nums"></sl-select-day>
    `);
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    await new Promise(requestAnimationFrame);
    const initialWidth = el.getBoundingClientRect().width,
      previous = el.renderRoot.querySelector('.previous-month')!,
      next = el.renderRoot.querySelector('.next-month')!,
      previousLeft = previous.getBoundingClientRect().left,
      nextLeft = next.getBoundingClientRect().left;
    const checkYearNavigation = async (year: number): Promise<void> => {
      el.month = new Date(year, 0, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);

      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(previous.getBoundingClientRect().left).to.equal(previousLeft);
      expect(next.getBoundingClientRect().left).to.equal(nextLeft);
    };
    await checkYearNavigation(2020);
    await checkYearNavigation(2021);
    await checkYearNavigation(2028);
    await checkYearNavigation(2019);
  });

  it('should keep navigation stationary across years with 2 preferred months', async () => {
    el = await fixture(html`
      <sl-select-day
        locale="es"
        number-of-months="2"
        .month=${new Date(2019, 0, 1)}
        style="font-family: Georgia, serif; font-variant-numeric: proportional-nums"></sl-select-day>
    `);
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    await new Promise(requestAnimationFrame);
    const initialWidth = el.getBoundingClientRect().width,
      previous = el.renderRoot.querySelector('.previous-month')!,
      next = el.renderRoot.querySelector('.next-month')!,
      previousLeft = previous.getBoundingClientRect().left,
      nextLeft = next.getBoundingClientRect().left;
    const checkYearNavigation = async (year: number): Promise<void> => {
      el.month = new Date(year, 0, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);

      expect(el.getBoundingClientRect().width).to.equal(initialWidth);
      expect(previous.getBoundingClientRect().left).to.equal(previousLeft);
      expect(next.getBoundingClientRect().left).to.equal(nextLeft);
    };
    await checkYearNavigation(2020);
    await checkYearNavigation(2021);
    await checkYearNavigation(2028);
    await checkYearNavigation(2019);
  });

  it('should reserve the semibold month width when proportional digits make the font shorthand empty', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <span
          style="display: inline-block; font-family: Georgia, serif; font-size: 20px; font-weight: 600; font-variant-numeric: proportional-nums"
          >September</span
        >
        <sl-select-day
          locale="en-GB"
          .month=${new Date(2026, 8, 1)}
          style="font-family: Georgia, serif; font-size: 20px; font-variant-numeric: proportional-nums"></sl-select-day>
      </div>
    `);
    el = container.querySelector('sl-select-day')!;
    await document.fonts.ready;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_month-control-inline-size')).not.to.equal('')
    );

    const button = el.renderRoot.querySelector('.current-month')!,
      label = button.querySelector('sl-format-date')!,
      reference = container.querySelector('span')!;

    expect(getComputedStyle(button).font).to.equal('');
    expect(label.getBoundingClientRect().width).to.be.at.least(
      reference.getBoundingClientRect().width
    );
  });

  it('should load the header font when its computed shorthand is empty', async () => {
    const loadFont = vi.spyOn(document.fonts, 'load');

    try {
      el = await fixture(html`
        <sl-select-day
          locale="en-GB"
          style="font-family: Georgia, serif; font-size: 20px; font-variant-numeric: proportional-nums"></sl-select-day>
      `);

      await vi.waitFor(() => {
        expect(loadFont).toHaveBeenCalledWith('normal 600 20px Georgia, serif');
      });
    } finally {
      el?.remove();
      loadFont.mockRestore();
    }
  });

  it('should remeasure header controls when document.fonts.ready resolves after firstUpdated', async () => {
    let resolveFonts!: (fonts: FontFaceSet) => void;
    const pendingFonts = new Promise<FontFaceSet>(resolve => {
        resolveFonts = resolve;
      }),
      fontsReady = sinon.stub(document.fonts, 'ready').get(() => pendingFonts);

    try {
      el = await fixture(html`
        <sl-select-day locale="en-GB" .month=${new Date(2026, 8, 1)}></sl-select-day>
      `);

      await vi.waitFor(() =>
        expect(el.style.getPropertyValue('--_month-control-inline-size')).not.to.equal('')
      );

      const initialWidth = Number.parseFloat(
          el.style.getPropertyValue('--_month-control-inline-size')
        ),
        labelSizer = el.renderRoot.querySelector<HTMLElement>('.current-month .label-sizer')!;

      // Simulate wider glyph metrics once the web font finishes loading without triggering Lit updates or host resize.
      labelSizer.style.letterSpacing = '4px';
      resolveFonts(document.fonts);

      await vi.waitFor(() => {
        expect(
          Number.parseFloat(el.style.getPropertyValue('--_month-control-inline-size'))
        ).to.be.greaterThan(initialWidth);
      });
    } finally {
      resolveFonts(document.fonts);
      fontsReady.restore();
    }
  });

  it('should resize intrinsic month labels when font size changes with an empty font shorthand', async () => {
    el = await fixture(html`
      <sl-select-day
        locale="en-GB"
        .month=${new Date(2026, 8, 1)}
        style="font-family: Georgia, serif; font-size: 20px; font-variant-numeric: proportional-nums"></sl-select-day>
    `);
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_month-control-inline-size')).not.to.equal('')
    );

    await document.fonts.ready;
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);

    const initialWidth = Number.parseFloat(
      el.style.getPropertyValue('--_month-control-inline-size')
    );
    el.style.fontSize = '24px';
    el.month = new Date(2027, 8, 1);
    await el.updateComplete;

    await vi.waitFor(() => {
      const button = el.renderRoot.querySelector('.current-month')!;

      expect(getComputedStyle(button).font).to.equal('');
      expect(
        Number.parseFloat(el.style.getPropertyValue('--_month-control-inline-size'))
      ).to.be.greaterThan(initialWidth);
    });
  });

  it('should show full month names in a mobile date picker in en-GB', async () => {
    // Leave room for the mobile dialog's padding, borders and browser margins.
    const container = await fixture<HTMLDivElement>(html`
      <div style="inline-size: 255px">
        <sl-select-day
          locale="en-GB"
          .month=${new Date(2024, 1, 1)}
          style="font-family: Arial, sans-serif; font-size: 16px"></sl-select-day>
      </div>
    `);
    el = container.querySelector('sl-select-day')!;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2024, month, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const label = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!,
        year = el.renderRoot.querySelector('.current-year')!.getBoundingClientRect(),
        arrows = el.renderRoot.querySelector('.arrows')!.getBoundingClientRect();

      expect(label.scrollWidth).to.be.at.most(label.clientWidth + 1);
      expect(label.getBoundingClientRect().right).to.be.at.most(year.left);
      expect(year.right).to.be.at.most(arrows.left);
      expect(arrows.right).to.be.at.most(container.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should show full month names in a mobile date picker in es', async () => {
    // Leave room for the mobile dialog's padding, borders and browser margins.
    const container = await fixture<HTMLDivElement>(html`
      <div style="inline-size: 255px">
        <sl-select-day
          locale="es"
          .month=${new Date(2024, 1, 1)}
          style="font-family: Arial, sans-serif; font-size: 16px"></sl-select-day>
      </div>
    `);
    el = container.querySelector('sl-select-day')!;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2024, month, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const label = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!,
        year = el.renderRoot.querySelector('.current-year')!.getBoundingClientRect(),
        arrows = el.renderRoot.querySelector('.arrows')!.getBoundingClientRect();

      expect(label.scrollWidth).to.be.at.most(label.clientWidth + 1);
      expect(label.getBoundingClientRect().right).to.be.at.most(year.left);
      expect(year.right).to.be.at.most(arrows.left);
      expect(arrows.right).to.be.at.most(container.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should show full month names in a mobile date picker in nl-NL', async () => {
    // Leave room for the mobile dialog's padding, borders and browser margins.
    const container = await fixture<HTMLDivElement>(html`
      <div style="inline-size: 255px">
        <sl-select-day
          locale="nl-NL"
          .month=${new Date(2024, 1, 1)}
          style="font-family: Arial, sans-serif; font-size: 16px"></sl-select-day>
      </div>
    `);
    el = container.querySelector('sl-select-day')!;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2024, month, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const label = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!,
        year = el.renderRoot.querySelector('.current-year')!.getBoundingClientRect(),
        arrows = el.renderRoot.querySelector('.arrows')!.getBoundingClientRect();

      expect(label.scrollWidth).to.be.at.most(label.clientWidth + 1);
      expect(label.getBoundingClientRect().right).to.be.at.most(year.left);
      expect(year.right).to.be.at.most(arrows.left);
      expect(arrows.right).to.be.at.most(container.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should show full month names in a mobile date picker in pl-PL', async () => {
    // Leave room for the mobile dialog's padding, borders and browser margins.
    const container = await fixture<HTMLDivElement>(html`
      <div style="inline-size: 255px">
        <sl-select-day
          locale="pl-PL"
          .month=${new Date(2024, 1, 1)}
          style="font-family: Arial, sans-serif; font-size: 16px"></sl-select-day>
      </div>
    `);
    el = container.querySelector('sl-select-day')!;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2024, month, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const label = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!,
        year = el.renderRoot.querySelector('.current-year')!.getBoundingClientRect(),
        arrows = el.renderRoot.querySelector('.arrows')!.getBoundingClientRect();

      expect(label.scrollWidth).to.be.at.most(label.clientWidth + 1);
      expect(label.getBoundingClientRect().right).to.be.at.most(year.left);
      expect(year.right).to.be.at.most(arrows.left);
      expect(arrows.right).to.be.at.most(container.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should show full month names in a mobile date picker in de-DE', async () => {
    // Leave room for the mobile dialog's padding, borders and browser margins.
    const container = await fixture<HTMLDivElement>(html`
      <div style="inline-size: 255px">
        <sl-select-day
          locale="de-DE"
          .month=${new Date(2024, 1, 1)}
          style="font-family: Arial, sans-serif; font-size: 16px"></sl-select-day>
      </div>
    `);
    el = container.querySelector('sl-select-day')!;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2024, month, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const label = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!,
        year = el.renderRoot.querySelector('.current-year')!.getBoundingClientRect(),
        arrows = el.renderRoot.querySelector('.arrows')!.getBoundingClientRect();

      expect(label.scrollWidth).to.be.at.most(label.clientWidth + 1);
      expect(label.getBoundingClientRect().right).to.be.at.most(year.left);
      expect(year.right).to.be.at.most(arrows.left);
      expect(arrows.right).to.be.at.most(container.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should show full month names in a mobile date picker in fi-FI', async () => {
    // Leave room for the mobile dialog's padding, borders and browser margins.
    const container = await fixture<HTMLDivElement>(html`
      <div style="inline-size: 255px">
        <sl-select-day
          locale="fi-FI"
          .month=${new Date(2024, 1, 1)}
          style="font-family: Arial, sans-serif; font-size: 16px"></sl-select-day>
      </div>
    `);
    el = container.querySelector('sl-select-day')!;
    await vi.waitFor(() =>
      expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
    );
    const checkMonth = async (month: number): Promise<void> => {
      el.month = new Date(2024, month, 1);
      await el.updateComplete;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const label = el.renderRoot.querySelector<HTMLElement>('.current-month sl-format-date')!,
        year = el.renderRoot.querySelector('.current-year')!.getBoundingClientRect(),
        arrows = el.renderRoot.querySelector('.arrows')!.getBoundingClientRect();

      expect(label.scrollWidth).to.be.at.most(label.clientWidth + 1);
      expect(label.getBoundingClientRect().right).to.be.at.most(year.left);
      expect(year.right).to.be.at.most(arrows.left);
      expect(arrows.right).to.be.at.most(container.getBoundingClientRect().right);
    };
    await checkMonth(0);
    await checkMonth(1);
    await checkMonth(2);
    await checkMonth(3);
    await checkMonth(4);
    await checkMonth(5);
    await checkMonth(6);
    await checkMonth(7);
    await checkMonth(8);
    await checkMonth(9);
    await checkMonth(10);
    await checkMonth(11);
  });

  it('should keep two German months with week numbers at 0.9 CSS zoom', async () => {
    el = await fixture(html`
      <sl-select-day
        locale="de"
        number-of-months="2"
        show-week-numbers
        style="zoom: 0.9"></sl-select-day>
    `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
  });

  it('should keep two German months with week numbers at 1 CSS zoom', async () => {
    el = await fixture(html`
      <sl-select-day
        locale="de"
        number-of-months="2"
        show-week-numbers
        style="zoom: 1"></sl-select-day>
    `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
  });

  it('should keep two German months with week numbers at 1.1 CSS zoom', async () => {
    el = await fixture(html`
      <sl-select-day
        locale="de"
        number-of-months="2"
        show-week-numbers
        style="zoom: 1.1"></sl-select-day>
    `);
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
  });

  it('should keep a 24px gap between both month grids and their weekday headings', async () => {
    el = await fixture(
      html`<sl-select-day number-of-months="2" show-week-numbers></sl-select-day>`
    );
    await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));

    const months = el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])'),
      headings = el.renderRoot.querySelectorAll('.days-of-week');

    expect(getComputedStyle(el.scroller!).columnGap).to.equal('24px');
    expect(
      months[1].getBoundingClientRect().left - months[0].getBoundingClientRect().right
    ).to.be.closeTo(24, 0.5);
    expect(
      headings[1].getBoundingClientRect().left - headings[0].getBoundingClientRect().right
    ).to.be.closeTo(24, 0.5);
  });

  describe('localized layout regressions', () => {
    it('should center dates below weekdays and connect range backgrounds in a widened month without week numbers', async () => {
      el = await fixture(html`
        <sl-select-day
          locale="de"
          .month=${new Date(2026, 2, 1)}
          .range=${[new Date(2026, 2, 2), new Date(2026, 2, 6)]}
          .rangeSelection=${true}
          style="font-family: monospace; font-size: 20px"></sl-select-day>
      `);
      await document.fonts.ready;
      await vi.waitFor(() =>
        expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
      );
      const month = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')!;
      await month.updateComplete;

      await vi.waitFor(() => {
        const headings = el.renderRoot.querySelectorAll('.day-of-week'),
          cells = month.renderRoot.querySelectorAll(
            'tbody tr:first-child td:not([part="week-number"])'
          );

        expect(cells).to.have.lengthOf(7);

        const checkDayAlignment = (index: number, cell: Element): void => {
          const tile = cell.querySelector('button span')!.getBoundingClientRect(),
            heading = headings[index].getBoundingClientRect();

          expect(tile.left + tile.width / 2).to.be.closeTo(heading.left + heading.width / 2, 0.5);
        };
        checkDayAlignment(0, cells[0]);
        checkDayAlignment(1, cells[1]);
        checkDayAlignment(2, cells[2]);
        checkDayAlignment(3, cells[3]);
        checkDayAlignment(4, cells[4]);
        checkDayAlignment(5, cells[5]);
        checkDayAlignment(6, cells[6]);
        const rangeButtons = month.renderRoot.querySelectorAll<HTMLElement>(
          'button[part~="in-range"]'
        );

        expect(rangeButtons.length).to.be.greaterThan(1);

        const first = rangeButtons[0],
          next = rangeButtons[1],
          bridge = getComputedStyle(first, '::before'),
          bridgeEnd =
            first.getBoundingClientRect().left +
            Number.parseFloat(bridge.left) +
            Number.parseFloat(bridge.width);
        const nextBridgeStart =
          next.getBoundingClientRect().left +
          Number.parseFloat(getComputedStyle(next, '::before').left);

        expect(bridgeEnd).to.be.closeTo(nextBridgeStart, 0.5);
      });
    });

    it('should fit a localized header into a narrow container with 1 preferred months without week numbers', async () => {
      const width = 238,
        container = await fixture<HTMLDivElement>(html`
          <div style=${`inline-size: ${width}px`}>
            <sl-select-day
              locale="de"
              number-of-months="1"
              style="font-family: monospace; font-size: 20px"></sl-select-day>
          </div>
        `);
      el = container.querySelector('sl-select-day')!;
      await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
      await vi.waitFor(() => {
        const containerBounds = container.getBoundingClientRect(),
          month = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')!;
        const checkContainerBounds = (element: Element): void => {
          expect(element.getBoundingClientRect().right).to.be.at.most(containerBounds.right + 0.5);
        };
        checkContainerBounds(el.renderRoot.querySelector('header')!);
        checkContainerBounds(el.scroller!);
        checkContainerBounds(el.renderRoot.querySelector('.weekdays')!);
        checkContainerBounds(month);

        expect(
          month.renderRoot.querySelector('table')!.getBoundingClientRect().right
        ).to.be.at.most(containerBounds.right + 0.5);
      });
    });

    it('should fit a localized header into a narrow container with 2 preferred months without week numbers', async () => {
      const width = 238,
        container = await fixture<HTMLDivElement>(html`
          <div style=${`inline-size: ${width}px`}>
            <sl-select-day
              locale="de"
              number-of-months="2"
              style="font-family: monospace; font-size: 20px"></sl-select-day>
          </div>
        `);
      el = container.querySelector('sl-select-day')!;
      await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
      await vi.waitFor(() => {
        const containerBounds = container.getBoundingClientRect(),
          month = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')!;
        const checkContainerBounds = (element: Element): void => {
          expect(element.getBoundingClientRect().right).to.be.at.most(containerBounds.right + 0.5);
        };
        checkContainerBounds(el.renderRoot.querySelector('header')!);
        checkContainerBounds(el.scroller!);
        checkContainerBounds(el.renderRoot.querySelector('.weekdays')!);
        checkContainerBounds(month);

        expect(
          month.renderRoot.querySelector('table')!.getBoundingClientRect().right
        ).to.be.at.most(containerBounds.right + 0.5);
      });
    });

    it('should center dates below weekdays and connect range backgrounds in a widened month with week numbers', async () => {
      el = await fixture(html`
        <sl-select-day
          locale="de"
          show-week-numbers
          .month=${new Date(2026, 2, 1)}
          .range=${[new Date(2026, 2, 2), new Date(2026, 2, 6)]}
          .rangeSelection=${true}
          style="font-family: monospace; font-size: 20px"></sl-select-day>
      `);
      await document.fonts.ready;
      await vi.waitFor(() =>
        expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
      );
      const month = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')!;
      await month.updateComplete;
      await vi.waitFor(() => {
        const headings = el.renderRoot.querySelectorAll('.day-of-week'),
          cells = month.renderRoot.querySelectorAll(
            'tbody tr:first-child td:not([part="week-number"])'
          );

        expect(cells).to.have.lengthOf(7);

        const checkDayAlignment = (index: number, cell: Element): void => {
          const tile = cell.querySelector('button span')!.getBoundingClientRect(),
            heading = headings[index].getBoundingClientRect();

          expect(tile.left + tile.width / 2).to.be.closeTo(heading.left + heading.width / 2, 0.5);
        };
        checkDayAlignment(0, cells[0]);
        checkDayAlignment(1, cells[1]);
        checkDayAlignment(2, cells[2]);
        checkDayAlignment(3, cells[3]);
        checkDayAlignment(4, cells[4]);
        checkDayAlignment(5, cells[5]);
        checkDayAlignment(6, cells[6]);
        {
          const heading = el.renderRoot.querySelector('.week-number')!.getBoundingClientRect(),
            cell = month.renderRoot
              .querySelector('tbody [part="week-number"]')!
              .getBoundingClientRect();

          expect(cell.right).to.be.closeTo(heading.right, 0.5);
        }

        const rangeButtons = month.renderRoot.querySelectorAll<HTMLElement>(
          'button[part~="in-range"]'
        );

        expect(rangeButtons.length).to.be.greaterThan(1);

        const first = rangeButtons[0],
          next = rangeButtons[1],
          bridge = getComputedStyle(first, '::before'),
          bridgeEnd =
            first.getBoundingClientRect().left +
            Number.parseFloat(bridge.left) +
            Number.parseFloat(bridge.width);
        const nextBridgeStart =
          next.getBoundingClientRect().left +
          Number.parseFloat(getComputedStyle(next, '::before').left);

        expect(bridgeEnd).to.be.closeTo(nextBridgeStart, 0.5);
      });
    });

    it('should fit a localized header into a narrow container with 1 preferred months with week numbers', async () => {
      const width = 274,
        container = await fixture<HTMLDivElement>(html`
          <div style=${`inline-size: ${width}px`}>
            <sl-select-day
              locale="de"
              number-of-months="1"
              show-week-numbers
              style="font-family: monospace; font-size: 20px"></sl-select-day>
          </div>
        `);
      el = container.querySelector('sl-select-day')!;
      await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
      await vi.waitFor(() => {
        const containerBounds = container.getBoundingClientRect(),
          month = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')!;
        const checkContainerBounds = (element: Element): void => {
          expect(element.getBoundingClientRect().right).to.be.at.most(containerBounds.right + 0.5);
        };
        checkContainerBounds(el.renderRoot.querySelector('header')!);
        checkContainerBounds(el.scroller!);
        checkContainerBounds(el.renderRoot.querySelector('.weekdays')!);
        checkContainerBounds(month);

        expect(
          month.renderRoot.querySelector('table')!.getBoundingClientRect().right
        ).to.be.at.most(containerBounds.right + 0.5);
      });
    });

    it('should fit a localized header into a narrow container with 2 preferred months with week numbers', async () => {
      const width = 274,
        container = await fixture<HTMLDivElement>(html`
          <div style=${`inline-size: ${width}px`}>
            <sl-select-day
              locale="de"
              number-of-months="2"
              show-week-numbers
              style="font-family: monospace; font-size: 20px"></sl-select-day>
          </div>
        `);
      el = container.querySelector('sl-select-day')!;
      await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
      await vi.waitFor(() => {
        const containerBounds = container.getBoundingClientRect(),
          month = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')!;
        const checkContainerBounds = (element: Element): void => {
          expect(element.getBoundingClientRect().right).to.be.at.most(containerBounds.right + 0.5);
        };
        checkContainerBounds(el.renderRoot.querySelector('header')!);
        checkContainerBounds(el.scroller!);
        checkContainerBounds(el.renderRoot.querySelector('.weekdays')!);
        checkContainerBounds(month);

        expect(
          month.renderRoot.querySelector('table')!.getBoundingClientRect().right
        ).to.be.at.most(containerBounds.right + 0.5);
      });
    });

    it('should truncate a static localized month label without overlapping the year', async () => {
      const container = await fixture<HTMLDivElement>(html`
        <div style="inline-size: 200px">
          <sl-select-day
            locale="de"
            .month=${new Date(2026, 8, 1)}
            .min=${new Date(2026, 8, 1)}
            .max=${new Date(2026, 8, 30)}
            style="font-family: monospace; font-size: 20px"></sl-select-day>
        </div>
      `);
      el = container.querySelector('sl-select-day')!;
      await el.updateComplete;
      await vi.waitFor(() => {
        const month = el.renderRoot.querySelector<HTMLElement>('span.current-month')!,
          label = month.querySelector<HTMLElement>('sl-format-date')!,
          year = el.renderRoot.querySelector('.current-year')!;

        expect(label.scrollWidth).to.be.greaterThan(label.clientWidth);
        expect(label.getBoundingClientRect().right).to.be.at.most(
          year.getBoundingClientRect().left
        );
      });
    });

    it('should stabilize the header even when loading its font fails', async () => {
      const loadFont = vi
        .spyOn(document.fonts, 'load')
        .mockRejectedValue(new Error('Font unavailable'));
      try {
        el = await fixture(html`
          <sl-select-day
            locale="en-GB"
            .month=${new Date(2026, 2, 1)}
            style="font-family: 'Unavailable calendar font', sans-serif"></sl-select-day>
        `);
        await vi.waitFor(() =>
          expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
        );

        expect(loadFont).toHaveBeenCalled();

        const year = el.renderRoot.querySelector('.current-year')!,
          next = el.renderRoot.querySelector('.next-month')!,
          yearLeft = year.getBoundingClientRect().left,
          nextLeft = next.getBoundingClientRect().left;
        el.month = new Date(2026, 8, 1);
        await el.updateComplete;
        await Promise.all(
          Array.from(el.renderRoot.querySelectorAll('sl-format-date')).map(
            label => label.updateComplete
          )
        );

        expect(year.getBoundingClientRect().left).to.be.closeTo(yearLeft, 0.5);
        expect(next.getBoundingClientRect().left).to.equal(nextLeft);
      } finally {
        el?.remove();
        loadFont.mockRestore();
      }
    });

    it('should reserve month width when constraints replace static labels with buttons', async () => {
      el = await fixture(html`
        <sl-select-day
          locale="en-GB"
          .month=${new Date(2026, 2, 1)}
          .min=${new Date(2026, 2, 1)}
          .max=${new Date(2026, 2, 31)}></sl-select-day>
      `);
      await document.fonts.ready;
      await new Promise(requestAnimationFrame);

      expect(el.renderRoot.querySelector('sl-button.current-month')).not.to.exist;
      expect(el.style.getPropertyValue('--_header-inline-size')).to.equal('');

      el.max = undefined;
      await el.updateComplete;
      await vi.waitFor(() =>
        expect(el.style.getPropertyValue('--_header-inline-size')).not.to.equal('')
      );
      const year = el.renderRoot.querySelector('.current-year')!.getBoundingClientRect().left;
      el.month = new Date(2026, 8, 1);
      await el.updateComplete;
      await vi.waitFor(() =>
        expect(
          el.renderRoot.querySelector('.current-year')!.getBoundingClientRect().left
        ).to.be.closeTo(year, 0.5)
      );
    });
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day></sl-select-day>`);
    });

    it('should set displayMonth, nextMonth and previousMonth based on month', () => {
      expect(el.displayMonth).to.equalDate(new Date(2023, 2, 1));
      expect(el.nextMonth).to.equalDate(new Date(2023, 3, 1));
      expect(el.previousMonth).to.equalDate(new Date(2023, 1, 1));
    });

    it('should not be readonly', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.readonly).not.to.be.true;
      expect(monthView?.readonly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector('sl-month-view:not([inert])');

      expect(monthView).to.have.property('readonly', true);
    });

    it('should not have a selected date', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.selected).to.be.undefined;
      expect(monthView?.selected).to.be.undefined;
    });

    it('should show the selected date when set', async () => {
      const selectedDate = new Date(2023, 2, 10);

      el.selected = selectedDate;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(monthView?.selected).to.equalDate(selectedDate);
    });

    it('should not have any disabled dates', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.disabledDates).to.be.undefined;
      expect(monthView?.disabledDates).to.be.undefined;
    });

    it('should show disabled dates when set', async () => {
      const disabledDates = [new Date(2023, 2, 5), new Date(2023, 2, 15), new Date(2023, 2, 25)];

      el.disabledDates = disabledDates;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(monthView?.disabledDates).to.have.lengthOf(3);
      expect(monthView?.disabledDates?.at(0)).to.equalDate(disabledDates[0]);
      expect(monthView?.disabledDates?.at(1)).to.equalDate(disabledDates[1]);
      expect(monthView?.disabledDates?.at(2)).to.equalDate(disabledDates[2]);
    });

    it('should not have any indicator dates', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.indicatorDates).to.be.undefined;
      expect(monthView?.indicatorDates).to.be.undefined;
    });

    it('should show indicator dates when set', async () => {
      const indicatorDates = [
        { date: new Date(2023, 2, 8) },
        { date: new Date(2023, 2, 18) },
        { date: new Date(2023, 2, 28) }
      ];

      el.indicatorDates = indicatorDates;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(monthView?.indicatorDates).to.have.lengthOf(3);
      expect(monthView?.indicatorDates?.at(0)?.date).to.equalDate(indicatorDates[0].date);
      expect(monthView?.indicatorDates?.at(1)?.date).to.equalDate(indicatorDates[1].date);
      expect(monthView?.indicatorDates?.at(2)?.date).to.equalDate(indicatorDates[2].date);
    });

    it('should not show today indicator', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.showToday).not.to.be.true;
      expect(monthView?.showToday).not.to.be.true;
    });

    it('should show today indicator when show-today is set', async () => {
      el.showToday = true;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector('sl-month-view:not([inert])');

      expect(monthView).to.have.property('showToday', true);
    });

    it('should emit an sl-select event when a date is selected', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);
      el.renderRoot
        .querySelector<MonthView>('sl-month-view:not([inert])')
        ?.renderRoot.querySelector<HTMLElement>('button[part="day"]')
        ?.click();
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;
    });

    it('should emit an sl-toggle "month" event when clicking current month button', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', onToggle);
      el.renderRoot.querySelector<HTMLElement>('sl-button.current-month')?.click();
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.have.property('detail', 'month');
    });

    it('should emit an sl-toggle "year" event when clicking current year button', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', onToggle);
      el.renderRoot.querySelector<HTMLElement>('sl-button.current-year')?.click();
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.have.property('detail', 'year');
    });

    describe('days of the week', () => {
      it('should render the days of the week', () => {
        const daysOfWeek = Array.from(
          el.renderRoot.querySelectorAll<HTMLElement>('.days-of-week .day-of-week')
        ).map(day => day.textContent?.trim());

        expect(daysOfWeek).to.deep.equal(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
      });

      it('should have role list with listitems for days of the week', () => {
        const daysOfWeek = el.renderRoot.querySelector<HTMLElement>('.days-of-week'),
          dayElements = Array.from(daysOfWeek?.querySelectorAll<HTMLElement>('.day-of-week') ?? []);

        expect(daysOfWeek).to.have.attribute('role', 'list');
        expect(dayElements.every(d => d.getAttribute('role') === 'listitem')).to.be.true;
      });

      it('should visually hide month headers while keeping them accessible', () => {
        const monthView = el.renderRoot.querySelector<LitElement>('sl-month-view:not([inert])'),
          header = monthView?.renderRoot.querySelector('[part="header"]');

        expect(header).to.exist;
        expect(header).not.to.have.style('display', 'none');
        expect(header).to.have.style('clip-path', 'inset(50%)');
        expect(el.renderRoot.querySelector('.weekdays')).to.have.attribute('aria-hidden', 'true');
      });

      it('should start on Sunday when the first day of the week is 0', async () => {
        el.firstDayOfWeek = 0;
        await el.updateComplete;

        const daysOfWeek = Array.from(
          el.renderRoot.querySelectorAll<HTMLElement>('.days-of-week .day-of-week')
        ).map(day => day.textContent?.trim());

        expect(daysOfWeek).to.deep.equal(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      });
    });

    describe('week numbers', () => {
      it('should not show the week numbers', () => {
        expect(el.showWeekNumbers).not.to.be.true;
      });

      it('should show week number header when show-week-numbers set', async () => {
        el.showWeekNumbers = true;
        await el.updateComplete;

        const weekHeader = el.renderRoot.querySelector('.days-of-week .week-number');

        expect(weekHeader).to.have.trimmed.text('wk.');
      });

      it('should localize the week number header', async () => {
        el.showWeekNumbers = true;
        el.locale = 'fi';
        await el.updateComplete;

        const weekHeader = el.renderRoot.querySelector('.days-of-week .week-number');

        expect(weekHeader).to.have.trimmed.text('vk');
      });

      it('should show week numbers when show-week-numbers set', async () => {
        el.showWeekNumbers = true;
        await el.updateComplete;

        const monthView = el.renderRoot.querySelector('sl-month-view:not([inert])');

        expect(monthView).to.have.property('showWeekNumbers', true);
      });
    });
  });

  describe('min/max', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day></sl-select-day>`);

      // Wait for any initial scrolls to complete
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should disable previous-month button when at min boundary', async () => {
      el.min = new Date(2023, 2, 1);
      await el.updateComplete;

      const prevButton = el.renderRoot.querySelector('sl-button.previous-month');

      expect(prevButton).to.match(':disabled');
    });

    it('should disable next-month button when at max boundary', async () => {
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const nextButton = el.renderRoot.querySelector('sl-button.next-month');

      expect(nextButton).to.match(':disabled');
    });

    it('should allow navigating forward when the current month is before min', async () => {
      el.min = new Date(2023, 5, 1);
      await el.updateComplete;

      const nextButton = el.renderRoot.querySelector('sl-button.next-month');

      expect(nextButton).not.to.match(':disabled');
    });

    it('should render only two month views when at min boundary', async () => {
      el.min = new Date(2023, 2, 1);
      await el.updateComplete;

      const monthViews = el.renderRoot.querySelectorAll('sl-month-view');

      expect(monthViews).to.have.lengthOf(2);
    });

    it('should render only two month views when at max boundary', async () => {
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const monthViews = el.renderRoot.querySelectorAll('sl-month-view');

      expect(monthViews).to.have.lengthOf(2);
    });

    it('should render only one month view when at both boundaries', async () => {
      el.min = new Date(2023, 2, 1);
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const monthViews = el.renderRoot.querySelectorAll('sl-month-view');

      expect(monthViews).to.have.lengthOf(1);
    });

    it('should not change month when at the min boundary and using the keyboard', async () => {
      el.min = new Date(2023, 2, 1);
      await el.updateComplete;

      const originalMonth = el.month;
      el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')?.focus();

      await userEvent.keyboard('{ArrowLeft}');
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.month).to.equalDate(originalMonth);
    });

    it('should not change month when at the max boundary and using the keyboard', async () => {
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const originalMonth = el.month;
      el.renderRoot
        .querySelector<MonthView>('sl-month-view:not([inert])')
        ?.focus(new Date(2023, 2, 31));

      await userEvent.keyboard('{ArrowRight}');
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.month).to.equalDate(originalMonth);
    });
  });

  describe('multiple months', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day number-of-months="2"></sl-select-day>`);
      await new Promise(resolve => setTimeout(resolve, 50));
      await el.updateComplete;
    });

    it('should show two consecutive active month views when enough space is available', () => {
      const monthViews = Array.from(
        el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
      );

      expect(el.numberOfMonths).to.equal(2);
      expect(el.visibleMonthCount).to.equal(2);
      expect(monthViews).to.have.lengthOf(2);
      expect(monthViews[0].month).to.equalDate(new Date(2023, 2, 14));
      expect(monthViews[1].month).to.equalDate(new Date(2023, 3, 1));
      expect(monthViews.every(monthView => monthView.hideDaysOtherMonths)).to.be.true;
    });

    it('should tab into the second month when min leaves no enabled dates in the first', async () => {
      el.max = new Date(2023, 3, 30);
      {
        el.min = new Date(2023, 3, 1);
      }
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      const months = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        after = document.createElement('button');
      after.textContent = 'After calendar';
      el.after(after);
      after.focus();
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');

      expect(months).to.have.lengthOf(2);
      expect(months[1].shadowRoot?.activeElement?.tagName).to.equal('BUTTON');
      expect(months[0].shadowRoot?.activeElement).to.be.null;

      await userEvent.keyboard('{Tab}');

      expect(document.activeElement).to.equal(after);
    });

    it('should tab into the second month when disabled dates leaves no enabled dates in the first', async () => {
      el.max = new Date(2023, 3, 30);
      {
        el.disabledDates = Array.from({ length: 31 }, (_, index) => new Date(2023, 2, index + 1));
      }
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));

      const months = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        after = document.createElement('button');

      after.textContent = 'After calendar';
      el.after(after);
      after.focus();
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');

      expect(months).to.have.lengthOf(2);
      expect(months[1].shadowRoot?.activeElement?.tagName).to.equal('BUTTON');
      expect(months[0].shadowRoot?.activeElement).to.be.null;

      await userEvent.keyboard('{Tab}');

      expect(document.activeElement).to.equal(after);
    });

    it('should return the tab stop to the first month if the last focused month becomes disabled', async () => {
      const months = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        after = document.createElement('button');

      after.textContent = 'After calendar';
      el.after(after);
      months[1].focus(new Date(2023, 3, 15));
      await el.updateComplete;
      after.focus();

      el.disabledDates = Array.from({ length: 30 }, (_, index) => new Date(2023, 3, index + 1));
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');

      expect(months[0].shadowRoot?.activeElement?.tagName).to.equal('BUTTON');
      expect(months[1].shadowRoot?.activeElement).to.be.null;
    });

    it('should discard stale hover when arrow navigation crosses months forwards', async () => {
      el.rangeSelection = true;
      el.rangeStart = new Date(2023, 2, 31);
      await el.updateComplete;

      const months = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        origin = months[0],
        target = months[1],
        endpoint = new Date(2023, 3, 1),
        hoveredDate = new Date(2023, 3, 15),
        hovered = target.renderRoot.querySelector<HTMLButtonElement>(
          `td[data-date="${hoveredDate.toISOString()}"] button`
        )!;

      origin.focus(el.rangeStart);
      await userEvent.hover(hovered);

      expect(el.rangePreview).to.equalDate(hoveredDate);

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;
      await target.updateComplete;

      expect(el.rangePreview).to.equalDate(endpoint);
      expect(target.shadowRoot?.activeElement).to.have.attribute('part').that.contains('range-end');
    });

    it('should discard stale hover when arrow navigation crosses months backwards', async () => {
      el.rangeSelection = true;
      el.rangeStart = new Date(2023, 3, 1);
      await el.updateComplete;
      const months = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        origin = months[1],
        target = months[0],
        endpoint = new Date(2023, 2, 31),
        hoveredDate = new Date(2023, 2, 15),
        hovered = target.renderRoot.querySelector<HTMLButtonElement>(
          `td[data-date="${hoveredDate.toISOString()}"] button`
        )!;
      origin.focus(el.rangeStart);
      await userEvent.hover(hovered);

      expect(el.rangePreview).to.equalDate(hoveredDate);

      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;
      await target.updateComplete;

      expect(el.rangePreview).to.equalDate(endpoint);
      expect(target.shadowRoot?.activeElement)
        .to.have.attribute('part')
        .that.contains('range-start');
    });

    it('should restore a shared preview to the date focused in the other month after unhover', async () => {
      el.rangeSelection = true;
      el.rangeStart = new Date(2023, 2, 26);
      await el.updateComplete;

      const months = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        hovered = months[0].renderRoot.querySelector<HTMLButtonElement>(
          `td[data-date="${new Date(2023, 2, 30).toISOString()}"] button`
        )!,
        marchEnd = months[0].renderRoot.querySelector<HTMLButtonElement>(
          `td[data-date="${new Date(2023, 2, 31).toISOString()}"] button`
        )!;

      months[1].focus(new Date(2023, 3, 5));
      await userEvent.hover(hovered);

      expect(el.rangePreview).to.equalDate(new Date(2023, 2, 30));

      await userEvent.unhover(hovered);
      await el.updateComplete;
      await Promise.all(months.map(month => month.updateComplete));

      expect(el.rangePreview).to.equalDate(new Date(2023, 3, 5));
      expect(marchEnd).to.have.attribute('part').that.contains('in-range');
      expect(months[1].shadowRoot?.activeElement)
        .to.have.attribute('part')
        .that.contains('range-end');
    });

    it('should forward range CSS parts from the month views', () => {
      const monthViews = Array.from(el.renderRoot.querySelectorAll('sl-month-view'));

      expect(monthViews).not.to.be.empty;
      expect(
        monthViews.every(monthView => {
          const parts = monthView.getAttribute('exportparts') ?? '';

          return (
            parts.includes('range-start') &&
            parts.includes('range-end') &&
            parts.includes('in-range') &&
            parts.includes('range-preview')
          );
        })
      ).to.be.true;
    });

    it('should disable next when the final month is already visible', async () => {
      el.max = new Date(2023, 3, 30);
      await el.updateComplete;

      const monthViews = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        nextButton = el.renderRoot.querySelector('sl-button.next-month');

      expect(monthViews).to.have.lengthOf(2);
      expect(monthViews[1].month).to.equalDate(new Date(2023, 3, 1));
      expect(nextButton).to.match(':disabled');
    });

    it('should count only months that can be rendered before max', async () => {
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      expect(el.visibleMonthCount).to.equal(1);
      expect(el.renderRoot.querySelectorAll('sl-month-view:not([inert])')).to.have.lengthOf(1);
    });

    it('should render weekday headings for both visible months', () => {
      expect(el.renderRoot.querySelectorAll('.days-of-week')).to.have.lengthOf(2);
      expect(el.renderRoot.querySelectorAll('.day-of-week')).to.have.lengthOf(14);
    });

    it('should hide the second month label from screen readers', () => {
      expect(el.renderRoot.querySelector('.following-month-label')).to.have.attribute(
        'aria-hidden',
        'true'
      );
    });

    it('should expose weekday headers before the dates in each visible month', () => {
      const months = Array.from(
        el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
      );

      expect(months).to.have.lengthOf(2);
      expect(el.renderRoot.querySelector('.weekdays')).to.have.attribute('aria-hidden', 'true');

      const checkMonthHeaders = (month: MonthView): void => {
        const header = month.renderRoot.querySelector('thead')!,
          dates = month.renderRoot.querySelector('tbody')!;

        expect(header.querySelectorAll('th[part="week-day"]')).to.have.lengthOf(7);
        expect(header).not.to.have.style('display', 'none');
        expect(header.closest('[aria-hidden="true"]')).to.be.null;
        expect(
          header.compareDocumentPosition(dates) & Node.DOCUMENT_POSITION_FOLLOWING
        ).not.to.equal(0);
      };
      checkMonthHeaders(months[0]);
      checkMonthHeaders(months[1]);
    });

    it('should keep navigation aligned with the visible month when resized just below the two-month threshold without week numbers', async () => {
      el.showWeekNumbers = false;
      el.month = new Date(2023, 8, 15);
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));

      const header = el.renderRoot.querySelector<HTMLElement>('header')!,
        fullWidth = el.getBoundingClientRect().width;

      expect(el.visibleMonthCount).to.equal(2);
      expect(header.getBoundingClientRect().width).to.equal(fullWidth);

      const checkReducedWidth = async (reduction: number): Promise<void> => {
        el.style.maxInlineSize = `${fullWidth - reduction}px`;
        await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
        await el.updateComplete;

        const bounds = header.getBoundingClientRect(),
          monthBounds = el.scroller!.getBoundingClientRect(),
          nextBounds = el.renderRoot.querySelector('.next-month')!.getBoundingClientRect();

        expect(bounds.left).to.equal(monthBounds.left);
        expect(bounds.right).to.equal(monthBounds.right);
        expect(nextBounds.right).to.be.at.most(monthBounds.right);
        expect(monthBounds.right - nextBounds.right).to.be.at.most(8);
      };
      await checkReducedWidth(1);
      await checkReducedWidth(10);
      await checkReducedWidth(50);
      el.style.removeProperty('max-inline-size');
      await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
      await el.updateComplete;

      expect(header.getBoundingClientRect().width).to.equal(fullWidth);
    });

    it('should keep navigation aligned with the visible month when resized just below the two-month threshold with week numbers', async () => {
      el.showWeekNumbers = true;
      el.month = new Date(2023, 8, 15);
      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      const header = el.renderRoot.querySelector<HTMLElement>('header')!,
        fullWidth = el.getBoundingClientRect().width;

      expect(el.visibleMonthCount).to.equal(2);
      expect(header.getBoundingClientRect().width).to.equal(fullWidth);

      const checkReducedWidth = async (reduction: number): Promise<void> => {
        el.style.maxInlineSize = `${fullWidth - reduction}px`;
        await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
        await el.updateComplete;
        const bounds = header.getBoundingClientRect(),
          monthBounds = el.scroller!.getBoundingClientRect(),
          nextBounds = el.renderRoot.querySelector('.next-month')!.getBoundingClientRect();

        expect(bounds.left).to.equal(monthBounds.left);
        expect(bounds.right).to.equal(monthBounds.right);
        expect(nextBounds.right).to.be.at.most(monthBounds.right);
        expect(monthBounds.right - nextBounds.right).to.be.at.most(8);
      };
      await checkReducedWidth(1);
      await checkReducedWidth(10);
      await checkReducedWidth(50);
      el.style.removeProperty('max-inline-size');
      await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
      await el.updateComplete;

      expect(header.getBoundingClientRect().width).to.equal(fullWidth);
    });

    it('should collapse to one active month when the available width is too small', async () => {
      el.style.maxInlineSize = '238px';
      await new Promise(resolve => setTimeout(resolve, 50));
      await el.updateComplete;

      expect(el.visibleMonthCount).to.equal(1);
      expect(el.renderRoot.querySelectorAll('sl-month-view:not([inert])')).to.have.lengthOf(1);
      expect(el.renderRoot.querySelectorAll('.days-of-week')).to.have.lengthOf(1);
    });

    it('should move keyboard focus to the already visible next month without paging', async () => {
      const monthViews = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        originalMonth = el.month;

      monthViews[0].focus(new Date(2023, 2, 31));
      await userEvent.keyboard('{ArrowRight}');
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.month).to.equalDate(originalMonth);
      expect(monthViews[1].shadowRoot?.activeElement).to.have.trimmed.text('1');
    });

    it('should leave both calendars with Tab from month 1 and re-enter with Shift+Tab', async () => {
      const monthViews = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        after = document.createElement('button');

      after.textContent = 'After calendar';
      el.after(after);
      monthViews[0].focus(new Date(2023, 2, 15));
      await el.updateComplete;

      await userEvent.keyboard('{Tab}');

      expect(document.activeElement).to.equal(after);

      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');

      expect(monthViews[0].shadowRoot?.activeElement?.tagName).to.equal('BUTTON');
      expect(monthViews[1].shadowRoot?.activeElement).to.be.null;
    });

    it('should leave both calendars with Tab from month 2 and re-enter with Shift+Tab', async () => {
      const monthViews = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        after = document.createElement('button');
      after.textContent = 'After calendar';
      el.after(after);
      monthViews[1].focus(new Date(2023, 3, 15));
      await el.updateComplete;
      await userEvent.keyboard('{Tab}');

      expect(document.activeElement).to.equal(after);

      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');

      expect(monthViews[1].shadowRoot?.activeElement?.tagName).to.equal('BUTTON');
      expect(monthViews[0].shadowRoot?.activeElement).to.be.null;
    });

    it('should leave the dates with Tab after navigating into the second month with arrows', async () => {
      const monthViews = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        after = document.createElement('button');

      after.textContent = 'After calendar';
      el.after(after);
      monthViews[0].focus(new Date(2023, 2, 31));
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      expect(monthViews[1].shadowRoot?.activeElement).to.have.trimmed.text('1');

      await userEvent.keyboard('{Tab}');

      expect(document.activeElement).to.equal(after);
    });

    it('should tab into only the first month from the calendar controls', async () => {
      const monthViews = Array.from(
        el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
      );

      el.renderRoot.querySelector<HTMLElement>('.next-month')!.focus();
      await userEvent.keyboard('{Tab}');

      expect(monthViews[0].shadowRoot?.activeElement?.tagName).to.equal('BUTTON');
      expect(monthViews[1].shadowRoot?.activeElement).to.be.null;
    });

    it('should share a pointer range preview between both visible months', async () => {
      el.rangeSelection = true;
      el.rangeStart = new Date(2023, 2, 26);
      await el.updateComplete;

      const monthViews = Array.from(
          el.renderRoot.querySelectorAll<MonthView>('sl-month-view:not([inert])')
        ),
        previewDate = new Date(2023, 3, 5),
        previewButton = monthViews[1].renderRoot.querySelector<HTMLButtonElement>(
          `td[data-date="${previewDate.toISOString()}"] button`
        );

      previewButton?.dispatchEvent(new PointerEvent('pointerenter'));
      await el.updateComplete;
      await Promise.all(monthViews.map(monthView => monthView.updateComplete));

      const marchEnd = monthViews[0].renderRoot.querySelector<HTMLButtonElement>(
          `td[data-date="${new Date(2023, 2, 31).toISOString()}"] button`
        ),
        aprilStart = monthViews[1].renderRoot.querySelector<HTMLButtonElement>(
          `td[data-date="${new Date(2023, 3, 1).toISOString()}"] button`
        );

      expect(el.rangePreview).to.equalDate(previewDate);
      expect(marchEnd).to.have.attribute('part').that.contains('range-month-end');
      expect(aprilStart).to.have.attribute('part').that.contains('range-month-start');
      expect(previewButton).to.have.attribute('part').that.contains('range-end');
    });

    it('should remove month fades when resizing to one month and restore them for two months', async () => {
      el.rangeSelection = true;
      el.range = [new Date(2023, 2, 29), new Date(2023, 3, 5)];
      await el.updateComplete;

      const firstMonth = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')!,
        lastDay = (): HTMLButtonElement =>
          firstMonth.renderRoot.querySelector<HTMLButtonElement>(
            `td[data-date="${new Date(2023, 2, 31).toISOString()}"] button`
          )!;

      await firstMonth.updateComplete;

      expect(lastDay()).to.have.attribute('part').that.contains('range-month-end');

      el.style.maxInlineSize = '300px';
      await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(1));
      await firstMonth.updateComplete;

      expect(lastDay()).to.have.attribute('part').that.contains('in-range');
      expect(lastDay()).to.have.attribute('part').that.does.not.contain('range-month-end');
      expect(getComputedStyle(lastDay(), '::before').backgroundImage).to.equal('none');

      el.style.removeProperty('max-inline-size');
      await vi.waitFor(() => expect(el.visibleMonthCount).to.equal(2));
      await firstMonth.updateComplete;

      expect(lastDay()).to.have.attribute('part').that.contains('range-month-end');
      expect(getComputedStyle(lastDay(), '::before').backgroundImage).to.contain('linear-gradient');
    });

    it('should use the same date layout in the offscreen months while paging', () => {
      const months = Array.from(el.renderRoot.querySelectorAll<MonthView>('sl-month-view'));

      expect(months).to.have.lengthOf(4);
      expect(months.every(month => month.hideDaysOtherMonths)).to.be.true;
    });

    it('should keep month labels consecutive throughout animated paging', async () => {
      const labels: Array<{
        first: number;
        second: number;
      }> = [];
      let sampling = true;
      const sample = (): void => {
        labels.push({ first: el.displayMonth!.getMonth(), second: el.nextMonth!.getMonth() });
        if (sampling) {
          requestAnimationFrame(sample);
        }
      };

      requestAnimationFrame(sample);
      try {
        el.renderRoot.querySelector<HTMLElement>('.next-month')!.click();
        await vi.waitFor(() => expect(el.month).to.equalDate(new Date(2023, 3, 1)));
        await new Promise(resolve => requestAnimationFrame(resolve));

        expect(labels.length).to.be.greaterThan(0);
        expect(labels.every(({ first, second }) => second === (first + 1) % 12)).to.be.true;
      } finally {
        sampling = false;
      }
    });

    it('should recenter the rendered months before painting when scrollend is polyfilled', async () => {
      const findScrollEndPrototype = (prototype: object): object =>
        Object.hasOwn(prototype, 'onscrollend')
          ? prototype
          : findScrollEndPrototype(Object.getPrototypeOf(prototype) as object);
      const prototype = findScrollEndPrototype(Object.getPrototypeOf(el.scroller!) as object);
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'onscrollend')!,
        positions: number[] = [];
      let sampling = true;
      const sample = (): void => {
        if (!sampling) {
          return;
        }
        if (el.month.getMonth() === 3) {
          const activeMonth = el.renderRoot.querySelector('sl-month-view:not([inert])')!;
          positions.push(
            activeMonth.getBoundingClientRect().left - el.scroller!.getBoundingClientRect().left
          );
        }
        requestAnimationFrame(sample);
      };

      Reflect.deleteProperty(prototype, 'onscrollend');
      requestAnimationFrame(sample);
      try {
        el.renderRoot.querySelector<HTMLElement>('.next-month')!.click();
        await vi.waitFor(() => expect(el.month).to.equalDate(new Date(2023, 3, 1)));
        await new Promise(resolve => requestAnimationFrame(resolve));

        expect(positions.length).to.be.greaterThan(0);
        expect(positions.every(position => Math.abs(position) <= 1)).to.be.true;
      } finally {
        sampling = false;
        Object.defineProperty(prototype, 'onscrollend', descriptor);
      }
    });

    it('should advance the two-month window by one month', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();

      await vi.waitFor(() => expect(el.month).to.equalDate(new Date(2023, 3, 1)), {
        timeout: 2000
      });

      expect(el.nextMonth).to.equalDate(new Date(2023, 4, 1));
    });
  });

  describe('navigation', () => {
    let announce: SinonSpy;

    beforeEach(async () => {
      announce = spy();
      document.body.addEventListener('sl-announce', announce);

      el = await fixture(html`<sl-select-day></sl-select-day>`);

      // Wait for any initial scrolls to complete
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    afterEach(() => document.body.removeEventListener('sl-announce', announce));

    describe('back', () => {
      it('should show the previous month when using the keyboard', async () => {
        el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')?.focus();

        await userEvent.keyboard('{ArrowLeft}');
        await new Promise(resolve => requestAnimationFrame(resolve));

        expect(el.month).to.equalDate(new Date(2023, 1, 1));
      });

      it('should scroll to the previous month when using the mouse', async () => {
        const scrollendPromise = new Promise<void>(resolve => {
          el.renderRoot
            .querySelector<HTMLElement>('.scroller')
            ?.addEventListener('scrollend', () => resolve(), { once: true });
        });

        el.renderRoot.querySelector<HTMLElement>('sl-button.previous-month')?.click();
        await el.updateComplete;
        await scrollendPromise;

        expect(el.month).to.equalDate(new Date(2023, 1, 1));
      });

      it('should focus the last day of the previous month when using the keyboard', async () => {
        el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')?.focus();

        await userEvent.keyboard('{ArrowLeft}');
        await new Promise(resolve => requestAnimationFrame(resolve));

        const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

        expect(monthView?.shadowRoot?.activeElement).to.exist;
        expect(monthView?.shadowRoot?.activeElement?.tagName).to.equal('BUTTON');
        expect(monthView?.shadowRoot?.activeElement).to.have.trimmed.text('28');
      });

      it('should announce the previous month when using the mouse', async () => {
        el.renderRoot.querySelector<HTMLElement>('sl-button.previous-month')?.click();

        // Wait for the announcement to be made from a setTimeout
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(announce).to.have.been.calledOnce;

        const announcement = announce.lastCall.firstArg as SlAnnounceEvent;

        expect(announcement.detail).to.deep.equal({
          message: 'February 2023',
          urgency: 'polite'
        });
      });
    });

    describe('forward', () => {
      it('should show the next month when using the keyboard', async () => {
        el.renderRoot
          .querySelector<MonthView>('sl-month-view:not([inert])')
          ?.focus(new Date(2023, 2, 31));

        await userEvent.keyboard('{ArrowRight}');
        await new Promise(resolve => requestAnimationFrame(resolve));

        expect(el.month).to.equalDate(new Date(2023, 3, 1));
      });

      it('should scroll to the next month when using the mouse', async () => {
        const scrollendPromise = new Promise<void>(resolve => {
          el.renderRoot
            .querySelector<HTMLElement>('.scroller')
            ?.addEventListener('scrollend', () => resolve(), { once: true });
        });

        el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();
        await scrollendPromise;

        expect(el.month).to.equalDate(new Date(2023, 3, 1));
      });

      it('should focus the first day of the next month when using the keyboard', async () => {
        el.renderRoot
          .querySelector<MonthView>('sl-month-view:not([inert])')
          ?.focus(new Date(2023, 2, 31));

        await userEvent.keyboard('{ArrowRight}');
        await new Promise(resolve => requestAnimationFrame(resolve));

        const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

        expect(monthView?.shadowRoot?.activeElement).to.exist;
        expect(monthView?.shadowRoot?.activeElement?.tagName).to.equal('BUTTON');
        expect(monthView?.shadowRoot?.activeElement).to.have.trimmed.text('1');
      });

      it('should announce the next month when using the mouse', async () => {
        el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();

        // Wait for the announcement to be made from a setTimeout
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(announce).to.have.been.calledOnce;

        const announcement = announce.lastCall.firstArg as SlAnnounceEvent;

        expect(announcement.detail).to.deep.equal({
          message: 'April 2023',
          urgency: 'polite'
        });
      });
    });
  });

  describe('scrolling', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day></sl-select-day>`);

      // Wait for any initial scrolls to complete
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should render three month views (previous, current, next) by default', () => {
      const monthViews = el.renderRoot.querySelectorAll('sl-month-view');

      expect(monthViews).to.have.lengthOf(3);
    });

    it('should set previous and next month views as inert', () => {
      const monthViews = Array.from(el.renderRoot.querySelectorAll('sl-month-view'));

      expect(monthViews[0]).to.have.attribute('inert');
      expect(monthViews[1]).not.to.have.attribute('inert');
      expect(monthViews[2]).to.have.attribute('inert');
    });

    it('should set previous and next month views as aria-hidden', () => {
      const monthViews = Array.from(el.renderRoot.querySelectorAll('sl-month-view'));

      expect(monthViews[0]).to.have.attribute('aria-hidden', 'true');
      expect(monthViews[1]).not.to.have.attribute('aria-hidden');
      expect(monthViews[2]).to.have.attribute('aria-hidden', 'true');
    });

    it('should scroll to center month on initialization', async () => {
      const scroller = el.renderRoot.querySelector<HTMLElement>('.scroller');

      // Wait for resize observer to trigger
      await new Promise(resolve => setTimeout(resolve, 50));

      // The scroll position should be at the center (width * 1)

      expect(scroller?.scrollLeft).to.be.greaterThan(0);
    });

    it('should update displayMonth when scrolling to >= 50% visibility', async () => {
      const initialDisplayMonth = el.displayMonth;

      const scrollendPromise = new Promise<void>(resolve => {
        el.renderRoot
          .querySelector<HTMLElement>('.scroller')
          ?.addEventListener('scrollend', () => resolve(), { once: true });
      });

      el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();
      await scrollendPromise;

      expect(el.displayMonth).not.to.equalDate(initialDisplayMonth!);
    });

    it('should use smooth scrolling when clicking navigation buttons', async () => {
      const scrollToSpy = spy(el.scroller!, 'scrollTo');

      el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();
      await el.updateComplete;

      expect(scrollToSpy).to.have.been.calledWith(
        sinon.match({
          behavior: 'smooth'
        })
      );
    });

    it('should update month views when month changes', async () => {
      el.month = new Date(2023, 5, 15); // June 2023;
      await el.updateComplete;

      const monthViews = Array.from(el.renderRoot.querySelectorAll('sl-month-view'));

      // Check that the internal state is correct

      expect(el.displayMonth).to.equalDate(new Date(2023, 5, 1)); // June
      expect(el.previousMonth).to.equalDate(new Date(2023, 4, 1)); // May
      expect(el.nextMonth).to.equalDate(new Date(2023, 6, 1)); // July

      // Verify month views have correct months (they receive the actual date, not normalized to day 1)
      expect(monthViews[0].month).to.equalDate(new Date(2023, 4, 1));
      expect(monthViews[1].month).to.equalDate(new Date(2023, 5, 15));
      expect(monthViews[2].month).to.equalDate(new Date(2023, 6, 1));
    });

    it('should scroll to position 0 when at min boundary', async () => {
      el.min = new Date(2023, 2, 1);
      await el.updateComplete;

      const scroller = el.renderRoot.querySelector<HTMLElement>('.scroller');

      // Wait for resize observer to trigger scroll
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Current month should be at position 0 (no previous month rendered)

      expect(scroller?.scrollLeft).to.equal(0);
    });

    it('should scroll to position 1 width when at max boundary', async () => {
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const scroller = el.renderRoot.querySelector<HTMLElement>('.scroller'),
        { width } = scroller!.getBoundingClientRect();

      // Wait for resize observer to trigger scroll
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(scroller?.scrollLeft).to.equal(width);
    });

    it('should keep current month view active (not inert) when only one view', async () => {
      el.min = new Date(2023, 2, 1);
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector('sl-month-view');

      expect(monthView).not.to.have.attribute('inert');
      expect(monthView).not.to.have.attribute('aria-hidden');
    });
  });
});
