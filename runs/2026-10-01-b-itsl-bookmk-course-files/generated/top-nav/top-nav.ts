import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { SearchField, type SlSearchEvent } from '@sl-design-system/search-field';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import styles from './top-nav.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-itsl-files-top-nav': TopNav;
  }

  interface GlobalEventHandlersEventMap {
    'sl-itsl-files-nav-navigate': SlItslFilesNavNavigateEvent;
    'sl-itsl-files-nav-search': SlItslFilesNavSearchEvent;
    'sl-itsl-files-profile-toggle': SlItslFilesProfileToggleEvent;
  }
}

/** The stable id of one of the five main-menu links. */
export type TopNavLinkId = 'courses' | 'updates' | 'groups' | 'calendar' | 'library';

/** The signed-in user shown in the profile control. */
export interface TopNavUser {
  name: string;
  avatarUrl?: string;
}

/** The data this component renders; owned and passed in by the page. */
export interface TopNavModel {
  user: TopNavUser;
  activeLinkId: TopNavLinkId;
  searchTerm?: string;
}

/** The detail of the `sl-itsl-files-nav-navigate` event. */
export interface NavNavigateDetail {
  id: TopNavLinkId;
  href: string;
}

export type SlItslFilesNavNavigateEvent = CustomEvent<NavNavigateDetail>;
export type SlItslFilesNavSearchEvent = CustomEvent<string>;
export type SlItslFilesProfileToggleEvent = CustomEvent<void>;

/** Structural config: one main-menu link. Not part of the data model. */
interface NavLinkConfig {
  id: TopNavLinkId;
  label: string;
  href: string;
}

/**
 * Structural/presentation config owned by this component (not a `TopNavModel` field) — the
 * design's five main-menu links never vary per user, so they're a local constant. Hrefs aren't
 * specified by the design; these are placeholder in-app routes — flagged in the implementation
 * report.
 */
const NAV_LINKS: NavLinkConfig[] = [
  { id: 'courses', label: 'Courses', href: '/courses' },
  { id: 'updates', label: 'Updates', href: '/updates' },
  { id: 'groups', label: 'Groups', href: '/groups' },
  { id: 'calendar', label: 'Calendar', href: '/calendar' },
  { id: 'library', label: 'Library', href: '/library' }
];

/** Default model so the story renders fully with no args. */
const DEFAULT_MODEL: TopNavModel = {
  user: { name: 'Jane Doe' },
  activeLinkId: 'courses',
  searchTerm: ''
};

/**
 * The itslearning main-menu bar: brand mark, the five primary nav links, search, notification
 * controls, and the profile control. Presentational — the page passes in its `model` and
 * handles the emitted navigate/search/profile-toggle events.
 *
 * ```html
 * <sl-itsl-files-top-nav
 *   .model=${{ user: { name: 'Jane Doe' }, activeLinkId: 'courses' }}
 * ></sl-itsl-files-top-nav>
 * ```
 *
 * @fires sl-itsl-files-nav-navigate - Emitted when a nav link is clicked; cancelable so a host
 *   router can call `preventDefault()` on it to stop the anchor's default navigation.
 * @fires sl-itsl-files-nav-search - Emitted with the current search term as the user searches.
 * @fires sl-itsl-files-profile-toggle - Emitted when the profile control is activated.
 */
export class TopNav extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a nav link is clicked. */
  @event({ name: 'sl-itsl-files-nav-navigate' })
  navigateEvent!: EventEmitter<SlItslFilesNavNavigateEvent>;

  /** @internal Emits with the current search term as the user searches. */
  @event({ name: 'sl-itsl-files-nav-search' })
  searchEvent!: EventEmitter<SlItslFilesNavSearchEvent>;

  /** @internal Emits when the profile control is activated. */
  @event({ name: 'sl-itsl-files-profile-toggle' })
  profileToggleEvent!: EventEmitter<SlItslFilesProfileToggleEvent>;

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
          <div class="logo-area">
            <span class="logo" aria-hidden="true">its</span>
          </div>
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
          <!-- "bell" is not a registered icon in this theme; the slot is kept empty so the
               layout doesn't shift — see the implementation report. -->
          <span class="icon-slot" aria-hidden="true"></span>
          <!-- "comment" is not a registered icon in this theme; same treatment as above. -->
          <span class="icon-slot" aria-hidden="true"></span>
          <button
            class="profile"
            type="button"
            aria-haspopup="menu"
            aria-expanded="false"
            @click=${this.#onProfileClick}
          >
            <sl-avatar
              image-only
              display-name=${model.user.name}
              picture-url=${ifDefined(model.user.avatarUrl)}
            ></sl-avatar>
          </button>
        </div>
      </nav>
    `;
  }

  /**
   * Emits `sl-itsl-files-nav-navigate` as a cancelable event; if a host listener calls
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

if (!customElements.get('sl-itsl-files-top-nav')) {
  customElements.define('sl-itsl-files-top-nav', TopNav);
}
