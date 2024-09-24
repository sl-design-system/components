import { localized, msg, str } from '@lit/localize';
import { type CSSResultGroup, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './no-match.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-no-match': NoMatch;
  }
}

/**
 * Message component for when filtering a listbox yields no matches.
 */
@localized()
export class NoMatch extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The string that did not yield any matches. */
  @property() value?: string;

  override render(): string {
    return msg(str`No options starting with "${this.value}" have been found.`);
  }
}
