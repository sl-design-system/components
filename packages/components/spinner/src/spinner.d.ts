import { type CSSResultGroup, LitElement, type TemplateResult, type nothing } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-spinner': Spinner;
  }
}
export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
/**
 * Let the user know you are processing their data or that the (part of the) page is loading.
 *
 * ```html
 * <sl-spinner></sl-spinner>
 * ```
 *
 * @cssprop --sl-spinner-size - The size of the spinner, defaults to `md` if not set.
 */
export declare class Spinner extends LitElement {
  /** @internal */
  static styles: CSSResultGroup;
  /** The size of the spinner. Defaults to `md` with css properties if not attribute is not set. */
  size?: SpinnerSize;
  connectedCallback(): void;
  render(): TemplateResult | typeof nothing;
}
