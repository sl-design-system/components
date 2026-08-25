import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-select-year': SelectYear;
  }
}
declare const SelectYear_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
export declare class SelectYear extends SelectYear_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** The buttons representing each year. */
  buttons: NodeListOf<HTMLButtonElement>;
  /** The years grid table used as focus scope. */
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
  /** The currently selected date. (In order to style current month) */
  selected?: Date;
  /** @internal Emits when the user selects a year. */
  selectEvent: EventEmitter<SlSelectEvent<Date>>;
  /**
   * Highlights the current year when set.
   *
   * @default false
   */
  showCurrent?: boolean;
  /** The current year. */
  year: Date;
  /** @internal The year you can select from. */
  years: number[];
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  renderYear(year: number, rowIndex: number, colIndex: number): TemplateResult;
}
export {};
