import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { Switch } from '@sl-design-system/switch';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { type BreadcrumbItem, type FeedFilterId, type FeedHeaderModel } from '../models.js';
import styles from './subchapter-feed-header.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-feed-navigate': SlFeedNavigateEvent;
    'sl-feed-header-action': SlFeedHeaderActionEvent;
    'sl-feed-filter-change': SlFeedFilterChangeEvent;
    'sl-student-view-change': SlStudentViewChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-subchapter-feed-header': SubchapterFeedHeader;
  }
}

/** Emitted when the user activates the previous/next subchapter button. */
export type SlFeedNavigateEvent = CustomEvent<{ direction: 'previous' | 'next' }>;

/** Emitted when the user activates one of the page heading's actions. */
export type SlFeedHeaderActionEvent = CustomEvent<{ action: 'link' | 'more' }>;

/** Emitted when the user picks a different content-type filter. */
export type SlFeedFilterChangeEvent = CustomEvent<{ filter: FeedFilterId }>;

/** Emitted when the user toggles "Student view". */
export type SlStudentViewChangeEvent = CustomEvent<{ studentView: boolean }>;

/**
 * Structural/presentation config, not domain data: the fixed filter pills, in the order the
 * design shows them. Only the counts (from `model.filterCounts`) are data; `all` never shows a
 * count.
 */
const FEED_FILTERS: Array<{ id: FeedFilterId; label: string }> = [
  { id: 'all', label: 'Show everything' },
  { id: 'text', label: 'Text' },
  { id: 'exercise', label: 'Exercise' }
];

const CHEVRON_LEFT = svg`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M15 6l-6 6 6 6"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

const CHEVRON_RIGHT = svg`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M9 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

/** The chain-link glyph for the heading's "copy link" action. */
const LINK_GLYPH = svg`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-2 2"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l2-2"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

/** The horizontal ellipsis ("more actions") glyph, shared with the feed's cards for consistency. */
const ELLIPSIS_GLYPH = svg`
  <svg viewBox="0 0 512 512" aria-hidden="true">
    <path
      d="M64 224a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm192 0a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm192 0a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
      fill="currentColor"
    />
  </svg>
`;

/**
 * The four stacked strips at the top of the Kampus subchapter feed's content column: the
 * breadcrumb trail (with previous/next subchapter navigation), the page heading (with link/more
 * actions), the content-type filter pills, and the "Student view" toggle. One contiguous visual
 * unit, so one component rather than four.
 *
 * This is a presentational component: it receives its `model` from the data-owning
 * `sl-subchapter-feed-page` and emits an event per interaction instead of navigating, filtering
 * or fetching anything itself.
 *
 * ```html
 * <sl-subchapter-feed-header .model=${model}></sl-subchapter-feed-header>
 * ```
 *
 * @fires sl-feed-navigate - Emitted when the user activates the previous/next subchapter button.
 * @fires sl-feed-header-action - Emitted when the user activates a heading action ("link" or "more").
 * @fires sl-feed-filter-change - Emitted when the user picks a different content-type filter.
 * @fires sl-student-view-change - Emitted when the user toggles "Student view".
 */
export class SubchapterFeedHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-switch': Switch
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The breadcrumb trail, page heading and filter counts this header renders. */
  @property({ attribute: false }) model?: FeedHeaderModel;

  /**
   * The currently active content-type filter.
   *
   * @default 'all'
   */
  @property({ reflect: true }) selectedFilter?: FeedFilterId = 'all';

  /**
   * Whether "Student view" is switched on.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) studentView?: boolean = false;

  /** Emits when the user activates the previous/next subchapter button. */
  @event({ name: 'sl-feed-navigate' }) navigateEvent!: EventEmitter<SlFeedNavigateEvent>;

  /** Emits when the user activates a heading action. */
  @event({ name: 'sl-feed-header-action' }) headerActionEvent!: EventEmitter<SlFeedHeaderActionEvent>;

  /** Emits when the user picks a different content-type filter. */
  @event({ name: 'sl-feed-filter-change' }) filterChangeEvent!: EventEmitter<SlFeedFilterChangeEvent>;

  /** Emits when the user toggles "Student view". */
  @event({ name: 'sl-student-view-change' }) studentViewChangeEvent!: EventEmitter<SlStudentViewChangeEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const { breadcrumbs, heading, hasPrevious, hasNext, filterCounts } = this.model;

    return html`
      <div class="breadcrumb-row">
        <nav aria-label="Breadcrumb">
          <ol class="breadcrumb">
            ${breadcrumbs.map(
              (crumb, index) => html`
                <li>
                  ${this.#renderCrumb(crumb)}
                  ${index < breadcrumbs.length - 1
                    ? html`<span class="breadcrumb-separator">${CHEVRON_RIGHT}</span>`
                    : nothing}
                </li>
              `
            )}
          </ol>
        </nav>
        <div class="nav-buttons">
          <sl-button
            aria-label="Previous subchapter"
            class="nav"
            ?disabled=${!hasPrevious}
            @click=${() => this.#onNavigate('previous')}
            >${CHEVRON_LEFT}</sl-button
          >
          <sl-button
            aria-label="Next subchapter"
            class="nav"
            ?disabled=${!hasNext}
            @click=${() => this.#onNavigate('next')}
            >${CHEVRON_RIGHT}</sl-button
          >
        </div>
      </div>

      <div class="heading-row">
        <h1>${heading}</h1>
        <div class="heading-actions">
          <sl-button
            aria-label="Copy link"
            class="action"
            fill="ghost"
            variant="primary"
            @click=${() => this.#onHeaderAction('link')}
            >${LINK_GLYPH}</sl-button
          >
          <sl-button
            aria-label="More actions"
            class="action"
            fill="ghost"
            variant="primary"
            @click=${() => this.#onHeaderAction('more')}
            >${ELLIPSIS_GLYPH}</sl-button
          >
        </div>
      </div>

      <div class="filters-row" role="radiogroup" aria-label="Filter">
        <span class="filters-label">Filter</span>
        ${FEED_FILTERS.map(({ id, label }) => {
          const selected = this.selectedFilter === id,
            count = id === 'all' ? undefined : filterCounts[id];

          return html`
            <button
              aria-checked=${selected ? 'true' : 'false'}
              class="filter-pill"
              role="radio"
              type="button"
              @click=${() => this.#onFilterChange(id)}>
              ${label}
              ${count === undefined ? nothing : html`<span class="filter-count">${count}</span>`}
            </button>
          `;
        })}
      </div>

      <div class="student-view-row">
        <sl-switch
          ?checked=${this.studentView}
          reverse
          size="sm"
          @sl-change=${this.#onStudentViewChange}
          >Student view</sl-switch
        >
      </div>
    `;
  }

  /**
   * Renders a single breadcrumb: a link for crumbs with an `href`, plain (non-link, current)
   * text for the trailing crumb.
   */
  #renderCrumb(crumb: BreadcrumbItem): TemplateResult {
    return crumb.href
      ? html`<a href=${crumb.href}>${crumb.label}</a>`
      : html`<span aria-current="page">${crumb.label}</span>`;
  }

  #onNavigate(direction: 'previous' | 'next'): void {
    this.navigateEvent.emit({ direction });
  }

  #onHeaderAction(action: 'link' | 'more'): void {
    this.headerActionEvent.emit({ action });
  }

  #onFilterChange(filter: FeedFilterId): void {
    this.selectedFilter = filter;
    this.filterChangeEvent.emit({ filter });
  }

  #onStudentViewChange(event: Event & { target: Switch }): void {
    this.studentView = !!event.target.checked;
    this.studentViewChangeEvent.emit({ studentView: this.studentView });
  }
}

// This is the top-level element for this component, so it registers itself globally, guarded so
// re-importing this module doesn't throw (it's rendered standalone here and also composed by the
// sibling `sl-subchapter-feed-page`).
if (!customElements.get('sl-subchapter-feed-header')) {
  customElements.define('sl-subchapter-feed-header', SubchapterFeedHeader);
}
