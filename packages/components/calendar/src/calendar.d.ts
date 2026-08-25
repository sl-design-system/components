import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Indicator } from './utils.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-calendar': Calendar;
  }
}
declare const Calendar_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared').Locale>;
/** A calendar component for displaying and selecting dates. */
export declare class Calendar extends Calendar_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal Emits when the value changes. */
  changeEvent: EventEmitter<SlChangeEvent<Date>>;
  /** The list of dates that should be set as disabled. */
  disabledDates?: Date[];
  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  firstDayOfWeek?: number;
  /**
   * The list of dates that should display an indicator. Each item has a `date` and optional `color`
   * and `label` values that are used to improve accessibility. Use `indicator-dates` to highlight
   * specific dates with a visual indicator (for example, exam dates or assignment deadlines)
   * without disabling them.
   */
  indicatorDates?: Indicator[];
  /**
   * The maximum date selectable in the calendar. Dates outside the range are visually disabled and
   * cannot be selected.
   *
   * @default undefined
   */
  max?: Date;
  /**
   * The minimum date selectable in the calendar. Dates outside the range are visually disabled and
   * cannot be selected.
   *
   * @default undefined
   */
  min?: Date;
  /** @internal The mode the calendar is currently in. */
  mode: 'day' | 'month' | 'year';
  /** The month that the calendar opens on. */
  month?: Date;
  /** Will disable the ability to select a date when set. */
  readonly?: boolean;
  /** The selected date. */
  selected?: Date;
  /** Highlights today's date when set. */
  showToday?: boolean;
  /** Shows the week numbers. */
  showWeekNumbers?: boolean;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
