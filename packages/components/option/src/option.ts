import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './option.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-option': Option;
  }
}

/**
 * An option in a list, such as select or combobox.
 *
 * @slot default - The option's label.
 */
export class Option extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property() value?: any;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
