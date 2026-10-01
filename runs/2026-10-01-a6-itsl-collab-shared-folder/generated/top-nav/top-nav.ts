import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { SearchField } from '@sl-design-system/search-field';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './top-nav.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a6-top-nav-search': SlA6TopNavSearchEvent;
  }
}

/** One top-level route link in the global menu. */
export interface NavLink {
  id: string;
  label: string;
  href: string;
  current?: boolean;
}

/** The signed-in user, as the navigation needs them. */
export interface NavUser {
  id: string;
  displayName: string;
  pictureUrl?: string;
}

/** The data this component renders: the brand target, the global links and the user. */
export interface TopNavModel {
  brandHref: string;
  links: NavLink[];
  user: NavUser;
}

export type SlA6TopNavSearchEvent = CustomEvent<{ query: string }>;

/**
 * The first of the two 56px rows of the itslearning app-shell `Navigation` component
 * (Figma `.Main menu`, `I4200:13793;9976:10654`): the brand mark, the global route links, a
 * search field, notification and message controls, and the user's avatar.
 *
 * Presentational — it renders the `model` it is given and emits when a search is submitted; the
 * root owns the navigation data and handles the event.
 *
 * The public API (`NavLink`, `NavUser`, `TopNavModel`, the `model` property) is adopted verbatim
 * from the `b-itsl-collab-add-element` run's top nav — the two frames instantiate the *same*
 * Figma source component (`5566:11565`), so the two could later share one implementation. Only
 * the tag name and the event are namespaced `sl-a6-*`, to avoid colliding with that run's global
 * registration.
 *
 * ```html
 * <sl-a6-top-nav .model=${model}></sl-a6-top-nav>
 * ```
 *
 * @fires sl-a6-top-nav-search - Emitted with the query when the user submits a search.
 */
export class A6TopNav extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The brand target, the global links and the signed-in user. */
  @property({ attribute: false }) model?: TopNavModel;

  /** @internal Emits when a search is submitted. */
  @event({ name: 'sl-a6-top-nav-search' })
  searchEvent!: EventEmitter<SlA6TopNavSearchEvent>;

  override render(): TemplateResult {
    const model = this.model,
      links = model?.links ?? [];

    return html`
      <!--
        The itslearning logo is a 32px multi-path BRAND asset, not an icon: it is not one of the
        54 names registered in packages/themes/itslearning/icons.ts, and 'sl-icon' paints a single
        'var(--sl-icon-fill-default)' so it could not carry the mark anyway. The 32px footprint is
        preserved with a CSS-rendered "its" wordmark so the links keep their x-offset; shipping
        the real SVG is an asset decision outside this pipeline.
      -->
      <a aria-label="itslearning home" class="brand" href=${model?.brandHref ?? '#'}>
        <span aria-hidden="true" class="mark">its</span>
      </a>
      <nav aria-label="Main navigation">
        <ul>
          ${links.map(
            link => html`
              <li>
                <a aria-current=${ifDefined(link.current ? 'page' : undefined)} href=${link.href}>
                  ${link.label}
                </a>
              </li>
            `
          )}
        </ul>
      </nav>
      <div class="actions">
        <sl-search-field
          @sl-search=${this.#onSearch}
          aria-label="Search"
          class="search"
          placeholder="Search"></sl-search-field>
        <!--
          'bell' and 'comment' are NOT registered in this theme (Figma's own note on 'comment'
          says "Not in Semiotic"). Both glyphs are omitted rather than hand-drawn or substituted;
          each control keeps its full 48px footprint (24px glyph box + 2 x 12px padding) so the
          avatar and the links either side of it stay where the design puts them. The buttons keep
          real accessible names so they are not empty controls.
        -->
        <button aria-label="Notifications" class="icon-button" type="button">
          <span aria-hidden="true" class="glyph"></span>
        </button>
        <button aria-label="Messages" class="icon-button" type="button">
          <span aria-hidden="true" class="glyph"></span>
        </button>
        <div class="user">
          <!--
            No 'size' attribute: sl-avatar's unqualified default is
            '--_picture-size: var(--sl-size-400)' = 32px, which is exactly Figma Avatar size 200 —
            the only size the Figma annotation permits here. (The sibling run passes 'size="sm"',
            which renders 24px, 8px too small.) 'image-only' is required: without it sl-avatar
            renders the display name as literal text into the bar.
          -->
          <sl-avatar
            .displayName=${model?.user.displayName ?? ''}
            .pictureUrl=${model?.user.pictureUrl ?? undefined}
            image-only></sl-avatar>
        </div>
      </div>
    `;
  }

  #onSearch(event: Event & { detail?: string }): void {
    this.searchEvent.emit({ query: event.detail ?? '' });
  }
}
