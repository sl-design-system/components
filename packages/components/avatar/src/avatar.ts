import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type AvatarConfig, Config } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing, svg } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './avatar.scss.js';
import {
  type AvatarBadge,
  type AvatarFallbackType,
  type AvatarIcon,
  type AvatarImage,
  type AvatarSize,
  type UserStatus
} from './models.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-avatar': Avatar;
  }
}

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
 *   <sl-avatar display-name="Lynn Smith" picture="http://sanomalearning.design/avatars/lynn.png"></sl-avatar>
 * ```
 *
 * @csspart name - The display name, either a <span> or <a> if `href` is set.
 * @cssprop --sl-avatar-max-inline-size - Max inline-size of the container in vertical mode. If not set it will behave like a regular `display: block` element.
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

  /** Border width for calculations in the svg. */
  #borderWidth = BORDER_WIDTH;

  /** The avatar configuration settings from the current theme. */
  #config?: AvatarConfig;

  /** Whether the display name is wider than the available width. */
  #hasOverflow = false;

  /** Observe the avatar width. */
  #observer = new ResizeObserver(() => this.#checkOverflow());

  /** Offset of the badge for calculations in the svg. */
  #offset = OFFSET_CIRCLE;

  /** @internal The badge. */
  @state() badge?: AvatarBadge;

  /**
   * Text to show on the badge in the top right corner of the avatar.
   * Be aware this text should not be more then a few characters.
   * Typically this option is used to show a number, for example unread messages.
   */
  @property({ attribute: 'badge-text' }) badgeText?: string;

  /** The initials that need to be displayed. If none are set they are determined based on the displayName .*/
  @property({ attribute: 'display-initials' }) displayInitials?: string;

  /** The name that needs to be displayed. */
  @property({ attribute: 'display-name' }) displayName?: string;

  /** @internal State for when loading of the image has failed. */
  @state() errorLoadingImage?: boolean;

  /**
   * The fallback to use when there is no user image present.
   * @type {'initials' | 'image'}
   */
  @property() fallback?: AvatarFallbackType = 'initials';

  /** An optional URL that will be used for linking the display name. */
  @property({ reflect: true }) href?: string;

  /** @internal The icon. */
  @state() icon?: AvatarIcon;

  /** @internal The image. */
  @state() image?: AvatarImage;

  /** This hides the name when set to true. */
  @property({ type: Boolean, reflect: true, attribute: 'image-only' }) imageOnly?: boolean;

  /**
   * Used for the aria-label on the image. You can use `{{badgeText}}` in the string
   * to have it replaced by the value set in the badgeText. For example to show "6 unread messages", where 6 is also shown in the badge.
   */
  @property() label = '';

  /** The url of the avatar image. */
  @property({ attribute: 'picture-url' }) pictureUrl?: string;

  /**
   * The size of the avatar.
   * @type {'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'}
   */
  @property({ reflect: true }) size: AvatarSize = 'md';

  /**
   * Optional user status to show.
   * @type {'danger' | 'success' | 'warning' | 'accent' | 'neutral' | 'primary'}
   */
  @property({ reflect: true }) status?: UserStatus;

  /** If true, will display the name below the image. */
  @property({ type: Boolean, reflect: true }) vertical?: boolean;

  /** @internals initials to render in the fallback avatar. */
  get initials(): string {
    if (this.displayInitials) {
      return this.displayInitials;
    } else if (this.displayName) {
      const names = this.displayName.split(' ');

      return names[0].substring(0, 1) + names[names.length - 1].substring(0, 1);
    }

    return '';
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.#config = await Config.getConfigSetting<AvatarConfig>('avatar');
    this.#borderWidth = this.#config?.badgeGapWidth * 2;
    this.setAttribute('shape', this.#config.shape);

    this.#observer.observe(this);

    await this.#setBaseValues();
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override async willUpdate(changes: PropertyValues<this>): Promise<void> {
    super.willUpdate(changes);

    if (changes.has('badgeText') || changes.has('size')) {
      this.style.setProperty('--_picture-size', `${IMAGE_SIZES[this.size]}px`);

      await this.#setBaseValues();
    }

    if (changes.has('displayName')) {
      this.#checkOverflow();
    }

    if (changes.has('pictureUrl')) {
      await this.#setBaseValues();
      this.errorLoadingImage = false;
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.image ? this.#renderPicture() : nothing}
      <sl-tooltip id="avatar-tooltip">${this.displayName}</sl-tooltip>
      ${this.imageOnly
        ? nothing
        : html`
            <div>
              ${this.href
                ? html`<a part="name" href=${this.href}>${this.displayName}</a>`
                : html`<span part="name">${this.displayName}</span>`}
              ${this.size === 'sm' && !this.vertical ? nothing : html`<slot class="subheader"></slot>`}
            </div>
          `}
    `;
  }

  #renderPicture(): TemplateResult {
    const { x, y, containerSize, radius, size } = this.image!,
      labelParts: string[] = [];

    if (this.imageOnly && this.displayName) {
      labelParts.push(this.displayName);
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
                fill="var(--_foreground)"
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
                      stroke-width=${this.#borderWidth}
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
                fill="var(--_badge-background)"
                aria-hidden="true"
                class="badge"
              ></rect>
              ${
                this.badgeText && this.size != 'sm'
                  ? svg`
                    <text
                      x=${this.badge.textX}
                      y=${this.badge.textY}
                      fill="var(--_badge-color)"
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

    if (!this.errorLoadingImage && this.pictureUrl) {
      return svg`
        <image
          @error=${() => (this.errorLoadingImage = true)}
          aria-hidden="true"
          x=${x}
          y=${y}
          height=${size}
          width=${size}
          href=${this.pictureUrl}
          mask="url(#circle)"
          preserveAspectRatio="xMidYMid slice"
        ></image>
      `;
    } else if (this.initials && this.fallback !== 'image') {
      return svg`
        <rect
          x=${x}
          y=${y}
          width=${size}
          height=${size}
          fill="var(--_background)"
          mask="url(#circle)"
        ></rect>
        <text
          x=${size / 2 + x}
          y=${size / 2 + y}
          dominant-baseline="central"
          fill="var(--_foreground)"
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
          fill="var(--_background)"
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
    const radius = parseFloat(getComputedStyle(this).getPropertyValue('--_border-radius')) ?? 0;

    this.#offset = this.#config?.shape === 'square' ? OFFSET_SQUARE : OFFSET_CIRCLE; //or offset for square

    const focusRingPadding = FOCUS_RING_STROKE_WIDTH + FOCUS_RING_STROKE_OFFSET;
    const badgeOffset =
      this.#offset[this.size] < 0 ? Math.max(focusRingPadding, this.#offset[this.size] * -1) : focusRingPadding;

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
      const badgeBaseX = focusRingPadding + IMAGE_SIZES[this.size] - this.#offset[this.size];

      this.badge = {
        ...this.badge,
        height: BADGE_SIZES[this.size],
        width: BADGE_SIZES[this.size],
        radius: BADGE_SIZES[this.size] / 2,
        badgeY: focusRingPadding + this.#offset[this.size],
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
            textX: focusRingPadding + IMAGE_SIZES[this.size] - width / 2 - this.#offset[this.size],
            textY: fontSize + textPaddingVertical + this.badge.badgeY
          };
        }, 100);
      }
    }
  }

  #checkOverflow(): void {
    if (this.imageOnly) {
      return;
    }

    const element = this.renderRoot.querySelector<HTMLElement>('[part="name"]')!;

    this.#hasOverflow = element.offsetWidth < element.scrollWidth || element.offsetHeight + 4 < element.scrollHeight;
    if (this.#hasOverflow) {
      element.setAttribute('aria-describedby', 'avatar-tooltip');
    } else {
      element.removeAttribute('aria-describedby');
    }
  }

  async #waitForElement(selector: string): Promise<Element | null> {
    return await new Promise(resolve => {
      if (this.renderRoot.querySelector(selector)) {
        resolve(this.renderRoot.querySelector(selector));
        return;
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
