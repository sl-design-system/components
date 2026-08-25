import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-hint': Hint;
  }
}
export type HintSize = 'sm' | 'md' | 'lg';
/**
 * Component for displaying a hint for a form control.
 *
 * @slot hint-text - The hint to display.
 */
export declare class Hint extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** The size at which the hint is displayed. */
  size: HintSize;
  connectedCallback(): void;
  render(): TemplateResult;
}
