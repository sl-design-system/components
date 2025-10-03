import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './indent-guides.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-indent-guides': IndentGuides;
  }
}

/**
 * A component that renders indentation guides for tree nodes. This component
 * is not public API and is used internally by `<sl-tree>`.
 */
export class IndentGuides extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether this node is the last one on this level; used for styling. */
  @property({ type: Boolean, attribute: 'last-node-in-level', reflect: true }) lastNodeInLevel?: boolean;

  /** Level of indentation. */
  @property({ type: Number }) level = 0;

  /** Will show a selection indicator if set. */
  @property({ type: Boolean, reflect: true }) selected?: false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('aria-hidden', 'true');
  }

  override render(): TemplateResult {
    return html`
      ${Array.from({ length: this.level }).map(
        (_, index) => html`<div class="guide${index === this.level - 1 ? ' last' : ''}"></div>`
      )}
      ${this.selected ? html`<div class="selected"></div>` : nothing}
    `;
  }
}
