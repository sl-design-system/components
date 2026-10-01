import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  KampusAppHeader,
  type SlAppHeaderActionEvent,
  type SlAppNavSelectEvent
} from './app-header/kampus-app-header.js';
import {
  SubchapterFeedHeader,
  type SlFeedFilterChangeEvent,
  type SlFeedHeaderActionEvent,
  type SlFeedNavigateEvent,
  type SlStudentViewChangeEvent
} from './feed-header/subchapter-feed-header.js';
import {
  SubchapterFeedList,
  type SlFeedItemActionEvent,
  type SlFeedItemOpenEvent,
  type SlFeedSectionActionEvent,
  type SlFeedSectionViewChangeEvent
} from './feed-list/subchapter-feed-list.js';
import {
  A1KampusLeftToolbar,
  type SlToolbarToolSelectEvent
} from './left-toolbar/kampus-left-toolbar.js';
import { SUBCHAPTER_FEED_PAGE_DATA } from './mock-data.js';
import { type AppNavId, type FeedFilterId, type SubchapterFeedPageData } from './models.js';
import {
  KampusTocSidebar,
  type SlTocCloseEvent,
  type SlTocSelectEvent
} from './toc-sidebar/kampus-toc-sidebar.js';
import styles from './subchapter-feed-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-subchapter-feed-page': SubchapterFeedPage;
  }
}

/**
 * The Kampus "subchapter feed" screen: the persistent app header, the left tool rail, a
 * collapsible table-of-contents sidebar, and the scrollable subchapter content column (feed
 * header strips + the theory/exercise feed).
 *
 * This is the root/page component: it owns the data (a static mock transcribed from the design,
 * with a comment marking where the real fetch would go) and passes each presentational child
 * only its own slice. It is also the terminal handler for every child event — it updates its own
 * UI state (active nav item, ToC open/selected, active filter, student view) and never emits
 * anything itself.
 *
 * ```html
 * <sl-subchapter-feed-page></sl-subchapter-feed-page>
 * ```
 */
export class SubchapterFeedPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-kampus-app-header': KampusAppHeader,
      'sl-a1-kampus-left-toolbar': A1KampusLeftToolbar,
      'sl-kampus-toc-sidebar': KampusTocSidebar,
      'sl-subchapter-feed-header': SubchapterFeedHeader,
      'sl-subchapter-feed-list': SubchapterFeedList
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The page's data: the signed-in state of the app header, left toolbar, ToC and subchapter
   * feed. Falls back to the design's own content (`SUBCHAPTER_FEED_PAGE_DATA`) when not
   * overridden, so the story renders with zero args.
   *
   * // TODO: replace with GET /api/subchapters/{id}/feed
   *
   * @default SUBCHAPTER_FEED_PAGE_DATA
   */
  @property({ attribute: false }) data?: SubchapterFeedPageData;

  /** @internal Local UI state: whether the ToC sidebar is open. */
  @state() private tocOpen = true;

  /** @internal Local UI state: the selected ToC entry id, seeded from `data.currentTocId`. */
  @state() private selectedTocId: string = this.#pageData.currentTocId;

  /** @internal Local UI state: the active primary-nav item, seeded from `data.activeNavId`. */
  @state() private activeNavId: AppNavId = this.#pageData.activeNavId;

  /** @internal Local UI state: the active content-type filter. */
  @state() private activeFilter: FeedFilterId = 'all';

  /** @internal Local UI state: whether "Student view" is switched on. */
  @state() private studentView = false;

  get #pageData(): SubchapterFeedPageData {
    return this.data ?? SUBCHAPTER_FEED_PAGE_DATA;
  }

  override render(): TemplateResult {
    const data = this.#pageData;
    const feed =
      this.activeFilter === 'all'
        ? data.feed
        : { sections: data.feed.sections.filter(section => section.kind === this.activeFilter) };

    return html`
      <div class="page">
        <sl-kampus-app-header
          .activeNavId=${this.activeNavId}
          .notificationCount=${data.notificationCount}
          @sl-app-nav-select=${this.#onAppNavSelect}
          @sl-app-header-action=${this.#onAppHeaderAction}
        ></sl-kampus-app-header>

        <div class="body">
          <sl-a1-kampus-left-toolbar
            .model=${data.toolbar}
            @sl-toolbar-tool-select=${this.#onToolbarToolSelect}
          ></sl-a1-kampus-left-toolbar>

          ${this.tocOpen
            ? html`
                <sl-kampus-toc-sidebar
                  .model=${data.toc}
                  .selectedId=${this.selectedTocId}
                  @sl-toc-select=${this.#onTocSelect}
                  @sl-toc-close=${this.#onTocClose}
                ></sl-kampus-toc-sidebar>
              `
            : nothing}

          <div aria-label="Subchapter content" class="content" tabindex="0">
            <sl-subchapter-feed-header
              .model=${data.header}
              .selectedFilter=${this.activeFilter}
              .studentView=${this.studentView}
              @sl-feed-navigate=${this.#onFeedNavigate}
              @sl-feed-header-action=${this.#onFeedHeaderAction}
              @sl-feed-filter-change=${this.#onFeedFilterChange}
              @sl-student-view-change=${this.#onStudentViewChange}
            ></sl-subchapter-feed-header>

            <sl-subchapter-feed-list
              .model=${feed}
              .studentView=${this.studentView}
              @sl-feed-section-action=${this.#onFeedSectionAction}
              @sl-feed-section-view-change=${this.#onFeedSectionViewChange}
              @sl-feed-item-open=${this.#onFeedItemOpen}
              @sl-feed-item-action=${this.#onFeedItemAction}
            ></sl-subchapter-feed-list>
          </div>
        </div>
      </div>
    `;
  }

  #onAppNavSelect(event: SlAppNavSelectEvent): void {
    this.activeNavId = event.detail.id;
  }

  #onAppHeaderAction(event: SlAppHeaderActionEvent): void {
    // This is an example app with no router; a real app would open search/notifications/help/account.
    console.info('App header action', event.detail.action);
  }

  #onToolbarToolSelect(event: SlToolbarToolSelectEvent): void {
    // This is an example app with no router; a real app would switch the active tool panel. The
    // toolbar's own active/badge state is data-owned (`ToolbarModel`), not page UI state, so there
    // is nothing further to update here.
    console.info('Toolbar tool select', event.detail.toolId);
  }

  #onTocSelect(event: SlTocSelectEvent): void {
    this.selectedTocId = event.detail.id;
  }

  #onTocClose(_event: SlTocCloseEvent): void {
    this.tocOpen = false;
  }

  #onFeedNavigate(event: SlFeedNavigateEvent): void {
    // This is an example app with no router; a real app would navigate to the previous/next
    // subchapter.
    console.info('Feed navigate', event.detail.direction);
  }

  #onFeedHeaderAction(event: SlFeedHeaderActionEvent): void {
    // This is an example app with no router; a real app would copy the link or open the overflow
    // menu.
    console.info('Feed header action', event.detail.action);
  }

  #onFeedFilterChange(event: SlFeedFilterChangeEvent): void {
    this.activeFilter = event.detail.filter;
  }

  #onStudentViewChange(event: SlStudentViewChangeEvent): void {
    this.studentView = event.detail.studentView;
  }

  #onFeedSectionAction(event: SlFeedSectionActionEvent): void {
    // This is an example app with no router; a real app would copy the section link or open its
    // overflow menu.
    console.info('Feed section action', event.detail);
  }

  #onFeedSectionViewChange(event: SlFeedSectionViewChangeEvent): void {
    // The list/grid toggle's own state is owned by `sl-subchapter-feed-list`; nothing further to
    // update here.
    console.info('Feed section view change', event.detail);
  }

  #onFeedItemOpen(event: SlFeedItemOpenEvent): void {
    // This is an example app with no router; a real app would open the item.
    console.info('Feed item open', event.detail);
  }

  #onFeedItemAction(event: SlFeedItemActionEvent): void {
    console.info('Feed item action', event.detail);
  }
}

if (!customElements.get('sl-subchapter-feed-page')) {
  customElements.define('sl-subchapter-feed-page', SubchapterFeedPage);
}
