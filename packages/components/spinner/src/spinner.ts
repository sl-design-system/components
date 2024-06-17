import { type CSSResultGroup, LitElement, type TemplateResult, html, type nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './spinner.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-spinner': Spinner;
  }
}

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type SpinnerVariant = 'accent' | 'info' | 'danger' | 'success' | 'warning';

/**
 * Let the user know you are processing their data or that the (part of the) page is loading.
 *
 * ```html
 * <sl-spinner></sl-spinner>
 * ```
 *
 * @cssprop --sl-spinner-size - The size of the spinner, defaults to `md` if not set.
 */
export class Spinner extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The size of the spinner. Defaults to `md` with css properties if not attribute is not set. */
  @property({ reflect: true }) size?: SpinnerSize;

  /** The spinner variant. */
  @property({ reflect: true }) variant?: SpinnerVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'presentation');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  override render(): TemplateResult | typeof nothing {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-24 -24 48 48">
        <g class="slow">
          <g class="fast">
            <g transform="translate(-24, -24)">
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
          </g>
        </g>
      </svg>
    `;
  }
}
