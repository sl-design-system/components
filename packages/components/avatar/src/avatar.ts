import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './avatar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-avatar': Avatar;
  }
}

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

/**
 * An avatar component to show a picture, initials or icon, to provide a quickly recognizable representation of a user.
 *
 * ```html
 *   <sl-avatar display-name="Lynn Smith" picture-url="http://sanomalearning.design/avatars/lynn.png"></sl-avatar>
 * ```
 *
 * @csspart avatar - The container for positioning the badge.
 * @csspart initials - The initials to display when no picture is set.
 * @csspart name - The display name, either a <span> or <a> if `href` is set.
 * @csspart picture - The element containing the image, initials or fallback content.
 * @csspart wrapper - The wrapper element around the image and name.
 *
 * @slot badge - The badge to display on the avatar.
 * @slot default - The subheading of the avatar.
 * @slot fallback - The fallback content to display when no picture is set.
 */
export class Avatar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observe the size of various elements. */
  #observer = new ResizeObserver(() => this.#onResize());

  /** The slotted badge element. */
  badge?: Badge;

  /** The clip-path cutout for the badge. */
  @state() clipPath?: string;

  /** The initials that need to be displayed. If none are set they are determined based on the displayName .*/
  @property({ attribute: 'display-initials' }) displayInitials?: string;

  /** The name that needs to be displayed. */
  @property({ attribute: 'display-name' }) displayName?: string;

  /** An optional URL that will be used for linking the display name. */
  @property() href?: string;

  /** This hides the name when set to true. */
  @property({ type: Boolean, reflect: true, attribute: 'image-only' }) imageOnly?: boolean;

  /** @internal The initials, either explicitly via displayInitials, or implicitly via displayName. */
  @state() initials = '';

  /** The url of the avatar image. */
  @property({ attribute: 'picture-url' }) pictureUrl?: string;

  /** The size of the avatar. */
  @property({ reflect: true }) size: AvatarSize = 'md';

  /** If true, will display the name below the image. */
  @property({ type: Boolean, reflect: true }) vertical?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('displayName') || changes.has('displayInitials')) {
      if (this.displayInitials) {
        this.initials = this.displayInitials;
      } else if (this.displayName) {
        const names = this.displayName.split(' ');

        this.initials = names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
      } else {
        this.initials = '';
      }
    }
  }

  override render(): TemplateResult {
    return this.href
      ? html`<a href=${this.href} part="wrapper">${this.renderAvatar()}</a>`
      : html`<div part="wrapper">${this.renderAvatar()}</div>`;
  }

  renderAvatar(): TemplateResult {
    return html`
      <div part="avatar">
        <slot @slotchange=${this.#onSlotChange} name="badge"></slot>
        <div part="picture" style=${styleMap({ clipPath: this.clipPath })}>
          ${this.pictureUrl
            ? html`
                <img
                  @error=${this.#onError}
                  part="image"
                  src=${this.pictureUrl}
                  alt=${ifDefined(this.imageOnly ? this.displayName : '')}
                />
              `
            : html`
                <slot name="fallback">
                  <span part="initials">${this.initials}</span>
                </slot>
              `}
        </div>
      </div>
      ${this.imageOnly
        ? nothing
        : html`
            <sl-tooltip id="avatar-tooltip">${this.displayName}</sl-tooltip>
            <span part="name">${this.displayName}</span>
            <slot></slot>
          `}
    `;
  }

  #onError(): void {
    this.pictureUrl = undefined;
  }

  #onResize(): void {
    const badgeMargin = parseInt(getComputedStyle(this).getPropertyValue('--_badge-margin') || '0'),
      {
        top: badgeTop = 0,
        right: badgeRight = 0,
        width: badgeWidth = 0,
        height: badgeHeight = 0
      } = this.badge?.getBoundingClientRect() ?? {},
      badgeRadius = badgeHeight / 2,
      {
        top: pictureTop,
        right: pictureRight,
        width: pictureSize
      } = this.renderRoot.querySelector('[part="picture"]')!.getBoundingClientRect();

    // Calculate the bounds of the cutout path for the badge
    const cutoutTop = badgeTop - pictureTop - badgeMargin,
      cutoutRight = badgeRight - pictureRight + pictureSize - badgeRadius,
      cutoutBottom = cutoutTop + badgeHeight + 2 * badgeMargin,
      cutoutLeft = cutoutRight - badgeWidth + badgeRadius * 2;

    if (badgeHeight && pictureSize) {
      // First draws a rectangle with the same size of the avatar image in clockwise direction,
      // then draws a round/pill shape with the same size of the badge + a margin around the badge,
      // in counter-clockwise direction. The change in direction creates a cutout path.
      this.clipPath = `path('M 0 0 L ${pictureSize} 0 L ${pictureSize} ${pictureSize} L 0 ${pictureSize} L 0 0 M ${cutoutLeft} ${cutoutTop} A 1 1 0 0 0 ${cutoutLeft} ${cutoutBottom} L ${cutoutRight} ${cutoutBottom} A 1 1 0 0 0 ${cutoutRight} ${cutoutTop} L ${cutoutLeft} ${cutoutTop} Z')`;
    } else {
      this.clipPath = undefined;
    }

    // Check if the name overflows and if so, enable the tooltip
    const name = this.renderRoot.querySelector<HTMLElement>('[part="name"]');
    if (name && (name?.offsetWidth < name.scrollWidth || name.offsetHeight + 4 < name.scrollHeight)) {
      name.setAttribute('aria-describedby', 'avatar-tooltip');
    } else {
      name?.removeAttribute('aria-describedby');
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.badge = event.target.assignedElements({ flatten: true }).find((el): el is Badge => el instanceof Badge);

    if (this.badge) {
      this.#observer.observe(this.badge);
    }
  }
}
