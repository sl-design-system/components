import { Option } from '@sl-design-system/listbox';
import { type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './suggestion-option.css' with { type: 'css' };

/**
 * @internal Option for a suggested search phrase. An exact match is only exposed through
 * `aria-selected`, without the selected background or checkmark.
 */
export class SuggestionOption extends Option {
  /** @internal */
  static override styles: CSSResultGroup = [Option.styles, styles];

  /** Whether the phrase matches the query exactly. Not reflected, so no selected styling applies. */
  @property({ type: Boolean }) override selected?: boolean;
}
