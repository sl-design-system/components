import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
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

  /** Wether the parent tree node is expandable. */
  @property({ type: Boolean, reflect: true }) expandable?: boolean;

  /** Whether this node is the last one on this level; used for styling. */
  @property({ type: Boolean, attribute: 'last-node-in-level', reflect: true }) lastNodeInLevel?: boolean;

  /** Level of indentation. */
  @property({ type: Number }) level = 0;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('aria-hidden', 'true');
  }

  override render(): TemplateResult[] {
    return Array.from({ length: this.level }).map(() => html`<div part="guide"></div>`);
  }
}
