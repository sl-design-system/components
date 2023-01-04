import type { TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LitElement, css, html } from 'lit';

@customElement('ds-alert')
export class Alert extends LitElement {
  static override styles = css`
    :host {
      width: 100%;
      display: inline-block;
      padding: 10px;
    }

    :host([variant='success']) {
      border-color: var(--code-border) var(--code-border) var(--ds-color-emerald);
      border-radius: 6px;
      border-style: solid;
      border-width: 1px 1px 4px;
      color: var(--helper-text);
      font-size: 1.4rem;
      margin: 1.6rem auto;
      padding: 1.8rem 3rem 1.8rem 4rem;

      ul {
        margin: 0;
      }

      h3 {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        margin-bottom: 0;
      }
    }

    :host([variant='danger']) {
      border-color: var(--code-border) var(--code-border) var(--ds-color-red);
      border-radius: 6px;
      border-style: solid;
      border-width: 1px 1px 4px;
      color: var(--helper-text);
      font-size: 1.4rem;
      margin: 1.6rem auto;
      padding: 1.8rem 3rem 1.8rem 4rem;

      ul {
        margin: 0;
      }

      h3 {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        margin-bottom: 0;
      }
    }

    :host([variant='success-small']) {
      background-color: rgba(var(--ds-color-emerald-rgb), 0.08);
      background-image: var(--success-icon);
      background-position: left;
      background-position-x: 1.8rem;
      background-position-y: 2.2rem;
      background-repeat: no-repeat;
      border-radius: 6px;
      color: var(--helper-text);
      font-size: 1.4rem;
      margin: 1.6rem auto;
      padding: 1.8rem 3rem 1.8rem 4rem;
    }

    :host([variant='danger-small']) {
      background-color: rgba(var(--ds-color-red-rgb), 0.08);
      background-image: var(--error-icon);
      background-position: left;
      background-position-x: 1.8rem;
      background-position-y: 2.2rem;
      background-repeat: no-repeat;
      border-radius: 6px;
      color: var(--helper-text); //#fefefe;
      font-size: 1.4rem;
      margin: 1.6rem auto;
      padding: 1.8rem 3rem 1.8rem 4rem;
    }

    ::slotted(*) {
      font-size: 1.4rem;
      margin: 0;
    }

    ::slotted(ul) {
      margin: 0;
      padding-left: 2.2rem;
    }

    ul {
      margin: 0;
    }

    ::slotted * {
      margin: 0;
    }
  `;

  @property({ reflect: true }) variant: 'success' | 'danger' | 'success-small' | 'danger-small' = 'success';

  @property({ reflect: true }) heading?: string;

  override render(): TemplateResult {
    return html`
      ${this.heading && (this.variant === 'success' || this.variant === 'danger')
        ? html` <h3>${this.heading}</h3>`
        : ''}
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-alert': Alert;
  }
}
