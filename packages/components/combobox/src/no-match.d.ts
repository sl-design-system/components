import { type CSSResultGroup, LitElement } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-no-match': NoMatch;
  }
}
/** Message component for when filtering a listbox yields no matches. */
export declare class NoMatch extends LitElement {
  /** @internal */
  static styles: CSSResultGroup;
  /** The string that did not yield any matches. */
  value?: string;
  render(): string;
}
