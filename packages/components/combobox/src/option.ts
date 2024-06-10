import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './option.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-option': Option;
  }
}

export type OptionSize = 'md' | 'lg';

export class Option extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether the option is current. */
  @property({ type: Boolean, reflect: true }) current?: boolean;

  /** Whether the option is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Whether the option is selected. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  /** @internal The size of the option, is set by the parent component. */
  @property({ reflect: true }) size: OptionSize = 'md';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property() value?: any;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
