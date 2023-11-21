import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { AvatarConfig } from '@sl-design-system/shared';
import { Config } from '@sl-design-system/shared';
import { LitElement, html, nothing, svg } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './avatar.scss.js';

export interface UserProfile {
  name: UserProfileName;
  picture?: UserProfilePicture;
}
export interface UserProfileName {
  first: string;
  last: string;
  prefix?: string;
}
export interface UserProfilePicture {
  thumbnail: string;
}

export interface AvatarImage {
  containerSize: number;
  size: number;
  radius: number;
  y: number;
  x: number;
  focusRingPosition: number;
}

export interface AvatarBadge {
  height: number;
  width: number;
  radius: number;
  badgeY: number;
  badgeX: number;
  badgeBaseX: number;
  textY?: number;
  textX?: number;
}

export interface AvatarIcon {
  size: number;
  y?: number;
  x?: number;
}

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type AvatarFallbackType = 'initials' | 'image';
export type AvatarOrientation = 'horizontal' | 'vertical';
export type UserStatus = 'online' | 'offline' | 'away' | 'do-not-disturb';

let nextUniqueId = 0;

/**
 * An avatar component to show a picture, initials or icon, to provide a quickly recognisable representation of a user.
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

  @property({ type: Object }) user?: UserProfile;
  @property({ reflect: true }) size: AvatarSize = 'md';
  @property() fallback?: AvatarFallbackType = 'initials';
  @property({ reflect: true }) orientation: AvatarOrientation = 'horizontal';
  @property({ type: Boolean, reflect: true, attribute: 'image-only' }) imageOnly?: boolean;
  @property({ reflect: true }) status?: UserStatus;
  /** used for Aria-label; you can use `{{badgeText}}` in the string to have it replaced by the value set in the badgeText */
  @property({ reflect: true }) label: string = '';
  /**
   * Experimental feature, use with great caution.
   */
  @property({ reflect: true, attribute: 'badge-text' }) badgeText?: string;

  #avatarId = nextUniqueId++;
  private avatarConfig?: AvatarConfig;

  private imageSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 52,
    '2xl': 64,
    '3xl': 80
  };

  private focusRingStrokeWidth = 2;
  private focusRingStrokeOffset = 2;

  private badgeSizes = {
    sm: 8,
    md: 12,
    lg: 14,
    xl: 16,
    '2xl': 18,
    '3xl': 20
  };

  private iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    '2xl': 32,
    '3xl': 32
  };

  // offset relative to image; same principle as with css-positioning.
  private offsetCircle = {
    sm: -2,
    md: -4,
    lg: -4,
    xl: -2,
    '2xl': -2,
    '3xl': 2
  };

  private offsetSquare = {
    sm: -4,
    md: -6,
    lg: -7,
    xl: -8,
    '2xl': -9,
    '3xl': -10
  };

  private borderWidth = 4; //has to be double the desired "gap"; the stroke is centered on the path, so only half of is it outside the badge rect.

  @state() image?: AvatarImage;
  @state() badge?: AvatarBadge;
  @state() icon?: AvatarIcon;

  private offset = this.offsetCircle;

  get profileName(): string {
    return this.user?.name
      ? `${this.user.name.first} ${this.user.name.prefix ? this.user.name.prefix + ' ' : ''}${this.user.name.last}`
      : '';
  }

  get ariaLabelText(): string {
    const labelParts: string[] = [];
    if (this.imageOnly) {
      labelParts.push(this.profileName);
    }
    if (this.label) {
      labelParts.push(this.label.replaceAll('{{badgeText}}', this.badgeText || ''));
    } else if (this.badgeText) {
      labelParts.push(`(${this.badgeText})`);
    }
    return labelParts.join(' ');
  }

  get initials(): string {
    return this.user ? this.user.name.first.substring(0, 1) + this.user.name.last.substring(0, 1) : '';
  }

  get imageContent(): TemplateResult {
    if (!this.image) return svg``;

    if (this.user?.picture?.thumbnail) {
      return svg`<image
        aria-hidden="true"
        height="${this.image.size}"
        width="${this.image.size}"
        x="${this.image.x}"
        y="${this.image.y}" 
        mask="url(#circle-${this.#avatarId})"
        preserveAspectRatio="xMidYMid slice" 
        href=${this.user?.picture?.thumbnail}
      ></image>`;
    } else if (this.user && this.fallback === 'initials') {
      return svg`
      <rect
              y="${this.image.y}"
              x="${this.image.x}"
              height="${this.image.size}"
              width="${this.image.size}"
              fill="var(--_avatar-background)"
              mask="url(#circle-${this.#avatarId})"
            />
            <text class="initials"
               dominant-baseline="central" 
               x="${this.image.size / 2 + this.image.x}" 
               y="${this.image.size / 2 + this.image.y}" 
               fill="var(--_avatar-foreground)">${this.initials}</text></g>`;
    } else if (this.icon) {
      return svg`
      <rect
        y="${this.image.y}"
        x="${this.image.x}"
        height="${this.image.size}"
        width="${this.image.size}"
        fill="var(--_avatar-background)"
        mask="url(#circle-${this.#avatarId})"
      />
      <use href="#fallback-icon-${this.#avatarId}" x="${this.icon.x}" y="${this.icon.y}" height="${
        this.icon.size
      }" width="${this.icon.size}"/>
     `;
    } else {
      return svg``;
    }
  }

  get badgeContent(): TemplateResult {
    if (!this.badge || !(this.badgeText || this.status)) {
      return svg``;
    }
    return svg`<rect
          class="badge"
          y="${this.badge.badgeY}"
          x="${this.badge.badgeX}"
          height="${this.badge.height}"
          width="${this.badge.width}"
          rx="${this.badge.radius}"
          fill="var(--_avatar_badge-background-color)"
          aria-hidden="true"
        />
        ${
          this.badgeText && this.size != 'sm'
            ? svg`<text aria-hidden="true" class="badge-text" y="${this.badge.textY}" x="${this.badge.textX}" fill="var(--_avatar_badge-text-color)">${this.badgeText}</text>`
            : nothing
        }`;
  }

  get badgeCutout(): TemplateResult {
    if (!this.badge || !(this.badgeText || this.status)) {
      return svg``;
    }
    return svg`<rect
              class="badge"
              y="${this.badge.badgeY}"
              x="${this.badge.badgeX}"
              height="${this.badge.height}"
              width="${this.badge.width}"
              rx="${this.badge.radius}"
              fill="black"
              stroke-width="${this.borderWidth}"
              stroke="black"
            />`;
  }

  get imageSVG(): TemplateResult {
    if (!this.image) {
      return html``;
    }
    return html`
      <svg
        viewBox=" 0 0 ${this.image.containerSize} ${this.image.containerSize}"
        width="${this.image.containerSize}"
        height="${this.image.containerSize}"
        aria-label="${this.ariaLabelText}"
      >
        <defs>
          <symbol id="fallback-icon-${this.#avatarId}" viewBox="0 0 28 33">
            <path
              fill="var(--_avatar-foreground)"
              d="M19 9c0-1.75-1-3.375-2.5-4.313-1.563-.875-3.5-.875-5 0C9.937 5.625 9 7.25 9 9c0 1.813.938 3.438 2.5 4.375 1.5.875 3.438.875 5 0C18 12.437 19 10.812 19 9ZM6 9c0-2.813 1.5-5.438 4-6.875 2.438-1.438 5.5-1.438 8 0C20.438 3.563 22 6.188 22 9c0 2.875-1.563 5.5-4 6.938-2.5 1.437-5.563 1.437-8 0A7.953 7.953 0 0 1 6 9ZM3.062 30h21.813c-.563-3.938-3.938-7-8.063-7h-5.687c-4.125 0-7.5 3.063-8.063 7ZM0 31.188C0 25 4.938 20 11.125 20h5.688C23 20 28 25 28 31.188c0 1-.875 1.812-1.875 1.812H1.812A1.814 1.814 0 0 1 0 31.187Z"
            />
          </symbol>
          <mask id="badge-cutout-${this.#avatarId}">
            <rect width="${this.image.containerSize}" height="${this.image.containerSize}" fill="white" />
            ${this.badgeCutout}
          </mask>
          <mask id="circle-${this.#avatarId}">
            <rect
              y="${this.image.y}"
              x="${this.image.x}"
              height="${this.image.size}"
              width="${this.image.size}"
              rx="${this.image.radius}"
              fill="white"
              mask="url(#badge-cutout-${this.#avatarId})"
            />
          </mask>
        </defs>
        <rect
          y="${this.focusRingStrokeWidth / 2}"
          x="${this.focusRingStrokeWidth / 2}"
          height="${this.image.size + this.focusRingStrokeWidth + this.focusRingStrokeOffset * 2}"
          width="${this.image.size + this.focusRingStrokeWidth + this.focusRingStrokeOffset * 2}"
          rx="${this.image.radius + this.focusRingStrokeWidth / 2 + this.focusRingStrokeWidth}"
          fill="transparent"
          stroke-width="2"
          stroke="var(--_focusring-color)"
        />
        ${this.badgeContent} ${this.imageContent}
      </svg>
    `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    await Config.getConfigSetting<AvatarConfig>('avatar').then(async config => {
      this.avatarConfig = config;
      this.borderWidth = this.avatarConfig?.badgeGapWidth * 2;
      this.setAttribute('shape', this.avatarConfig.shape);
      await this.#setBaseValues();
    });
  }

  override render(): TemplateResult {
    return html`
      <picture> ${this.imageSVG} </picture>
      ${!this.imageOnly
        ? html`<div>
            <span class="header">${this.profileName}</span>
            <slot class="subheader"></slot>
          </div>`
        : nothing}
    `;
  }

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('orientation')) {
      /** it appears that converting the scss files removes this style property in the css, so i'm adding it here in a hacky way. */
      const textContainer = this.renderRoot.querySelector('span');
      if (textContainer) {
        if (this.orientation === 'vertical') {
          textContainer.style.display = '-webkit-box';
        } else {
          textContainer.style.display = 'flex';
        }
      }
    }

    if (changes.has('size') || changes.has('badgeText')) {
      this.style.setProperty('--_picture-size', `${this.imageSizes[this.size]}px`);
      await this.#setBaseValues();
    }
  }

  async #setBaseValues(): Promise<void> {
    const cssQuery = await this.#waitForElement('picture');

    const radius: number = cssQuery
      ? parseFloat(window.getComputedStyle(cssQuery).getPropertyValue('--_avatar_border-radius'))
      : 0;

    this.offset = this.avatarConfig?.shape === 'circle' ? this.offsetCircle : this.offsetSquare; //or offset for square
    const focusRingPadding = this.focusRingStrokeWidth + this.focusRingStrokeOffset;
    const badgeOffset =
      this.offset[this.size] < 0 ? Math.max(focusRingPadding, this.offset[this.size] * -1) : focusRingPadding;
    const calculatedOffset = this.offset[this.size] < 0 ? 0 : this.offset[this.size];

    this.style.setProperty('--_margin-top', `${badgeOffset * -1}px`);
    this.style.setProperty('--_margin-right', `${badgeOffset * -1}px`);
    this.style.setProperty('--_margin-bottom', `${badgeOffset * -1}px`);
    this.style.setProperty('--_margin-left', `${badgeOffset * -1}px`);

    this.image = {
      ...this.image,
      containerSize: this.imageSizes[this.size] + focusRingPadding * 2,
      size: this.imageSizes[this.size],
      radius: this.avatarConfig?.shape === 'circle' ? this.imageSizes[this.size] / 2 : radius,
      y: badgeOffset,
      x: focusRingPadding,
      focusRingPosition: this.focusRingStrokeWidth / 2
    };

    this.icon = {
      size: this.iconSizes[this.size],
      x: (this.imageSizes[this.size] - this.iconSizes[this.size]) / 2 + this.image.x,
      y: (this.imageSizes[this.size] - this.iconSizes[this.size]) / 2 + this.image.y
    };

    console.log({ offset: this.offset[this.size], calculatedOffset, focusRingPadding });
    if (this.status || this.badgeText) {
      const badgeBaseX = this.imageSizes[this.size] - this.offset[this.size];
      this.badge = {
        ...this.badge,
        height: this.badgeSizes[this.size],
        width: this.badgeSizes[this.size],
        radius: this.badgeSizes[this.size] / 2,
        badgeY: focusRingPadding + this.offset[this.size],
        badgeX: badgeBaseX - this.badgeSizes[this.size],
        badgeBaseX
      };
    }

    if (this.badgeText) {
      await this.updateComplete;

      const svgtxt = await this.#waitForElement('text.badge-text');
      if (svgtxt) {
        setTimeout(() => {
          // timeout because we need to wait for the render to have finished
          if (!svgtxt || !this.badge) return;
          const fontSize = parseFloat(window.getComputedStyle(svgtxt).fontSize) || 8;

          const textWidth = svgtxt.getBoundingClientRect().width;
          const textPadding = (this.badge.height - fontSize) / 2;
          const textPaddingVertical = (this.badge.height - svgtxt.getBoundingClientRect().height) / 2;
          const width = Math.max(textWidth + textPadding * 2, this.badge.height);

          this.badge = {
            ...this.badge,
            width,
            badgeX: this.badge.badgeBaseX - width,
            textX: this.imageSizes[this.size] - width / 2 - this.offset[this.size],
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
