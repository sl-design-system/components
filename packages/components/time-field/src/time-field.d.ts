import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { FieldButton } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type DateFormatPart, type PartialTimePart } from './utils.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-time-field': TimeField;
  }
}
declare const TimeField_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl> &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared').Locale>;
/**
 * A form component that allows the user to pick a time. Uses individual spinbutton inputs per time
 * part for improved accessibility.
 *
 * @cssState has-focus - Set when the time field has focus.
 * @cssState has-value - Set when the time field has a value.
 * @cssState placeholder-shown - Set when the time field is empty and has a placeholder.
 */
export declare class TimeField extends TimeField_base {
  #private;
  /** @internal */
  static formAssociated: boolean;
  /** The default step between each hour option. */
  static hourStep: number;
  /** The default step between each minute option. */
  static minuteStep: number;
  /** @internal The default offset of the popover to the text-field. */
  static offset: number;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The default margin between the popover and the viewport. */
  static viewportMargin: number;
  /** @internal Emits when the focus leaves the component. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /** @internal */
  button?: FieldButton;
  /** @internal Emits when the value changes. */
  changeEvent: EventEmitter<SlChangeEvent<string>>;
  /** @internal The dialog element that is also the popover. */
  dialog?: HTMLDialogElement;
  /** Whether the time field is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /** @internal Emits when the component gains focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  /** The step between each hour option. */
  hourStep: number;
  /** @internal */
  readonly internals: ElementInternals;
  /**
   * The maximum time selectable in the field.
   *
   * @default undefined
   */
  max?: string;
  /**
   * The minimum time selectable in the field.
   *
   * @default undefined
   */
  min?: string;
  /** The step between each minute option. */
  minuteStep: number;
  /**
   * The placeholder for the time field.
   *
   * @default undefined
   */
  placeholder?: string;
  /** @internal Whether the placeholder is currently shown. */
  placeholderShown?: boolean;
  /**
   * Whether the time field is readonly.
   *
   * @default false
   */
  readonly?: boolean;
  /**
   * Whether the time field is a required field.
   *
   * @default false
   */
  required?: boolean;
  /** @internal Whether the component is in "select all" mode, showing a single text input. */
  selectAll?: boolean;
  /**
   * Whether the component is select only. This means you cannot type in the inputs, but you can
   * still pick a time via the popover.
   *
   * @default false
   */
  selectOnly?: boolean;
  /**
   * The start time; the time that has the initial focus when the picker is opened without a value.
   * If will use the current time if not explicitly set.
   *
   * @default undefined
   */
  start?: string;
  /**
   * Stores the individual time parts when the user is editing. These are stored separately from
   * `value` to support partial times.
   *
   * @internal
   */
  timeParts: PartialTimePart;
  get value(): string | undefined;
  set value(value: string | undefined);
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  /** @internal */
  focus(): void;
  render(): TemplateResult;
  /** @internal */
  renderPart(part: DateFormatPart, locale: string, timePartIndex: number): TemplateResult;
  /**
   * Renders hour options (00–23) using hourStep, applies min/max constraints, and marks the
   * selected hour with aria-selected. Can be overridden.
   */
  renderHours(): TemplateResult[];
  /**
   * Renders minute options using minuteStep and marks the selected one with aria-selected. Can be
   * overridden.
   */
  renderMinutes(): TemplateResult[];
  /** Show the time picker. */
  showPicker(): void;
  /** Hide the time picker. */
  hidePicker(): void;
  /** @internal */
  updateInternalValidity(): void;
}
export {};
