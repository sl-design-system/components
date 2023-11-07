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
      const cssQuery = this.renderRoot.querySelector('picture');
      const fontSize = cssQuery
        ? parseFloat(window.getComputedStyle(cssQuery).getPropertyValue('--_initials-font'))
        : 8;
      console.log(window.getComputedStyle(cssQuery).getPropertyValue('--_initials-font'));
      return svg`
      <rect
              y="0"
              x="0"
              height="${this.image.size}"
              width="${this.image.size}"
              fill="var(--_avatar-background)"
              mask="url(#badge-cutout-${this.#avatarId})"
            />
            <text class="initials" x="${this.image.size / 2}" y="${
        this.image.size - (this.image.size - fontSize) / 2
      }" dy=".3em" fill="var(--_avatar-foreground)">${this.initials}</text>`;
    } else {
      return svg`<path
        d="M8 1a3 3 0 1 0 .002 6.002A3 3 0 0 0 8 1zM6.5 8A4.491 4.491 0 0 0 2 12.5v.5c0 1.11.89 2 2 2h8c1.11 0 2-.89 2-2v-.5C14 10.008 11.992 8 9.5 8zm0 0"
      /> `;
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
          const svgtxt = this.renderRoot.querySelector('text');

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
      cssQuery && window.getComputedStyle(cssQuery).getPropertyValue('--_avatar_border-radius').indexOf('rem') > 0;

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
