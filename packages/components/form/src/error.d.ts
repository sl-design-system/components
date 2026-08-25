import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-error': Error;
  }
}
export type ErrorSize = 'sm' | 'md' | 'lg';
declare const Error_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * Component for displaying an error message for a form control.
 *
 * @slot error-text - The error message to display.
 */
export declare class Error extends Error_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * The ID of the form control this error message is associated with. Use this to link the error
   * message to a specific form control. This is useful for when a form field has more than 1 form
   * control. If the form field has only 1 form control, the error message will automatically be
   * associated with that form control.
   */
  for?: string;
  connectedCallback(): void;
  render(): TemplateResult;
}
export {};
