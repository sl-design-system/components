import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './nav-group.css' with { type: 'css' };

export class NavGroup extends LitElement {
  /** @internal */
  static styles: CSSResultGroup = styles;

  /** The section heading text. */
  @property() heading?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'group');
  }

  override render(): TemplateResult {
    return html`
      ${this.heading ? html`<h2 id="group-label">${this.heading}</h2>` : nothing}
      <slot></slot>
    `;
  }

  override updated(): void {
    if (this.heading) {
      this.setAttribute('aria-label', this.heading);
    } else {
      this.removeAttribute('aria-label');
    }
  }
}
