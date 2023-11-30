import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Icon } from '@sl-design-system/icon';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './badge.scss.js';

export type BadgeSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type BadgeVariant = 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'accent';

/**
 * Show totals at a glance or labels contents with a tag.
 *
 * ```html
 * <sl-badge> 99+ </sl-badge>
 * ```
 *
 * @slot default - Contents of the badge
 */
export class badge extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @property({ reflect: true }) size: BadgeSize = 'md';
  @property({ reflect: true }) variant: BadgeVariant = 'neutral';

  /** @private The slotted icons. */
  @queryAssignedElements() icons?: Icon[];

  override render(): TemplateResult {
    return this.size !== 'sm' ? html`<slot @slotchange=${this.#onSlotchange}></slot>` : html``;
  }

  async #onSlotchange(): Promise<void> {
    this.icons?.forEach(icon => (icon.size = 'xs'));
  }
}
