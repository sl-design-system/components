import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type FormControl } from './form-control-mixin.js';
import { type LabelMark } from './label.js';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-form-field': SlFormFieldEvent;
  }
  interface HTMLElementTagNameMap {
    'sl-form-field': FormField;
  }
  interface ShadowRoot {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}
export type SlFormFieldEvent = CustomEvent<{
  unregister?(): void;
}> & {
  target: FormField;
};
declare const FormField_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A form field component that provides a label, hint, and error message for form controls. It can
 * be used with any form control that extends the `FormControl` mixin.
 *
 * @slot label - The `<sl-label>` element to use as the label for the form control.
 * @slot hint - The `<sl-hint>` element to use as a hint for the form control.
 * @slot error - The `<sl-error>` element to use as an error message for the form control.
 * @slot controls - The form control(s) to associate with this field.
 * @csspart wrapper - The container for the hint, controls, and error slots.
 * @csspart controls - The slot that contains the form control(s).
 */
export declare class FormField extends FormField_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** The form control element. */
  control?: HTMLElement & FormControl;
  /** @internal The message that will be displayed when the field is in an invalid state. */
  error?: string;
  /** @internal A record of error messages for all controls. */
  errors: Record<string, string | undefined>;
  /** @internal Emits when the field is added to a form. */
  formFieldEvent: EventEmitter<SlFormFieldEvent>;
  /**
   * A hint that will be shown when there are no validation messages. You can also slot an
   * `<sl-hint>` element.
   */
  hint?: string;
  /** The text for the label. You can also slot an `<sl-label>` element. */
  label?: string;
  /** How to mark this field depending if it is required or not. */
  mark?: LabelMark;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
