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

/**
 * An option in a list, such as select or combobox.
 *
 * @slot default - The option's label.
 */
export class Option extends ScopedElementsMixin(LitElement) {
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

  /** Whether this option is selected. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  override get textContent(): string | null {
    return this.#getSlottedTextContent();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property() value?: any;

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

  #getSlottedTextContent(): string | null {
    const nodes =
      this.renderRoot.querySelector('slot')?.assignedNodes({ flatten: true }) ?? Array.from(this.childNodes);

    return nodes
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join('');
  }
}
