import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './register.js';
import { type RelativeTime } from './relative-time.js';

describe('sl-relative-time', () => {
  const render = async (
    date: Date | string | number | undefined,
    options: Partial<Pick<RelativeTime, 'format' | 'locale' | 'numeric' | 'sync'>> = {}
  ): Promise<RelativeTime> =>
    await fixture(html`
      <sl-relative-time
        .date=${date}
        ?sync=${options.sync}
        format=${ifDefined(options.format)}
        locale=${ifDefined(options.locale)}
        numeric=${ifDefined(options.numeric)}></sl-relative-time>
    `);

  const text = async (...args: Parameters<typeof render>): Promise<string> =>
    (await render(...args)).renderRoot.textContent?.trim() ?? '';

  beforeEach(() => {
    vi.useFakeTimers({ now: new Date(2022, 0, 15), toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render "this minute" for now', async () => {
    expect(await text(new Date())).to.equal('this minute');
  });

  it('should render "1 minuut geleden" in Dutch', async () => {
    expect(await text(new Date(2022, 0, 14, 23, 59), { locale: 'nl' })).to.equal(
      '1 minuut geleden'
    );
  });

  it('should render "tomorrow"', async () => {
    expect(await text(new Date(2022, 0, 16))).to.equal('tomorrow');
  });

  it('should add the time to "tomorrow" when it is not midnight', async () => {
    expect(await text(new Date(2022, 0, 16, 10, 0), { locale: 'nl' })).to.equal('morgen om 10:00');
  });

  it('should render "yesterday"', async () => {
    expect(await text(new Date(2022, 0, 14))).to.equal('yesterday');
  });

  it('should render "eergisteren" in Dutch', async () => {
    expect(await text(new Date(2022, 0, 13), { locale: 'nl' })).to.equal('eergisteren');
  });

  it('should render "last week"', async () => {
    expect(await text(new Date(2022, 0, 8))).to.equal('last week');
  });

  it('should render "last month"', async () => {
    expect(await text(new Date(2021, 11, 15))).to.equal('last month');
  });

  it('should render "last year"', async () => {
    expect(await text(new Date(2021, 0, 15))).to.equal('last year');
  });

  it('should render "1 day ago" with numeric always', async () => {
    expect(await text(new Date(2022, 0, 14), { numeric: 'always' })).to.equal('1 day ago');
  });

  it('should render a short format', async () => {
    expect(await text(new Date(2021, 9, 15), { format: 'short' })).to.equal('3 mo. ago');
  });

  it('should parse an ISO string', async () => {
    expect(await text(new Date(2022, 0, 14, 12).toISOString())).to.equal('12 hours ago');
  });

  it('should parse a timestamp', async () => {
    expect(await text(new Date(2022, 0, 14, 12).getTime())).to.equal('12 hours ago');
  });

  it('should render nothing for an invalid date', async () => {
    expect(await text('foo')).to.equal('');
  });

  it('should render nothing without a date', async () => {
    expect(await text(undefined)).to.equal('');
  });

  it('should render the date in a time element', async () => {
    const date = new Date(2022, 0, 14),
      el = await render(date);

    expect(el.renderRoot.querySelector('time')).to.have.attribute('datetime', date.toISOString());
  });

  it('should read the date from the attribute', async () => {
    const el = await fixture<RelativeTime>(
      html`<sl-relative-time date="2022-01-14T00:00:00"></sl-relative-time>`
    );

    expect(el.renderRoot.textContent?.trim()).to.equal('yesterday');
  });

  describe('sync', () => {
    beforeEach(() => {
      vi.useRealTimers();
      vi.useFakeTimers({ now: new Date(2022, 0, 15, 12, 0, 0) });
    });

    it('should update as time passes', async () => {
      const el = await render(new Date(2022, 0, 15, 11, 58, 0), { sync: true });

      expect(el.renderRoot.textContent?.trim()).to.equal('2 minutes ago');

      vi.advanceTimersByTime(60_000);
      await el.updateComplete;

      expect(el.renderRoot.textContent?.trim()).to.equal('3 minutes ago');
    });

    it('should not update without sync', async () => {
      const el = await render(new Date(2022, 0, 15, 11, 58, 0));

      vi.advanceTimersByTime(60_000);
      await el.updateComplete;

      expect(el.renderRoot.textContent?.trim()).to.equal('2 minutes ago');
    });
  });
});
