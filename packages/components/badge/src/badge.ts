import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './badge.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-badge': Badge;
  }
}

export type BadgeColor =
  | 'blue'
  | 'green'
  | 'grey'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';
export type BadgeEmphasis = 'subtle' | 'bold';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'info'
  | 'danger'
  | 'success'
  | 'warning'
  | 'accent';

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

  #mutationObserver = new MutationObserver(() => this.#updateRoundAttribute());

  /**
   * The color of the badge.
   *
   * @default grey
   */
  @property({ reflect: true }) color?: BadgeColor;

  /**
   * The emphasis of the badge.
   *
   * @default subtle
   */
  @property({ reflect: true }) emphasis?: BadgeEmphasis;

  /**
   * The size of the badge component.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: BadgeSize;

  /**
   * The variant of the badge. This property is deprecated. Use the color property instead.
   *
   * @deprecated Use the color property instead.
   * @default neutral
   */
  @property({ reflect: true }) variant?: BadgeVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#mutationObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#mutationObserver.disconnect();
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  #onSlotChange(): void {
    this.#updateRoundAttribute();
  }

  #updateRoundAttribute(): void {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return;

    const elements = slot.assignedElements({ flatten: true }),
      icon = elements.length === 1 && elements[0].tagName === 'SL-ICON',
      text = slot
        .assignedNodes({ flatten: true })
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent?.trim())
        .join('');

    // Toggle the round attribute if the badge contains only an icon, or a single character
    this.toggleAttribute(
      'round',
      (icon && text === '') ||
        (!icon && text?.length === 1) ||
        (this.size === 'sm' && text?.length > 0)
    );
  }
}
