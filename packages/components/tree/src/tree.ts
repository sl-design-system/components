import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tree.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
}

export class Tree extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** If you are able to select one or more tree items (at the same time). */
  @property() selects?: 'single' | 'multiple';

  override render(): TemplateResult {
    return html`<slot>HOHOHO</slot>`;
  }
}
