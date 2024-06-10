import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './badge.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-badge': Badge;
  }
}

export type BadgeEmphasis = 'subtle' | 'bold';
export type BadgeSize = 'md' | 'lg';
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
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The emphasis of the badge; defaults to 'subtle'. */
  @property({ reflect: true }) emphasis: BadgeEmphasis = 'subtle';

  /** The size of the badge component. */
  @property({ reflect: true }) size: BadgeSize = 'md';

  /** The variant of the badge. */
  @property({ reflect: true }) variant: BadgeVariant = 'neutral';

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      icon = elements.length === 1 && elements[0].tagName === 'SL-ICON',
      text = event.target
        .assignedNodes({ flatten: true })
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent?.trim())
        .join('');

    // Toggle the round attribute if the badge contains only an icon, or a single character
    this.toggleAttribute('round', (icon && text === '') || (!icon && text?.length === 1));
  }
}
