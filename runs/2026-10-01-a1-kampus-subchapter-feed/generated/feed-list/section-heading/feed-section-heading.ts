import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { type FeedViewMode } from '../../models.js';
import styles from './feed-section-heading.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-feed-section-heading': FeedSectionHeading;
  }

  interface GlobalEventHandlersEventMap {
    'sl-section-heading-action': SlSectionHeadingActionEvent;
    'sl-section-heading-view-change': SlSectionHeadingViewChangeEvent;
  }
}

/** The id of one of the two icon-only row actions (link / overflow menu). */
export type FeedSectionHeadingAction = 'link' | 'more';

export type SlSectionHeadingActionEvent = CustomEvent<{ action: FeedSectionHeadingAction }>;

export type SlSectionHeadingViewChangeEvent = CustomEvent<{ view: FeedViewMode }>;

/**
 * Inline glyphs for this component only — the Kampus theme has no `link`/`ellipsis`/`list`/`grid`
 * icon and nothing in this harness registers `sl-icon`, so these are hand-authored SVGs rather
 * than `<sl-icon>`. Exact path fidelity isn't the point; presence and size are.
 */
const LINK_ICON = svg`
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const MORE_ICON = svg`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
`;

const LIST_ICON = svg`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="3" rx="1" />
    <rect x="3" y="10.5" width="18" height="3" rx="1" />
    <rect x="3" y="16.5" width="18" height="3" rx="1" />
  </svg>
`;

const GRID_ICON = svg`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
`;

/**
 * A feed section's heading row: the section title, a link/overflow action pair and a
 * list/grid view toggle, underlined by the feed's rule. Used once per feed section (5 times on
 * the subchapter feed page — "Teksti", "Tehtävät", …).
 *
 * `heading` and `view` are deliberately two independent scalar properties rather than a single
 * model object: they're unrelated values (data vs. UI state), so wrapping them in a `{ title }`
 * object would be ceremony with no real cohesion.
 *
 * This is a presentational component: it owns no data, manages only its own `view` toggle state
 * (optimistically, so the story/host can render with zero args) and emits when the action pair
 * or the view toggle are activated; the data-owning page decides what happens next.
 *
 * ```html
 * <sl-feed-section-heading heading="Teksti" view="list"></sl-feed-section-heading>
 * ```
 *
 * @fires sl-section-heading-action - Emitted when the link or overflow ("…") action is activated.
 * @fires sl-section-heading-view-change - Emitted when the list/grid view toggle changes.
 */
export class FeedSectionHeading extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether the link, overflow and view-toggle controls are hidden (student view). */
  @property({ type: Boolean, reflect: true, attribute: 'actions-hidden' }) actionsHidden?: boolean;

  /** The section's own title ("Teksti", "Tehtävät", …) — data, rendered directly. */
  @property() heading?: string;

  /**
   * The active view of the section's item list.
   *
   * @default 'list'
   */
  @property({ reflect: true }) view?: FeedViewMode;

  /** Emits when the link or overflow ("…") action is activated. */
  @event({ name: 'sl-section-heading-action' })
  actionEvent!: EventEmitter<SlSectionHeadingActionEvent>;

  /** Emits when the list/grid view toggle changes. */
  @event({ name: 'sl-section-heading-view-change' })
  viewChangeEvent!: EventEmitter<SlSectionHeadingViewChangeEvent>;

  override render(): TemplateResult {
    const view = this.view ?? 'list';

    return html`
      <h2>${this.heading}</h2>
      ${this.actionsHidden
        ? nothing
        : html`
            <div class="actions">
              <button
                @click=${() => this.#onAction('link')}
                aria-label="Copy link to section"
                class="icon-action"
                type="button">
                ${LINK_ICON}
              </button>
              <button
                @click=${() => this.#onAction('more')}
                aria-label="More actions"
                class="icon-action"
                type="button">
                ${MORE_ICON}
              </button>
              <div aria-label="View" class="view-toggle" role="group">
                <button
                  @click=${() => this.#onViewChange('list')}
                  aria-label="List view"
                  aria-pressed=${view === 'list'}
                  type="button">
                  ${LIST_ICON}
                </button>
                <button
                  @click=${() => this.#onViewChange('grid')}
                  aria-label="Grid view"
                  aria-pressed=${view === 'grid'}
                  type="button">
                  ${GRID_ICON}
                </button>
              </div>
            </div>
          `}
    `;
  }

  #onAction(action: FeedSectionHeadingAction): void {
    this.actionEvent.emit({ action });
  }

  #onViewChange(view: FeedViewMode): void {
    if ((this.view ?? 'list') === view) {
      return;
    }

    this.view = view;
    this.viewChangeEvent.emit({ view });
  }
}

// Rendered by the sibling `sl-subchapter-feed-list` through `scopedElements`, but this story
// still renders it standalone, so it also guards a global define of its own tag.
if (!customElements.get('sl-feed-section-heading')) {
  customElements.define('sl-feed-section-heading', FeedSectionHeading);
}
