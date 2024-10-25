import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './listbox.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-listbox': Listbox;
  }
}

export class Listbox extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  #lightStyles?: HTMLStyleElement;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'listbox');

    if (!this.#lightStyles) {
      const { check } = window.SLDS.icons;

      this.#lightStyles = document.createElement('style');
      this.#lightStyles.textContent = `
        sl-listbox option {
          align-items: center;
          border-radius: var(--sl-size-border-radius-default);
          color: var(--sl-color-text-default);
          cursor: pointer;
          display: flex;
          gap: var(--sl-space-new-md);
          min-block-size: auto;
          padding: var(--sl-space-new-sm) var(--sl-space-new-md);
          user-select: none;
          white-space: normal;
        }
        sl-listbox option::before {
          aspect-ratio: 1;
          background-color: currentColor;
          content: '';
          display: inline-flex;
          flex-shrink: 0;
          inline-size: 14px;
          mask-image: url("data:image/svg+xml,${encodeURIComponent(check.svg)}");
          mask-position: center;
          mask-repeat: no-repeat;
          mask-size: 14px;
          visibility: hidden;
        }
        sl-listbox option:where(:hover, [aria-current]) {
          background: var(--sl-color-action-background-accent-subtle-hover);
        }
        sl-listbox option:where([selected], [aria-selected='true'])::before {
          visibility: visible;
        }
        sl-listbox option:active {
          background: var(--sl-color-action-background-accent-subtle-active);
        }
        sl-listbox option:disabled {
          color: var(--sl-color-text-disabled);
          cursor: default;
          pointer-events: none;
        }
        sl-listbox optgroup {
          color: var(--sl-color-text-plain);
          display: flex;
          flex-direction: column;
          font-weight: normal;
          gap: var(--sl-space-new-2xs);
          line-height: 2rem;
          padding-inline: var(--sl-space-new-md);
          padding-inline-start: var(--sl-space-new-xl);
        }
        sl-listbox optgroup:not(:first-child) {
          border-block-start: var(--sl-color-elevation-border-raised) solid var(--sl-size-borderWidth-default);
          margin-block-start: var(--sl-space-new-sm);
          padding-block-start: var(--sl-space-new-md);
        }
        sl-listbox optgroup option {
          line-height: var(--sl-text-typeset-line-height-md);
          margin-inline-start: calc(-1 * var(--sl-space-new-xl) + var(--sl-space-new-md));
        }
      `;
      this.appendChild(this.#lightStyles);
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
