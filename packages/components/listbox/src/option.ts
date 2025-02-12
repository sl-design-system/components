import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './option.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-option': Option;
  }
}

export type OptionEmphasis = 'subtle' | 'bold';

/**
 * An option in a list, such as select or combobox.
 *
 * @slot default - The option's label.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Option<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether this option is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * The emphasis style when selected.
   * @default 'subtle'
   */
  @property({ reflect: true }) emphasis?: OptionEmphasis;

  /** Whether this option is selected. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  override get textContent(): string {
    return this.#getSlottedTextContent();
  }

  /**
   * The value for this option. If not explicitly set,
   * it will use the text content as the value.
   */
  @property() value?: T;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'option');
  }

  override render(): TemplateResult {
    return html`
      <div part="container">
        <sl-icon name="check"></sl-icon>
        <div part="wrapper">
          <slot></slot>
        </div>
      </div>
    `;
  }

  #getSlottedTextContent(): string {
    const nodes =
      this.renderRoot.querySelector('slot')?.assignedNodes({ flatten: true }) ?? Array.from(this.childNodes);

    return nodes
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join('');
  }
}
