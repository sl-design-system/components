import { LocaleMixin } from '@sl-design-system/shared/mixins/locale.js';
import { LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-relative-time': RelativeTime;
  }
}

export type RelativeTimeFormat = Intl.RelativeTimeFormatStyle;

export type RelativeTimeNumeric = Intl.RelativeTimeFormatNumeric;

interface UnitConfig {
  /** Below this difference (in ms), this unit is used. */
  max: number;

  /** The length of one unit in ms. */
  value: number;

  unit: Intl.RelativeTimeFormatUnit;
}

const MINUTE = 60_000,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR;

/** The units to express a time difference in, from small to large. */
const UNITS: UnitConfig[] = [
  { max: 46 * MINUTE, value: MINUTE, unit: 'minute' },
  { max: 20 * HOUR, value: HOUR, unit: 'hour' },
  { max: 6 * DAY, value: DAY, unit: 'day' },
  { max: 28 * DAY, value: 7 * DAY, unit: 'week' },
  { max: 330 * DAY, value: 30 * DAY, unit: 'month' },
  { max: Infinity, value: 365 * DAY, unit: 'year' }
];

/** How often to update while syncing, depending on the unit that is shown. */
const SYNC_INTERVALS: Partial<Record<Intl.RelativeTimeFormatUnit, number>> = {
  minute: 1000,
  hour: MINUTE,
  day: HOUR
};

/**
 * Returns the "glue" between a date and a time, for example " at " in English ("tomorrow at
 * 10:00").
 */
export const getDateTimeSeparator = (locale?: string): string => {
  const parts = new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeStyle: 'short'
    }).formatToParts(new Date()),
    hourIndex = parts.findIndex(({ type }) => type === 'hour');

  return hourIndex > 0 && parts[hourIndex - 1].type === 'literal' ? parts[hourIndex - 1].value : '';
};

/**
 * Shows how long ago, or how far in the future, a date is: "3 minutes ago", "yesterday at 10:00",
 * "in 2 weeks". It uses `Intl.RelativeTimeFormat`, so the text follows the locale of the document
 * (or the `locale` property).
 *
 * ```html
 * <sl-relative-time date="2026-11-25T10:00:00" sync></sl-relative-time>
 * ```
 *
 * The text is rendered in a `<time>` element with the date as its `datetime` attribute.
 */
export class RelativeTime extends LocaleMixin(LitElement) {
  /** The date to show the relative time of. */
  #date?: Date = new Date();

  /** The formatter, recreated when the locale or options change. */
  #formatter?: Intl.RelativeTimeFormat;

  /** Timer for the next update, when syncing. */
  #syncTimeout?: ReturnType<typeof setTimeout>;

  /**
   * The date to show the relative time of: a `Date`, a timestamp or an ISO string.
   *
   * @default now
   */
  @property()
  set date(value: number | string | Date | undefined | null) {
    const oldValue = this.#date;

    if (value instanceof Date) {
      this.#date = value;
    } else if (typeof value === 'number' || typeof value === 'string') {
      const date = new Date(value);

      this.#date = isNaN(date.getTime()) ? undefined : date;
    } else {
      this.#date = undefined;
    }

    this.requestUpdate('date', oldValue);
  }

  get date(): Date | undefined {
    return this.#date;
  }

  /**
   * The length of the text: `long` ("in 3 months"), `short` ("in 3 mo.") or `narrow` ("in 3mo").
   *
   * @default 'long'
   */
  @property() format?: RelativeTimeFormat;

  /**
   * With `auto`, words like "yesterday" and "tomorrow" are used when possible; with `always` it is
   * "1 day ago" and "in 1 day".
   *
   * @default 'auto'
   */
  @property() numeric?: RelativeTimeNumeric;

  /** Keeps the text up to date as time passes. */
  @property({ type: Boolean }) sync?: boolean;

  override disconnectedCallback(): void {
    clearTimeout(this.#syncTimeout);

    super.disconnectedCallback();
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Pick up where we left off, when moved around in the DOM
    if (this.hasUpdated && this.sync) {
      this.requestUpdate();
    }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (
      !this.#formatter ||
      changes.has('locale') ||
      changes.has('format') ||
      changes.has('numeric')
    ) {
      this.#formatter = new Intl.RelativeTimeFormat(this.locale, {
        numeric: this.numeric ?? 'auto',
        style: this.format ?? 'long'
      });
    }
  }

  override render(): TemplateResult | typeof nothing {
    clearTimeout(this.#syncTimeout);

    const date = this.date;
    if (!date || !this.#formatter) {
      return nothing;
    }

    const diff = date.getTime() - Date.now(),
      { unit, value } = UNITS.find(u => Math.abs(diff) < u.max)!;

    if (this.sync) {
      this.#scheduleSync(SYNC_INTERVALS[unit] ?? DAY);
    }

    return html`
      <time datetime=${date.toISOString()}
        >${this.#format(Math.round(diff / value), unit, date)}</time
      >
    `;
  }

  #format(value: number, unit: Intl.RelativeTimeFormatUnit, date: Date): string {
    const text = this.#formatter!.format(value, unit);

    // For "yesterday" and "tomorrow", add the time, unless it is midnight
    if (Math.abs(value) === 1 && unit === 'day' && (date.getHours() || date.getMinutes())) {
      const time = new Intl.DateTimeFormat(this.locale, { timeStyle: 'short' }).format(date);

      return `${text}${getDateTimeSeparator(this.locale)}${time}`;
    }

    return text;
  }

  /**
   * Updates again when the next unit (second, minute, hour or day) starts. Aligning to the clock
   * makes all synced elements on the page change at the same time, which is less distracting.
   */
  #scheduleSync(interval: number): void {
    this.#syncTimeout = setTimeout(() => this.requestUpdate(), interval - (Date.now() % interval));
  }
}
