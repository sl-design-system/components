import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './indent-guides.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-indent-guides': IndentGuides;
  }
}

export class IndentGuides extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Wether the parent tree node is expandable. */
  @property({ type: Boolean, reflect: true }) expandable?: boolean;

  /** Whether this node is the last one on this level; used for styling. */
  @property({ type: Boolean, attribute: 'last-node-in-level', reflect: true }) lastNodeInLevel?: boolean;

  /** Level of indentation. */
  @property({ type: Number, reflect: true }) level = 0;

  override updated(changes: PropertyValues<this>): void {
    if (changes.has('level')) {
      this.style.setProperty('--guide-level', this.level.toString());
    }
  }

  override render(): TemplateResult[] {
    return Array(this.level)
      .fill(0)
      .map(() => html`<div part="guide"></div>`);
  }
}
