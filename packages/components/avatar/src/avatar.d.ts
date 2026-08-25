import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-avatar': Avatar;
  }
}
export type AvatarColor =
  | 'blue'
  | 'green'
  | 'grey'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';
export type AvatarEmphasis = 'subtle' | 'bold';
export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
declare const Avatar_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * An avatar component to show a picture, initials or icon, to provide a quickly recognizable
 * representation of a user.
 *
 * ```html
 * <sl-avatar
 *   display-name="Lynn Smith"
 *   picture-url="http://sanomalearning.design/avatars/lynn.png"></sl-avatar>
 * ```
 *
 * @slot - The subheading of the avatar.
 * @slot badge - The badge to display on the avatar.
 * @slot fallback - The fallback content to display when no picture is set.
 *
 * @csspart avatar - The container for positioning the badge.
 * @csspart initials - The initials to display when no picture is set.
 * @csspart name - The display name, either a `<span>` or `<a>` if `href` is set.
 * @csspart picture - The element containing the image, initials or fallback content.
 * @csspart tooltip - The tooltip that is shown when the display name overflows.
 * @csspart wrapper - The wrapper element around the image and name.
 */
export declare class Avatar extends Avatar_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** The slotted badge element. */
  badge?: Badge;
  /** @internal The clip-path cutout for the badge. */
  clipPath?: string;
  /**
   * The color of the avatar.
   *
   * @default grey
   */
  color?: AvatarColor;
  /**
   * The initials that need to be displayed. If none are set they are determined based on the
   * displayName .
   */
  displayInitials?: string;
  /** The name that needs to be displayed. */
  displayName?: string;
  /**
   * The emphasis of the avatar.
   *
   * @default subtle
   */
  emphasis?: AvatarEmphasis;
  /** An optional URL that will be used for linking the display name. */
  href?: string;
  /** This hides the name when set to true. */
  imageOnly?: boolean;
  /** @internal The initials, either explicitly via displayInitials, or implicitly via displayName. */
  initials: string;
  /** The url of the avatar image. */
  pictureUrl?: string;
  /** The shape of the avatar. Defaults to 'circle'. */
  shape?: AvatarShape;
  /** The size of the avatar. */
  size: AvatarSize;
  /** @internal Whether the tooltip is visible. */
  tooltip?: boolean;
  /** If true, will display the name below the image. */
  vertical?: boolean;
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  renderAvatar(): TemplateResult;
}
export {};
