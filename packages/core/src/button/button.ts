import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button.scss.js';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonFill = 'default' | 'outline' | 'pill';

export type ButtonVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export class Button extends LitElement {
  /** @private */
  static styles: CSSResultGroup = styles;

  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The button fill. */
  @property({ reflect: true }) fill: ButtonFill = 'default';

  /** Size. */
  @property({ reflect: true }) size: ButtonSize = 'md';

  /** The variant. */
  @property({ reflect: true }) variant: ButtonVariant = 'default';

  connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('tabindex', '0');
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
