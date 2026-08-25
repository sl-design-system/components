import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlSelectEvent, SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Indicator } from './utils.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-select-day': SelectDay;
  }
}
declare const SelectDay_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared').Locale>;
export declare class SelectDay extends SelectDay_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** The list of dates that should be set as disabled. */
  disabledDates?: Date[];
  /** @internal The month/year that will be displayed in the header. */
  displayMonth?: Date;
  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  firstDayOfWeek: number;
  /**
   * The list of dates that should display an indicator. Each item is an Indicator with a `date`, an
   * optional `color` and 'label' that is used to improve accessibility (added as a tooltip).
   */
  indicatorDates?: Indicator[];
  /** @internal The localized "week of year" label. */
  localizedWeekOfYear?: string;
  /**
   * The maximum date selectable in the month.
   *
   * @default undefined
   */
  max?: Date;
  /**
   * The minimum date selectable in the month.
   *
   * @default undefined
   */
  min?: Date;
  /** The month that is shown. */
  month: Date;
  /** @internal The next month in the calendar. */
  nextMonth?: Date;
  /** @internal The previous month in the calendar. */
  previousMonth?: Date;
  /** Will disable selecting a date when set. */
  readonly?: boolean;
  /** @internal The scroller element. */
  scroller?: HTMLElement;
  /** The selected date. */
  selected?: Date;
  /** @internal Emits when the user selects a day. */
  selectEvent: EventEmitter<SlSelectEvent<Date>>;
  /** Highlights today's date when set. */
  showToday?: boolean;
  /** Shows the week numbers. */
  showWeekNumbers?: boolean;
  /** @internal Emits when the user clicks the month/year button. */
  toggleEvent: EventEmitter<SlToggleEvent<'month' | 'year'>>;
  /** @internal The translated days of the week. */
  weekDays: Array<{
    long: string;
    short: string;
  }>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
