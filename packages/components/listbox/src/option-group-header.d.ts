import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-option-group-header': OptionGroupHeader;
  }
}
/**
 * A header for an option group. Split out as a separate component so it can be used both with
 * `<lit-virtualizer>` and without.
 */
export declare class OptionGroupHeader extends LitElement {
  /** @internal */
  static styles: CSSResultGroup;
  /** Will render a horizontal divider when set. */
  divider?: boolean;
  connectedCallback(): void;
  render(): TemplateResult;
}
