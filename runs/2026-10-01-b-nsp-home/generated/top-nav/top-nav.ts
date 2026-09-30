import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Icon } from '@sl-design-system/icon';
import { SearchField, type SlSearchEvent } from '@sl-design-system/search-field';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './top-nav.css' with { type: 'css' };


declare global {
  interface HTMLElementTagNameMap {
    'sl-nsp-top-nav': TopNav;
  }

  interface GlobalEventHandlersEventMap {
    'sl-nsp-nav-navigate': SlNspNavNavigateEvent;
    'sl-nsp-nav-search': SlNspNavSearchEvent;
    'sl-nsp-profile-toggle': SlNspProfileToggleEvent;
  }
}

/** The stable id of one of the four top-nav links. */
export type NavLinkId = 'home' | 'calendar' | 'method-catalogue' | 'teaching-materials';

/** The signed-in user shown in the profile control. */
export interface NavUser {
  name: string;
  avatarUrl?: string;
}

/** The data this component renders; owned and passed in by the page. */
export interface TopNavModel {
  user: NavUser;
  activeLinkId: NavLinkId;
  searchTerm?: string;
}

/** The detail of the `sl-nsp-nav-navigate` event. */
export interface NavNavigateDetail {
  id: NavLinkId;
  href: string;
}

export type SlNspNavNavigateEvent = CustomEvent<NavNavigateDetail>;
export type SlNspNavSearchEvent = CustomEvent<string>;
export type SlNspProfileToggleEvent = CustomEvent<void>;

/** Structural config: the fixed nav-link set, in design order. Not part of the data model. */
interface NavLinkConfig {
  id: NavLinkId;
  label: string;
  href: string;
}

/**
 * Structural/presentation config owned by this component (not model input) — the design's four
 * nav links never vary per user, so they're a local constant rather than a `TopNavModel` field.
 * Hrefs aren't specified by the design; these are placeholder in-app routes — flagged in the
 * implementation report.
 */
const NAV_LINKS: NavLinkConfig[] = [
  { id: 'home', label: 'Home', href: '/home' },
  { id: 'calendar', label: 'Calendar', href: '/calendar' },
  { id: 'method-catalogue', label: 'Method catalogue', href: '/method-catalogue' },
  { id: 'teaching-materials', label: 'Teaching materials', href: '/teaching-materials' }
];

/** Default model so the story renders fully with no args. */
const DEFAULT_MODEL: TopNavModel = {
  user: { name: 'Lynn Smith' },
  activeLinkId: 'home',
  searchTerm: ''
};

/**
 * The top navigation bar of the NSP `home` dashboard: brand mark, primary nav links, search,
 * and the profile control. Presentational — the page passes in its `model` and handles the
 * emitted navigate/search/profile-toggle events.
 *
 * ```html
 * <sl-nsp-top-nav .model=${{ user: { name: 'Lynn Smith' }, activeLinkId: 'home' }}></sl-nsp-top-nav>
 * ```
 *
 * @fires sl-nsp-nav-navigate - Emitted when a nav link is clicked; cancelable so a host router
 *   can call `preventDefault()` on it to stop the anchor's default navigation.
 * @fires sl-nsp-nav-search - Emitted with the current search term as the user searches.
 * @fires sl-nsp-profile-toggle - Emitted when the profile control is activated.
 */
export class TopNav extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-icon': Icon,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a nav link is clicked. */
  @event({ name: 'sl-nsp-nav-navigate' }) navigateEvent!: EventEmitter<SlNspNavNavigateEvent>;

  /** @internal Emits with the current search term as the user searches. */
  @event({ name: 'sl-nsp-nav-search' }) searchEvent!: EventEmitter<SlNspNavSearchEvent>;

  /** @internal Emits when the profile control is activated. */
  @event({ name: 'sl-nsp-profile-toggle' }) profileToggleEvent!: EventEmitter<SlNspProfileToggleEvent>;

  /**
   * The user, active link and search term this nav bar renders. Defaults to a representative
   * demo user/state so the story renders fully with no args.
   */
  @property({ attribute: false }) model?: TopNavModel;

  override render(): TemplateResult {
    const model = this.model ?? DEFAULT_MODEL;

    return html`
      <nav aria-label="Main">
        <div class="start">
          <span class="logo" aria-hidden="true">S</span>
          <ul class="links">
            ${NAV_LINKS.map(link => {
              const active = link.id === model.activeLinkId;

              return html`
                <li>
                  <a
                    href=${link.href}
                    aria-current=${ifDefined(active ? 'page' : undefined)}
                    @click=${(e: MouseEvent) => this.#onLinkClick(e, link)}
                  >
                    ${link.label}
                  </a>
                </li>
              `;
            })}
          </ul>
        </div>
        <div class="end">
          <sl-search-field
            aria-label="Search"
            placeholder="Search"
            .value=${model.searchTerm ?? ''}
            @sl-search=${this.#onSearch}
          ></sl-search-field>
          <button
            class="profile"
            type="button"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label=${`Account menu for ${model.user.name}`}
            @click=${this.#onProfileClick}
          >
            <sl-avatar
              size="sm"
              image-only
              display-name=${model.user.name}
              picture-url=${ifDefined(model.user.avatarUrl)}
            ></sl-avatar>
            <sl-icon name="chevron-down" aria-hidden="true"></sl-icon>
          </button>
        </div>
      </nav>
    `;
  }

  /**
   * Emits `sl-nsp-nav-navigate` as a cancelable event; if a host listener calls
   * `preventDefault()` on it, the anchor's own default navigation is stopped too, so a host
   * router can take over.
   */
  #onLinkClick(e: MouseEvent, link: NavLinkConfig): void {
    const notCancelled = this.navigateEvent.emit(
      { id: link.id, href: link.href },
      { cancelable: true }
    );

    if (!notCancelled) {
      e.preventDefault();
    }
  }

  #onSearch(e: SlSearchEvent): void {
    this.searchEvent.emit(e.detail);
  }

  #onProfileClick(): void {
    this.profileToggleEvent.emit();
  }
}

if (!customElements.get('sl-nsp-top-nav')) {
  customElements.define('sl-nsp-top-nav', TopNav);
}
