import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './badge.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-badge': Badge;
  }
}

export type BadgeSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type BadgeVariant = 'neutral' | 'primary' | 'info' | 'danger' | 'success' | 'warning' | 'accent';

/**
 * Show totals at a glance or labels contents with a tag.
 *
 * ```html
 * <sl-badge>99+</sl-badge>
 * ```
 *
 * @slot default - Contents of the badge
 */
export class Badge extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The size of the badge component. */
  @property({ reflect: true }) size: BadgeSize = 'md';

  /** The variant of the badge. */
  @property({ reflect: true }) variant: BadgeVariant = 'neutral';

  override render(): TemplateResult | typeof nothing {
    return this.size !== 'sm' ? html`<slot></slot>` : nothing;
  }
}
