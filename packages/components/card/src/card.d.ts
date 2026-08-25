import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-card': Card;
  }
}
export type CardOrientation = 'horizontal' | 'vertical';
declare const Card_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * Use cards to display media and text in a compact, appealing way.
 *
 * ```html
 * <sl-card></sl-card>
 * ```
 *
 * @cssprop --sl-card-media-size - Depending on the orientation, this will set the height or width of the media. Can be set in pixels, percentage or `fr`.
 * @cssprop --sl-card-horizontal-breakpoint - When card is smaller than this size it will switch from horizontal (when set) to vertical layout.
 * @cssprop --sl-card-image-backdrop - Color of the image backdrop when `fit-image` is set.
 *
 * @slot default - Title of the card
 * @slot media - Image of the card.
 * @slot header - Subtitle or badges
 * @slot body - Body text of the card
 * @slot actions - Main actions of the card, these will be displayed at the bottom of the card, This can be a single button or a button-bar.
 * @slot menu-button - A menu button to display additional actions or a toggle button. This will be displayed in the header of the card.
 */
export declare class Card extends Card_base {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The slotted media. */
  media?: HTMLElement[];
  /**
   * When set the image won't be stretched and cropped to fill the whole container, but instead
   * shown fully, with a margin around it. In horizontal mode this will need the card to have an
   * explicit image size set, either by subgrid or by `--sl-card-media-size`
   */
  fitImage?: boolean;
  /** Adds a little margin around the image */
  mediaMargin?: boolean;
  /**
   * When fit-image is set, setting this will create a blurred copy of the image in the margin
   * around the image.
   */
  imageBackdrop?: boolean;
  /**
   * When the grid inside the card is defined by a parent grid, ideal for layout consistency, even
   * when the contents of the card change.
   */
  subgrid?: boolean;
  /** The position of the media in relation to the text */
  orientation: CardOrientation;
  connectedCallback(): void;
  disconnectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
