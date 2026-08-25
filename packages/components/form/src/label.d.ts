import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type FormControl } from './form-control-mixin.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-label': Label;
  }
}
export type LabelMark = 'optional' | 'required';
export type LabelSize = 'sm' | 'md' | 'lg';
/**
 * Label component that hooks a `<label>` element up with the input element of the form control,
 * assuming the input element is in the light DOM (same context of the label).
 *
 * @slot infotip - The infotip element to show next to the label.
 * @slot label - The label element, which is rendered in the light DOM.
 */
export declare class Label extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether the form control is disabled; when set no interaction is possible. */
  disabled: boolean;
  /** The DOM id of the form control this is linked to. */
  for?: string;
  /** @internal The associated form control. */
  formControl:
    | (HTMLElement &
        FormControl & {
          size?: string;
        })
    | null;
  /**
   * Indicates whether the label should indicate if the field is optional or required. If you have a
   * form field that contains more than one control, and the "required" state is a combination of
   * the controls, you can use this property to hide the "optional" indicator.
   */
  mark?: LabelMark;
  /** @internal Whether this label should be marked as required. */
  required?: boolean;
  /** The size of the label. */
  size: LabelSize;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
