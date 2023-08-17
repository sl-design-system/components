import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
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

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type AvatarFallbackType = 'initials' | 'image';
export type AvatarOrientation = 'horizontal' | 'vertical';
export type UserStatus = 'online' | 'offline' | 'away' | 'do-not-disturb';

export class Avatar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @property() user?: UserProfile;
  @property({ reflect: true }) size?: AvatarSize = 'md';
  @property() fallback?: AvatarFallbackType = 'initials';
  @property({ reflect: true }) orientation?: AvatarOrientation = 'horizontal';
  @property({ reflect: true }) status?: UserStatus;
  @property({ type: Boolean, reflect: true, attribute: 'image-only' }) imageOnly?: boolean;

  get profileName(): string {
    return `${this.user?.name.first || 'John'} ${this.user?.name.last || 'Doe'}`;
  }

  get initials(): string {
    return this.user ? this.user.name.first.substring(0, 1) + this.user.name.last.substring(0, 1) : '';
  }

  get image(): TemplateResult {
    if (this.user?.picture) {
      return html`<img
        alt="picture of ${this.profileName}"
        .src=${this.user?.picture?.thumbnail || 'https://ynnovate.it/wp-content/uploads/2015/06/default-avatar.png'}
      />`;
    } else if (this.user && this.fallback === 'initials') {
      return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <text x="8" y="8" dy=".3em">${this.initials}</text>
      </svg>`;
    } else {
      return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          d="M8 1a3 3 0 1 0 .002 6.002A3 3 0 0 0 8 1zM6.5 8A4.491 4.491 0 0 0 2 12.5v.5c0 1.11.89 2 2 2h8c1.11 0 2-.89 2-2v-.5C14 10.008 11.992 8 9.5 8zm0 0"
        />
      </svg>`;
    }
  }

  get statusBadge(): TemplateResult | typeof nothing {
    if (this.status) {
      return html`<div class="status-badge"></div>`;
    }
    return nothing;
  }

  override render(): TemplateResult {
    return html`
      <picture> ${this.image} ${this.statusBadge} </picture>
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
  }
}
