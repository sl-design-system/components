import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type Calendar, type Day, Indicator } from './utils.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-month-view': MonthView;
  }
}
export type MonthViewRenderer = (day: Day, monthView: MonthView) => TemplateResult | undefined;
declare const MonthView_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared').Locale>;
/**
 * Component that renders a single month of a calendar.
 *
 * @csspart day - The day button.
 * @csspart disabled - The day button when shown as disabled.
 * @csspart header - The thead element with weekday names.
 * @csspart indicator - The day button for a date with an indicator.
 * @csspart indicator-blue - The day button for a date with a blue indicator.
 * @csspart indicator-red - The day button for a date with a red indicator.
 * @csspart indicator-yellow - The day button for a date with a yellow indicator.
 * @csspart indicator-green - The day button for a date with a green indicator.
 * @csspart indicator-grey - The day button for a date with a grey indicator.
 * @csspart next-month - The day button for a day in the next month.
 * @csspart out-of-range - The day button for a date outside the min/max range.
 * @csspart previous-month - The day button for a day in the previous month.
 * @csspart selected - The day button for the selected date.
 * @csspart today - The day button for today's date.
 * @csspart week-day - The week day header cell.
 * @csspart week-number - The week number cell.
 */
export declare class MonthView extends MonthView_base {
  #private;
  /** @internal */
  static get observedAttributes(): string[];
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The calendar object. */
  calendar?: Calendar;
  /** @internal Emits when the user uses the keyboard to navigate to the next/previous month. */
  changeEvent: EventEmitter<SlChangeEvent<Date>>;
  /** @internal Days element. */
  days?: HTMLElement;
  /** The list of dates that should be disabled. */
  disabledDates?: Date[];
  /**
   * The first day of the week; 0 for Sunday, 1 for Monday.
   *
   * NOTE: Remove this property once `Intl.Locale.prototype.getWeekInfo` is widely available. See
   * https://caniuse.com/mdn-javascript_builtins_intl_locale_getweekinfo
   *
   * @default 1
   */
  firstDayOfWeek: number;
  /**
   * Will only show the days of the current month, not the next or previous, when true.
   *
   * @default false
   */
  hideDaysOtherMonths?: boolean;
  /**
   * The list of dates that should display an indicator. Each item is an Indicator with a `date`, an
   * optional `color` and `label` that is used to improve accessibility (added as a tooltip). Use
   * `indicator-dates` to highlight specific dates with a visual indicator (for example, exam dates
   * or assignment deadlines) without disabling them.
   */
  indicatorDates?: Indicator[];
  /** @internal The localized "week of year" label. */
  localizedWeekOfYear?: string;
  /**
   * The maximum date selectable in the month. Dates outside the range are visually disabled and
   * cannot be selected.
   *
   * @default undefined
   */
  max?: Date;
  /**
   * The minimum date selectable in the month. Dates outside the range are visually disabled and
   * cannot be selected.
   *
   * @default undefined
   */
  min?: Date;
  get month(): Date;
  /**
   * The current month to display.
   *
   * @default new Date()
   */
  set month(value: Date);
  /**
   * If set, will not render buttons for each day.
   *
   * @default false
   */
  readonly?: boolean;
  /** You can customize how a day is rendered by providing a custom renderer callback. */
  renderer?: MonthViewRenderer;
  /** @internal Emits when the user selects a day. */
  selectEvent: EventEmitter<SlSelectEvent<Date>>;
  /**
   * The selected date.
   *
   * @default undefined
   */
  selected?: Date;
  /**
   * Highlights today's date when set.
   *
   * @default false
   */
  showToday?: boolean;
  /**
   * Will render a column with the week numbers when true.
   *
   * @default false
   */
  showWeekNumbers?: boolean;
  /** @internal The translated days of the week. */
  weekDays: Array<{
    long: string;
    short: string;
  }>;
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /** Renders the header row with week day names. Override this to customize the header. */
  renderHeader(): TemplateResult;
  /** Renders a single day cell. You can also use the `renderer` property to customize how days look. */
  renderDay(day: Day): TemplateResult;
  /** Returns the default aria-label for a given day. */
  getDayLabel: (day: Day) => string;
  /** Returns an array of part names for a given day. */
  getDayParts: (day: Day) => string[];
  /** @internal */
  focus(options?: FocusOptions): void;
  /** @internal */
  focus(date: Date): void;
}
export {};
