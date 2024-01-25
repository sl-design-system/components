import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type {
  AvatarBadge,
  AvatarFallbackType,
  AvatarIcon,
  AvatarImage,
  AvatarOrientation,
  AvatarSize,
  UserProfile,
  UserStatus
} from './models.js';
import type { AvatarConfig } from '@sl-design-system/shared';
import { Config } from '@sl-design-system/shared';
import { LitElement, html, nothing, svg } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './avatar.scss.js';

const BORDER_WIDTH = 4; //has to be double the desired "gap"; the stroke is centered on the path, so only half of is it outside the badge rect.
const FOCUS_RING_STROKE_WIDTH = 2;
const FOCUS_RING_STROKE_OFFSET = 2;

const IMAGE_SIZES: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 52,
  '2xl': 64,
  '3xl': 80
};

const BADGE_SIZES: Record<AvatarSize, number> = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  '2xl': 18,
  '3xl': 20
};

const ICON_SIZES: Record<AvatarSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  '2xl': 32,
  '3xl': 32
};

// offset relative to image; same principle as with css-positioning.
const OFFSET_CIRCLE: Record<AvatarSize, number> = {
  sm: -2,
  md: -4,
  lg: -4,
  xl: -2,
  '2xl': -2,
  '3xl': 2
};

const OFFSET_SQUARE: Record<AvatarSize, number> = {
  sm: -4,
  md: -6,
  lg: -7,
  xl: -8,
  '2xl': -9,
  '3xl': -10
};

/**
 * An avatar component to show a picture, initials or icon, to provide a quickly recognizable representation of a user.
 *
 * ```html
 *   <sl-avatar user="{
 *      name: {
 *        first: 'Lynn',
 *        last: 'Smith'
 *      },
 *      picture: {
 *        thumbnail: 'http://sanomalearning.design/avatars/lynn.png'
 *      }
 *    }"></sl-avatar>
 * ```
 *
 * @cssproperty --max-width: Max width of the container in ;
 */
export class Avatar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The avatar configuration settings from the current theme. */
  #config?: AvatarConfig;

  /** The badge. */
  @state() badge?: AvatarBadge;

  /** Experimental feature, use with great caution. */
  @property({ attribute: 'badge-text' }) badgeText?: string;

  /** State for when loading of the image has failed. */
  @state() errorLoadingImage?: boolean;

  /** The fallback to use when there is no user image present. */
  @property() fallback?: AvatarFallbackType = 'initials';

  /** The icon. */
  @state() icon?: AvatarIcon;

  /** The image. */
  @state() image?: AvatarImage;

  /** This hides the name when set. */
  @property({ type: Boolean, reflect: true, attribute: 'image-only' }) imageOnly?: boolean;

  /**
   * Used for the aria-label on the image. You can use `{{badgeText}}` in the string
   * to have it replaced by the value set in the badgeText
   */
  @property() label = '';

  /** The orientation of the avatar. */
  @property({ reflect: true }) orientation: AvatarOrientation = 'horizontal';

  /** The size of the avatar. */
  @property({ reflect: true }) size: AvatarSize = 'md';

  /** Optional user status to show. */
  @property({ reflect: true }) status?: UserStatus;

  /** The user object. */
  @property({ type: Object }) user?: UserProfile;

  borderWidth = BORDER_WIDTH;
  initials = '';
  offset = OFFSET_CIRCLE;
  profileName = '';

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.#config = await Config.getConfigSetting<AvatarConfig>('avatar');
    this.borderWidth = this.#config?.badgeGapWidth * 2;
    this.setAttribute('shape', this.#config.shape);

    await this.#setBaseValues();
  }

  override async willUpdate(changes: PropertyValues<this>): Promise<void> {
    super.willUpdate(changes);

    if (changes.has('badgeText') || changes.has('size')) {
      this.style.setProperty('--_picture-size', `${IMAGE_SIZES[this.size]}px`);

      await this.#setBaseValues();
    }

    if (changes.has('user')) {
      this.errorLoadingImage = false;

      if (this.user?.name) {
        this.initials = this.user.name.first.substring(0, 1) + this.user.name.last.substring(0, 1);
        this.profileName = [this.user.name.first, this.user.name.prefix, this.user.name.last].filter(Boolean).join(' ');
      } else {
        this.initials = this.profileName = '';
      }
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.image ? this.#renderPicture() : nothing}
      ${this.imageOnly
        ? nothing
        : html`
            <div>
              <span class="header">${this.profileName}</span>
              <slot class="subheader"></slot>
            </div>
          `}
    `;
  }

  #renderPicture(): TemplateResult {
    const { x, y, containerSize, radius, size } = this.image!,
      labelParts: string[] = [];

    if (this.imageOnly) {
      labelParts.push(this.profileName);
    }

    if (this.label) {
      labelParts.push(this.label.replaceAll('{{badgeText}}', this.badgeText ?? ''));
    } else if (this.badgeText) {
      labelParts.push(`(${this.badgeText})`);
    }

    return html`
      <picture>
        <svg
          aria-label=${labelParts.join(' ')}
          width=${containerSize}
          height=${containerSize}
          viewBox=" 0 0 ${containerSize} ${containerSize}"
        >
          <defs>
            <symbol id="fallback-icon" viewBox="0 0 28 33">
              <path
                fill="var(--_avatar-foreground)"
                d="M19 9c0-1.75-1-3.375-2.5-4.313-1.563-.875-3.5-.875-5 0C9.937 5.625 9 7.25 9 9c0 1.813.938 3.438 2.5 4.375 1.5.875 3.438.875 5 0C18 12.437 19 10.812 19 9ZM6 9c0-2.813 1.5-5.438 4-6.875 2.438-1.438 5.5-1.438 8 0C20.438 3.563 22 6.188 22 9c0 2.875-1.563 5.5-4 6.938-2.5 1.437-5.563 1.437-8 0A7.953 7.953 0 0 1 6 9ZM3.062 30h21.813c-.563-3.938-3.938-7-8.063-7h-5.687c-4.125 0-7.5 3.063-8.063 7ZM0 31.188C0 25 4.938 20 11.125 20h5.688C23 20 28 25 28 31.188c0 1-.875 1.812-1.875 1.812H1.812A1.814 1.814 0 0 1 0 31.187Z"
              />
            </symbol>
            <mask id="badge-cutout">
              <rect width=${containerSize} height=${containerSize} fill="white"></rect>
              ${this.badge && (this.badgeText || this.status)
                ? svg`
                    <rect
                      x=${this.badge.badgeX}
                      y=${this.badge.badgeY}
                      width=${this.badge.width}
                      height=${this.badge.height}
                      rx=${this.badge.radius}
                      fill="black"
                      stroke-width=${this.borderWidth}
                      stroke="black"
                      class="badge"
                    ></rect>
                  `
                : nothing}
            </mask>
            <mask id="circle">
              <rect
                x=${x}
                y=${y}
                width=${size}
                height=${size}
                rx=${radius}
                fill="white"
                mask="url(#badge-cutout)"
              ></rect>
            </mask>
          </defs>
          <rect
            x=${FOCUS_RING_STROKE_WIDTH / 2}
            y=${FOCUS_RING_STROKE_WIDTH / 2}
            width=${size + FOCUS_RING_STROKE_WIDTH + FOCUS_RING_STROKE_OFFSET * 2}
            height=${size + FOCUS_RING_STROKE_WIDTH + FOCUS_RING_STROKE_OFFSET * 2}
            rx=${radius + FOCUS_RING_STROKE_WIDTH / 2 + FOCUS_RING_STROKE_WIDTH}
            fill="transparent"
            stroke="var(--_focusring-color)"
            stroke-width="2"
          ></rect>
          ${this.badge && (this.badgeText || this.status)
            ? svg`
              <rect
                x=${this.badge.badgeX}
                y=${this.badge.badgeY}
                width=${this.badge.width}
                height=${this.badge.height}
                rx=${this.badge.radius}
                fill="var(--_avatar-badge-background-color)"
                aria-hidden="true"
                class="badge"
              ></rect>
              ${
                this.badgeText && this.size != 'sm'
                  ? svg`
                    <text
                      x=${this.badge.textX}
                      y=${this.badge.textY}
                      fill="var(--_avatar-badge-text-color)"
                      aria-hidden="true"
                      class="badge-text"
                    >${this.badgeText}</text>
                  `
                  : nothing
              }
              `
            : nothing}
          ${this.#renderImage()}
        </svg>
      </picture>
    `;
  }

  #renderImage(): TemplateResult | void {
    const { x, y, size } = this.image!;

    if (!this.errorLoadingImage && this.user?.picture?.thumbnail) {
      return svg`
        <image
          @error=${() => (this.errorLoadingImage = true)}
          aria-hidden="true"
          x=${x}
          y=${y}
          height=${size}
          width=${size}
          href=${this.user?.picture?.thumbnail}
          mask="url(#circle)"
          preserveAspectRatio="xMidYMid slice"
        ></image>
      `;
    } else if (this.user && this.fallback === 'initials') {
      return svg`
        <rect
          x=${x}
          y=${y}
          width=${size}
          height=${size}
          fill="var(--_avatar-background)"
          mask="url(#circle)"
        ></rect>
        <text
          x=${size / 2 + x}
          y=${size / 2 + y}
          dominant-baseline="central"
          fill="var(--_avatar-foreground)"
          class="initials"
        >${this.initials}</text>
      `;
    } else if (this.icon) {
      return svg`
        <rect
          x=${x}
          y=${y}
          width=${size}
          height=${size}
          fill="var(--_avatar-background)"
          mask="url(#circle)"
        ></rect>
        <use
          href="#fallback-icon"
          x=${this.icon.x}
          y=${this.icon.y}
          width=${this.icon.size}
          height=${this.icon.size}
        ></use>
     `;
    }
  }

  async #setBaseValues(): Promise<void> {
    const radius = parseFloat(getComputedStyle(this).getPropertyValue('--_avatar_border-radius')) ?? 0;

    this.offset = this.#config?.shape === 'square' ? OFFSET_SQUARE : OFFSET_CIRCLE; //or offset for square

    const focusRingPadding = FOCUS_RING_STROKE_WIDTH + FOCUS_RING_STROKE_OFFSET;
    const badgeOffset =
      this.offset[this.size] < 0 ? Math.max(focusRingPadding, this.offset[this.size] * -1) : focusRingPadding;

    this.style.setProperty('--_margin-top', `${badgeOffset * -1}px`);
    this.style.setProperty('--_margin-right', `${badgeOffset * -1}px`);
    this.style.setProperty('--_margin-bottom', `${badgeOffset * -1}px`);
    this.style.setProperty('--_margin-left', `${badgeOffset * -1}px`);

    this.image = {
      ...this.image,
      containerSize: IMAGE_SIZES[this.size] + focusRingPadding * 2,
      size: IMAGE_SIZES[this.size],
      radius: this.#config?.shape === 'square' ? radius : IMAGE_SIZES[this.size] / 2,
      y: badgeOffset,
      x: focusRingPadding,
      focusRingPosition: FOCUS_RING_STROKE_WIDTH / 2
    };

    this.icon = {
      size: ICON_SIZES[this.size],
      x: (IMAGE_SIZES[this.size] - ICON_SIZES[this.size]) / 2 + this.image.x,
      y: (IMAGE_SIZES[this.size] - ICON_SIZES[this.size]) / 2 + this.image.y
    };

    if (this.status || this.badgeText) {
      // base is the right edge of the badge, so we can easily detract the width of the badge to get the actual x value
      const badgeBaseX = focusRingPadding + IMAGE_SIZES[this.size] - this.offset[this.size];

      this.badge = {
        ...this.badge,
        height: BADGE_SIZES[this.size],
        width: BADGE_SIZES[this.size],
        radius: BADGE_SIZES[this.size] / 2,
        badgeY: focusRingPadding + this.offset[this.size],
        badgeX: badgeBaseX - BADGE_SIZES[this.size],
        badgeBaseX
      };
    }

    if (this.badgeText) {
      await this.updateComplete;

      const svgtxt = await this.#waitForElement('text.badge-text');
      if (svgtxt) {
        setTimeout(() => {
          // timeout because we need to wait for the render to have finished
          if (!svgtxt || !this.badge) {
            return;
          }

          const fontSize = parseFloat(window.getComputedStyle(svgtxt).fontSize) || 8;
          const textWidth = svgtxt.getBoundingClientRect().width;
          const textPadding = (this.badge.height - fontSize) / 2;
          const textPaddingVertical = (this.badge.height - svgtxt.getBoundingClientRect().height) / 2;
          const width = Math.max(textWidth + textPadding * 2, this.badge.height);

          this.badge = {
            ...this.badge,
            width,
            badgeX: this.badge.badgeBaseX - width,
            textX: focusRingPadding + IMAGE_SIZES[this.size] - width / 2 - this.offset[this.size],
            textY: fontSize + textPaddingVertical + this.badge.badgeY
          };
        }, 100);
      }
    }
  }

  async #waitForElement(selector: string): Promise<Element | null> {
    return new Promise(resolve => {
      if (this.renderRoot.querySelector(selector)) {
        return resolve(this.renderRoot.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (this.renderRoot.querySelector(selector)) {
          observer.disconnect();
          resolve(this.renderRoot.querySelector(selector));
        }
      });

      observer.observe(this.renderRoot, {
        childList: true,
        subtree: true
      });
    });
  }
}
