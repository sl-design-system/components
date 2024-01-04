import type { CSSResultGroup, TemplateResult, nothing } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './spinner.scss.js';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type SpinnerVariant = 'accent' | 'info' | 'danger' | 'success' | 'warning';

/**
 * Let the user know you are processing their data or that the (part of the) page is loading.
 *
 * ```html
 * <sl-spinner></sl-spinner>
 * ```

 */
export class Spinner extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @property({ reflect: true }) size: SpinnerSize = 'md';
  @property({ reflect: true }) variant?: SpinnerVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'alert');
    }
  }

  override render(): TemplateResult | typeof nothing {
    return html`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
      <g>
        <path
          fill-rule="evenodd"
          d="M24 6C14.059 6 6 14.059 6 24s8.059 18 18 18 18-8.059 18-18S33.941 6 24 6ZM0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24Z"
          clip-rule="evenodd"
          style="fill:var(--_color);opacity:var(--_shadow-opacity);"
        />
        <path
          fill-rule="evenodd"
          d="M24 6C14.059 6 6 14.059 6 24a3 3 0 1 1-6 0C0 10.745 10.745 0 24 0s24 10.745 24 24a3 3 0 1 1-6 0c0-9.941-8.059-18-18-18Z"
          clip-rule="evenodd"
          style="fill:var(--_color);"
        />
      </g>
    </svg>`;
  }
}
