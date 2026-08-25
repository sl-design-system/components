import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
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
export declare class Badge extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * The color of the badge.
   *
   * @default grey
   */
  color?: BadgeColor;
  /**
   * The emphasis of the badge.
   *
   * @default subtle
   */
  emphasis?: BadgeEmphasis;
  /**
   * The size of the badge component.
   *
   * @default 'md'
   */
  size?: BadgeSize;
  /**
   * The variant of the badge. This property is deprecated. Use the color property instead.
   *
   * @deprecated Use the color property instead.
   * @default neutral
   */
  variant?: BadgeVariant;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): TemplateResult;
}
