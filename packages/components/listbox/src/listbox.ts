import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './listbox.scss.js';

export class Listbox extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'listbox');
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
