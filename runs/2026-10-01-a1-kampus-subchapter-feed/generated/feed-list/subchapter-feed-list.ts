import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  ExerciseCard,
  type SlExerciseCardActionEvent,
  type SlExerciseCardOpenEvent
} from './exercise-card/exercise-card.js';
import {
  FeedSectionHeading,
  type SlSectionHeadingActionEvent,
  type SlSectionHeadingViewChangeEvent
} from './section-heading/feed-section-heading.js';
import {
  TheoryCard,
  type SlTheoryCardActionEvent,
  type SlTheoryCardOpenEvent
} from './theory-card/theory-card.js';
import {
  type ExerciseCardModel,
  type FeedListModel,
  type FeedSection,
  type FeedViewMode,
  type TheoryCardModel
} from '../models.js';
import styles from './subchapter-feed-list.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-subchapter-feed-list': SubchapterFeedList;
  }

  interface GlobalEventHandlersEventMap {
    'sl-feed-section-action': SlFeedSectionActionEvent;
    'sl-feed-section-view-change': SlFeedSectionViewChangeEvent;
    'sl-feed-item-open': SlFeedItemOpenEvent;
    'sl-feed-item-action': SlFeedItemActionEvent;
  }
}

/**
 * Emitted when a section heading's link/overflow action is activated; re-emits
 * `sl-feed-section-heading`'s `sl-section-heading-action` with the section's identity attached.
 */
export type SlFeedSectionActionEvent = CustomEvent<{ sectionId: string; action: 'link' | 'more' }>;

/**
 * Emitted when a section heading's list/grid view toggle changes; re-emits
 * `sl-feed-section-heading`'s `sl-section-heading-view-change` with the section's identity
 * attached.
 */
export type SlFeedSectionViewChangeEvent = CustomEvent<{ sectionId: string; view: FeedViewMode }>;

/**
 * Emitted when an item's title link is activated; re-emits the item card's own `-open` event with
 * its section's identity attached.
 */
export type SlFeedItemOpenEvent = CustomEvent<{ sectionId: string; itemId: string }>;

/**
 * Emitted when an item's "more" action is activated; re-emits the item card's own `-action` event
 * with its section's identity attached.
 */
export type SlFeedItemActionEvent = CustomEvent<{ sectionId: string; itemId: string; action: 'more' }>;

/**
 * The scrollable feed body of the Kampus subchapter feed page: one `<section>` per
 * `model.sections` entry, each a section heading followed by that section's items — theory items
 * laid out full-width, exercise items laid out in a 2-up grid. The four `Frame 1434` wrappers in
 * the Figma tree collapse into this single component's CSS grid; they are not separate
 * components.
 *
 * This is a presentational component: it receives its `model` from the data-owning
 * `sl-subchapter-feed-page`, owns only the local UI state of which view (list/grid) each section
 * is currently in, and re-emits its children's events with the section/item identity attached —
 * the page decides what happens next.
 *
 * ```html
 * <sl-subchapter-feed-list .model=${model}></sl-subchapter-feed-list>
 * ```
 *
 * @fires sl-feed-section-action - Emitted when a section's link or overflow ("…") action is activated.
 * @fires sl-feed-section-view-change - Emitted when a section's list/grid view toggle changes.
 * @fires sl-feed-item-open - Emitted when an item's title link is activated.
 * @fires sl-feed-item-action - Emitted when an item's "more" action is activated.
 */
export class SubchapterFeedList extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-feed-section-heading': FeedSectionHeading,
      'sl-theory-card': TheoryCard,
      'sl-exercise-card': ExerciseCard
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The feed sections this list renders. */
  @property({ attribute: false }) model?: FeedListModel;

  /** Whether the children's action controls are hidden (student view); forwarded to each child. */
  @property({ type: Boolean, attribute: 'student-view' }) studentView?: boolean;

  /**
   * @internal Local UI state: the active list/grid view per section id, seeded to `'list'` on
   * first render. Not part of the data model — a section's view is a UI concern, not domain data.
   */
  @state() private viewModes = new Map<string, FeedViewMode>();

  /** Emits when a section's link or overflow ("…") action is activated. */
  @event({ name: 'sl-feed-section-action' }) sectionActionEvent!: EventEmitter<SlFeedSectionActionEvent>;

  /** Emits when a section's list/grid view toggle changes. */
  @event({ name: 'sl-feed-section-view-change' })
  sectionViewChangeEvent!: EventEmitter<SlFeedSectionViewChangeEvent>;

  /** Emits when an item's title link is activated. */
  @event({ name: 'sl-feed-item-open' }) itemOpenEvent!: EventEmitter<SlFeedItemOpenEvent>;

  /** Emits when an item's "more" action is activated. */
  @event({ name: 'sl-feed-item-action' }) itemActionEvent!: EventEmitter<SlFeedItemActionEvent>;

  override render(): TemplateResult {
    const sections = this.model?.sections ?? [];

    return html`${sections.map(section => this.#renderSection(section))}`;
  }

  #renderSection(section: FeedSection): TemplateResult {
    const view = this.viewModes.get(section.id) ?? (section.kind === 'exercise' ? 'grid' : 'list');

    return html`
      <section aria-label=${section.title}>
        <sl-feed-section-heading
          .heading=${section.title}
          .view=${view}
          ?actions-hidden=${this.studentView}
          @sl-section-heading-action=${(e: SlSectionHeadingActionEvent) => this.#onSectionAction(section.id, e)}
          @sl-section-heading-view-change=${(e: SlSectionHeadingViewChangeEvent) =>
            this.#onSectionViewChange(section.id, e)}
        ></sl-feed-section-heading>
        <ul class=${view === 'grid' ? 'grid' : 'list'}>
          ${section.items.map(item => html`<li>${this.#renderItem(section, item)}</li>`)}
        </ul>
      </section>
    `;
  }

  #renderItem(section: FeedSection, item: TheoryCardModel | ExerciseCardModel): TemplateResult {
    return section.kind === 'text'
      ? html`
          <sl-theory-card
            .model=${item as TheoryCardModel}
            ?actions-hidden=${this.studentView}
            @sl-theory-card-open=${(e: SlTheoryCardOpenEvent) => this.#onItemOpen(section.id, e)}
            @sl-theory-card-action=${(e: SlTheoryCardActionEvent) => this.#onItemAction(section.id, e)}
          ></sl-theory-card>
        `
      : html`
          <sl-exercise-card
            .model=${item as ExerciseCardModel}
            ?actions-hidden=${this.studentView}
            @sl-exercise-card-open=${(e: SlExerciseCardOpenEvent) => this.#onItemOpen(section.id, e)}
            @sl-exercise-card-action=${(e: SlExerciseCardActionEvent) => this.#onItemAction(section.id, e)}
          ></sl-exercise-card>
        `;
  }

  #onSectionAction(sectionId: string, e: SlSectionHeadingActionEvent): void {
    this.sectionActionEvent.emit({ sectionId, action: e.detail.action });
  }

  #onSectionViewChange(sectionId: string, e: SlSectionHeadingViewChangeEvent): void {
    this.viewModes = new Map(this.viewModes).set(sectionId, e.detail.view);
    this.sectionViewChangeEvent.emit({ sectionId, view: e.detail.view });
  }

  #onItemOpen(sectionId: string, e: SlTheoryCardOpenEvent | SlExerciseCardOpenEvent): void {
    this.itemOpenEvent.emit({ sectionId, itemId: e.detail.itemId });
  }

  #onItemAction(sectionId: string, e: SlTheoryCardActionEvent | SlExerciseCardActionEvent): void {
    this.itemActionEvent.emit({ sectionId, itemId: e.detail.itemId, action: e.detail.action });
  }
}

// Rendered by the parent `sl-subchapter-feed-page` through `scopedElements`, but this story still
// renders it standalone, so it also guards a global define of its own tag.
if (!customElements.get('sl-subchapter-feed-list')) {
  customElements.define('sl-subchapter-feed-list', SubchapterFeedList);
}
