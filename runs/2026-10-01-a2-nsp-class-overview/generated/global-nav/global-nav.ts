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
import styles from './global-nav.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a2-global-nav-navigate': SlA2GlobalNavNavigateEvent;
    'sl-a2-global-nav-profile-toggle': SlA2GlobalNavProfileToggleEvent;
    'sl-a2-global-nav-search': SlA2GlobalNavSearchEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a2-global-nav': GlobalNav;
  }
}

/** The signed-in user shown in the profile control; owned/fetched by the page, passed in here. */
export interface NavUserModel {
  id: string;
  displayName: string;
  pictureUrl?: string;
}

/** The stable key of one of the four global nav links. */
export type GlobalNavKey = 'home' | 'calendar' | 'method-catalogue' | 'teaching-materials';

/** Emitted with the current search query as the user searches. */
export type SlA2GlobalNavSearchEvent = CustomEvent<{ query: string }>;

/** Emitted when one of the four global nav links is activated. */
export type SlA2GlobalNavNavigateEvent = CustomEvent<{ key: GlobalNavKey }>;

/** Emitted when the profile control is activated; `open` is this component's own toggle state. */
export type SlA2GlobalNavProfileToggleEvent = CustomEvent<{ open: boolean }>;

interface GlobalNavLink {
  key: GlobalNavKey;
  href: string;
  label: string;
}

/**
 * Structural/presentation config owned by this component, not a model field — these four
 * top-level links are app chrome that never varies per user or page. Hrefs aren't specified by
 * the design; these are placeholder in-app routes, flagged in the implementation report.
 */
const GLOBAL_NAV_LINKS: GlobalNavLink[] = [
  { key: 'home', href: '/home', label: 'Home' },
  { key: 'calendar', href: '/calendar', label: 'Calendar' },
  { key: 'method-catalogue', href: '/method-catalogue', label: 'Method catalogue' },
  { key: 'teaching-materials', href: '/teaching-materials', label: 'Teaching materials' }
];

/**
 * The 56px global navigation bar: brand mark, the four primary app links, search, and the
 * profile control. Presentational — the page passes in the signed-in `user` and handles the
 * emitted search/navigate/profile-toggle events. No link is active in this design (the active
 * state lives on the secondary `<sl-a2-class-nav>` bar beneath it).
 *
 * ```html
 * <sl-a2-global-nav .user=${{ id: 'u-1', displayName: 'Lynn Smith' }}></sl-a2-global-nav>
 * ```
 *
 * @slot logo - The brand mark; defaults to the design's blue "S" tile.
 * @slot actions - Extra trailing actions rendered between search and the profile control.
 *
 * @fires sl-a2-global-nav-search - Emitted with the current search query as the user searches.
 * @fires sl-a2-global-nav-navigate - Emitted when one of the four nav links is activated.
 * @fires sl-a2-global-nav-profile-toggle - Emitted when the profile control is activated.
 */
export class GlobalNav extends ScopedElementsMixin(LitElement) {
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

  /** @internal Whether the host-owned profile menu is open; this component renders no menu. */
  #profileOpen = false;

  /** @internal Emits with the current search query as the user searches. */
  @event({ name: 'sl-a2-global-nav-search' }) searchEvent!: EventEmitter<SlA2GlobalNavSearchEvent>;

  /** @internal Emits when one of the four nav links is activated. */
  @event({ name: 'sl-a2-global-nav-navigate' })
  navigateEvent!: EventEmitter<SlA2GlobalNavNavigateEvent>;

  /** @internal Emits when the profile control is activated. */
  @event({ name: 'sl-a2-global-nav-profile-toggle' })
  profileToggleEvent!: EventEmitter<SlA2GlobalNavProfileToggleEvent>;

  /**
   * The signed-in user shown in the profile control; passed in by the page that owns the data.
   *
   * @default null
   */
  @property({ attribute: false }) user: NavUserModel | null = null;

  /**
   * The current search field value.
   *
   * @default ''
   */
  @property({ reflect: true, attribute: 'search-value' }) searchValue = '';

  override render(): TemplateResult {
    const accountLabel = this.user ? `${this.user.displayName} account` : 'Account';

    return html`
      <nav aria-label="Main">
        <div class="start">
          <slot name="logo">
            <span class="logo" aria-hidden="true">S</span>
          </slot>
          <ul class="links">
            ${GLOBAL_NAV_LINKS.map(
              link => html`
                <li>
                  <a href=${link.href} @click=${(e: MouseEvent) => this.#onLinkClick(e, link)}>
                    ${link.label}
                  </a>
                </li>
              `
            )}
          </ul>
        </div>
        <div class="end">
          <sl-search-field
            aria-label="Search"
            placeholder="Search"
            .value=${this.searchValue}
            @sl-search=${this.#onSearch}
            @sl-clear=${this.#onClear}
          ></sl-search-field>
          <slot name="actions"></slot>
          <button class="profile" type="button" aria-label=${accountLabel} @click=${this.#onProfileClick}>
            <sl-avatar
              size="sm"
              image-only
              display-name=${ifDefined(this.user?.displayName)}
              picture-url=${ifDefined(this.user?.pictureUrl)}
            ></sl-avatar>
            <sl-icon name="chevron-down" aria-hidden="true"></sl-icon>
          </button>
        </div>
      </nav>
    `;
  }

  #onLinkClick(e: MouseEvent, link: GlobalNavLink): void {
    e.preventDefault();
    this.navigateEvent.emit({ key: link.key });
  }

  #onSearch(e: SlSearchEvent): void {
    this.searchValue = e.detail;
    this.searchEvent.emit({ query: e.detail });
  }

  #onClear(): void {
    this.searchValue = '';
    this.searchEvent.emit({ query: '' });
  }

  #onProfileClick(): void {
    this.#profileOpen = !this.#profileOpen;
    this.profileToggleEvent.emit({ open: this.#profileOpen });
  }
}

// Guarded global registration. Without this the module runs, the class is defined, the type check
// passes — and `<sl-a2-global-nav>` stays an inert unknown element with no shadow root. The story
// already carries the required bare side-effect import; that rule only guarantees the module
// *executes*, and nothing in the pipeline checks that the module actually registers anything.
if (!customElements.get('sl-a2-global-nav')) {
  customElements.define('sl-a2-global-nav', GlobalNav);
}
