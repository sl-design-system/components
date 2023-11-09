import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
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
  title: string;
}
export interface UserProfilePicture {
  thumbnail: string;
}

export interface AvatarImage {
  containerSize: number;
  size: number;
  radius: number;
  y: number;
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

export class Avatar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @property() user?: UserProfile;
  @property({ reflect: true }) size: AvatarSize = 'md';
  @property({ reflect: true, attribute: 'badge-text' }) badgeText?: string;
  @property() fallback?: AvatarFallbackType = 'initials';
  @property({ reflect: true }) orientation: AvatarOrientation = 'horizontal';
  @property({ reflect: true }) status?: UserStatus;
  @property({ type: Boolean, reflect: true, attribute: 'image-only' }) imageOnly?: boolean;

  #avatarId = nextUniqueId++;

  private imageSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 52,
    '2xl': 64,
    '3xl': 80
  };

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
    return `${this.user?.name?.first || 'John'} ${this.user?.name?.last || 'Doe'}`;
  }

  get initials(): string {
    return this.user ? this.user.name.first.substring(0, 1) + this.user.name.last.substring(0, 1) : '';
  }

  get imageContent(): TemplateResult {
    if (!this.image) return svg``;

    if (this.user?.picture) {
      return svg`<image
        alt="picture of ${this.profileName}"
        height="${this.image.size}"
        width="${this.image.size}"
        x="0"
        y="${this.image.y}" 
        mask="url(#circle-${this.#avatarId})"
        href=${this.user?.picture?.thumbnail || 'https://ynnovate.it/wp-content/uploads/2015/06/default-avatar.png'}
      ></image>`;
    } else if (this.user && this.fallback === 'initials') {
      return svg`
      <rect
              y="${this.image.y}"
              x="0"
              height="${this.image.size}"
              width="${this.image.size}"
              fill="var(--_avatar-background)"
              mask="url(#circle-${this.#avatarId})"
            />
            <text class="initials"
               dominant-baseline="central" 
               x="${this.image.size / 2}" 
               y="${this.image.size / 2 + this.image.y}" 
               fill="var(--_avatar-foreground)">${this.initials}</text></g>`;
    } else if (this.icon) {
      return svg`
      <rect
        y="${this.image.y}"
        x="0"
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
        />
        ${
          this.badgeText && this.size != 'sm'
            ? svg`<text class="badge-text" y="${this.badge.textY}" x="${this.badge.textX}" fill="var(--_avatar_badge-text-color)">${this.badgeText}</text>`
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
              x="0"
              height="${this.image.size}"
              width="${this.image.size}"
              rx="${this.image.radius}"
              fill="white"
              mask="url(#badge-cutout-${this.#avatarId})"
            />
          </mask>
        </defs>
        ${this.badgeContent} ${this.imageContent}
      </svg>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#setBaseValues();
  }

  override render(): TemplateResult {
    return html`
      <picture> ${this.imageSVG} </picture>
      ${!this.imageOnly
        ? html`<div>
            <span>${this.profileName}</span>
            <slot></slot>
          </div>`
        : nothing}
    `;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('orientation')) {
      /** it appears that converting the scss files removes this style property in the css, so i'm adding it here in a hacky way. */
      const textContainer = this.renderRoot.querySelector('div');
      if (textContainer) {
        if (this.orientation === 'vertical') {
          textContainer.style.display = '-webkit-box';
        } else {
          textContainer.style.display = 'flex';
        }
      }
    }
    if (changes.has('size')) {
      this.#setBaseValues();
    }

    if (changes.has('badgeText')) {
      setTimeout(() => {
        if (this.badge) {
          const svgtxt = this.renderRoot.querySelector('text.badge-text');

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
        }
      }, 200);
    }
  }

  #setBaseValues(): void {
    const cssQuery = this.renderRoot.querySelector('picture');

    const percentageRadius =
      cssQuery && window.getComputedStyle(cssQuery).getPropertyValue('--_avatar_border-radius').indexOf('%') > 0;

    const radius: number = cssQuery
      ? parseFloat(window.getComputedStyle(cssQuery).getPropertyValue('--_avatar_border-radius'))
      : 0;
    this.offset = percentageRadius || radius > 8 ? this.offsetCircle : this.offsetSquare; //or offset for square
    const badgeOffset = this.offset[this.size] < 0 ? this.offset[this.size] * -1 : 0;
    const calculatedOffset = this.offset[this.size] < 0 ? 0 : this.offset[this.size];

    this.image = {
      ...this.image,
      containerSize: this.imageSizes[this.size] + badgeOffset,
      size: this.imageSizes[this.size],
      radius: percentageRadius ? this.imageSizes[this.size] * (radius / 100) : radius,
      y: badgeOffset
    };

    this.icon = {
      size: this.iconSizes[this.size],
      x: (this.imageSizes[this.size] - this.iconSizes[this.size]) / 2,
      y: (this.imageSizes[this.size] - this.iconSizes[this.size]) / 2 + this.image.y
    };

    const badgeBaseX = this.imageSizes[this.size] - this.offset[this.size];
    this.badge = {
      ...this.badge,
      height: this.badgeSizes[this.size],
      width: this.badgeSizes[this.size],
      radius: this.badgeSizes[this.size] / 2,
      badgeY: calculatedOffset,
      badgeX: badgeBaseX - this.badgeSizes[this.size],
      badgeBaseX
    };
  }
}
