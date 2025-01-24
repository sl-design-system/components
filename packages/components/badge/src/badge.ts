import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './badge.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-badge': Badge;
  }
}

export type BadgeColor = 'blue' | 'green' | 'grey' | 'orange' | 'purple' | 'red' | 'teal' | 'yellow';
export type BadgeEmphasis = 'subtle' | 'bold';
export type BadgeSize = 'sm' | 'md' | 'lg';
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

  /**
   * The color of the badge.
   * @default grey
   */
  @property({ reflect: true }) color?: BadgeColor;

  /**
   * The emphasis of the badge.
   * @default subtle
   */
  @property({ reflect: true }) emphasis?: BadgeEmphasis;

  /**
   * The size of the badge component.
   * @default md
   */
  @property({ reflect: true }) size?: BadgeSize;

  /**
   * The variant of the badge. This property is deprecated. Use the color property instead.
   * @default neutral
   * @deprecated Use the color property instead.
   */
  @property({ reflect: true }) variant?: BadgeVariant;

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
