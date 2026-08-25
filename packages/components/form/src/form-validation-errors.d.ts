import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type FormController } from './form-controller.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-form-validation-errors': FormValidationErrors;
  }
}
declare const FormValidationErrors_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
export declare class FormValidationErrors extends FormValidationErrors_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** The form controller to listen to. */
  controller?: FormController;
  /** The invalid controls in the form. */
  invalidControls: Record<string, HTMLElement>;
  /** The validity of the form. */
  validity?: 'valid' | 'invalid';
  /** The variant of the inline message. */
  variant?: 'danger' | 'success';
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
