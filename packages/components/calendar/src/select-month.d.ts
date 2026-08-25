import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlSelectEvent, SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Month } from './utils.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-select-month': SelectMonth;
  }
}
declare const SelectMonth_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared').Locale>;
export declare class SelectMonth extends SelectMonth_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** The buttons representing each month. */
  buttons: NodeListOf<HTMLButtonElement>;
  /** The months grid table used as focus scope. */
  table: HTMLTableElement;
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
  /** The month/year to display. */
  month: Date;
  /** @internal The months to display. */
  months: Month[];
  /** The currently selected date. (In order to style current month) */
  selected?: Date;
  /** @internal Emits when the user selects a month. */
  selectEvent: EventEmitter<SlSelectEvent<Date>>;
  /**
   * Highlights the current month when set.
   *
   * @default false
   */
  showCurrent?: boolean;
  /** @internal Emits when the user clicks the month/year button. */
  toggleEvent: EventEmitter<SlToggleEvent<'month' | 'year'>>;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  renderMonth(month: Month, rowIndex: number, colIndex: number): TemplateResult;
}
export {};
