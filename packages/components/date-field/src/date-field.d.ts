import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Calendar } from '@sl-design-system/calendar';
import { type EventEmitter } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type DateFormatPart } from './utils.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-date-field': DateField;
  }
}
declare const DateField_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl> &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared').Locale>;
/**
 * A form component that allows the user to pick a date from a calendar. Uses individual spinbutton
 * inputs per date part for improved accessibility.
 *
 * @cssState has-focus - Set when the date field has focus.
 * @cssState has-value - Set when the date field has a value.
 * @cssState placeholder-shown - Set when the date field is empty and has a placeholder.
 */
export declare class DateField extends DateField_base {
  #private;
  /** @internal */
  static formAssociated: boolean;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal Emits when the focus leaves the component. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /**
   * The calendar element. This will return an instance of the calendar when the dialog is shown or
   * always when the calendar is slotted. Otherwise it will return undefined.
   */
  get calendar(): Calendar | null;
  /** @internal Whether the calendar dialog is currently visible. */
  calendarVisible?: boolean;
  /** @internal Whether the default slot contains action controls. */
  hasActionSlotContent?: boolean;
  /** @internal Emits when the value changes. */
  changeEvent: EventEmitter<SlChangeEvent<Date | undefined>>;
  /**
   * Stores the individual date parts when the user is editing. These are stored separately from
   * `value` to support partial dates.
   *
   * @internal
   */
  dateParts: {
    day?: number;
    month?: number;
    year?: number;
  };
  /** @internal The dialog element. */
  dialog?: HTMLDialogElement;
  /** Whether the date field is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /**
   * The first day of the week; 0 for Sunday, 1 for Monday.
   *
   * @default 1
   */
  firstDayOfWeek?: number;
  /** @internal Emits when the component gains focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  get formValue(): string | null;
  set formValue(value: Date | string | null);
  /** @internal */
  readonly internals: ElementInternals;
  /**
   * The maximum date selectable in the calendar.
   *
   * @default undefined
   */
  max?: Date;
  /**
   * The minimum date selectable in the calendar.
   *
   * @default undefined
   */
  min?: Date;
  /** The current month to display. */
  month?: Date;
  /**
   * Placeholder text shown when there is no value and the field is not focused.
   *
   * @default undefined
   */
  placeholder?: string;
  /** @internal Whether the placeholder is currently shown. */
  placeholderShown?: boolean;
  /**
   * Whether the date field is readonly.
   *
   * @default false
   */
  readonly?: boolean;
  /**
   * When set, a "Confirm" button will be shown in the dialog, and the user will need to click it to
   * confirm their date selection.
   */
  requireConfirmation?: boolean;
  /**
   * Whether the date field is a required field.
   *
   * @default false
   */
  required?: boolean;
  /** @internal Whether the component is in "select all" mode, showing a single text input. */
  selectAll?: boolean;
  /**
   * Whether the component is select only. This means you cannot type in the inputs, but you can
   * still pick a date via the dialog.
   *
   * @default false
   */
  selectOnly?: boolean;
  /**
   * Shows the week numbers.
   *
   * @default false
   */
  showWeekNumbers?: boolean;
  /** The selected date in the calendar. */
  value?: Date;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  /** @internal */
  focus(): void;
  render(): TemplateResult;
  /** @internal */
  renderPart(part: DateFormatPart, locale: string): TemplateResult;
  /** @internal */
  updateInternalValidity(): void;
  /** Show the date picker. */
  showPicker(): void;
  /** Hide the date picker. */
  hidePicker(): void;
}
export {};
