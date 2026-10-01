import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { SearchField, type SlSearchEvent } from '@sl-design-system/search-field';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './its-top-nav.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-top-nav-search': SlTopNavSearchEvent;
  }
}

/** One of the top nav's primary links (Courses, Updates, Groups, Calendar, Library). */
export interface NavLink {
  id: string;
  label: string;
  href: string;
  current?: boolean;
}

/** The signed-in user shown as an avatar at the end of the bar. */
export interface NavUser {
  id: string;
  displayName: string;
  pictureUrl?: string;
}

/** The data this component renders; owned and passed in by the page. */
export interface TopNavModel {
  brandHref: string;
  links: NavLink[];
  user: NavUser;
}

/** Emitted with the current query as the user types in the search field. */
export type SlTopNavSearchEvent = CustomEvent<{ query: string }>;

/** Structural constant: the search field's placeholder. Not part of the data model. */
const SEARCH_PLACEHOLDER = 'Search';

/**
 * The top navigation bar of the itslearning app shell: the "its" brand mark, the primary nav
 * links, a search field, and the signed-in user's avatar.
 *
 * Presentational — it renders the `model` the page gives it and emits when the user searches;
 * it owns no data and fires no navigation events of its own (the nav links are plain anchors).
 *
 * Scoped child of the page root: it does not register a custom element of its own.
 *
 * Two icon buttons shown in the design next to the search field (notifications "bell" and a
 * chat/comment icon) are omitted — neither icon is registered by the itslearning theme; see the
 * implementation report.
 *
 * ```html
 * <sl-its-top-nav .model=${model}></sl-its-top-nav>
 * ```
 *
 * @fires sl-top-nav-search - Emitted with the current query as the user types in the search field.
 */
export class ItsTopNav extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emitted with the current query as the user types in the search field. */
  @event({ name: 'sl-top-nav-search' }) searchEvent!: EventEmitter<SlTopNavSearchEvent>;

  /** The brand link target, the primary nav links, and the signed-in user. */
  @property({ attribute: false }) model?: TopNavModel;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <div class="bar">
        <a class="brand" href=${model.brandHref} aria-label="itslearning home">its</a>

        <nav aria-label="Main navigation">
          <ul class="links">
            ${model.links.map(
              link => html`
                <li>
                  <a href=${link.href} aria-current=${ifDefined(link.current ? 'page' : undefined)}
                    >${link.label}</a
                  >
                </li>
              `
            )}
          </ul>
        </nav>

        <div class="end">
          <sl-search-field
            aria-label=${SEARCH_PLACEHOLDER}
            placeholder=${SEARCH_PLACEHOLDER}
            @sl-search=${this.#onSearch}
          ></sl-search-field>
          <sl-avatar image-only size="sm" display-name=${model.user.displayName}></sl-avatar>
        </div>
      </div>
    `;
  }

  #onSearch(event: SlSearchEvent): void {
    this.searchEvent.emit({ query: event.detail });
  }
}
