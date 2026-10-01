import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type FeedItemKind, type TheoryCardModel } from '../../models.js';
import styles from './theory-card.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-theory-card-open': SlTheoryCardOpenEvent;
    'sl-theory-card-action': SlTheoryCardActionEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-theory-card': TheoryCard;
  }
}

/** Emitted when the user activates the card's title link. */
export type SlTheoryCardOpenEvent = CustomEvent<{ itemId: string }>;

/** Emitted when the user activates one of the card's actions (currently just "more"). */
export type SlTheoryCardActionEvent = CustomEvent<{ itemId: string; action: 'more' }>;

/**
 * Structural/presentation config, not domain data: the footer label is derived from the model's
 * stable `kind` key, never carried by the model itself. Only `'text'` is evidenced in the design
 * (theory cards are always `kind: 'text'`, per the design's footer row reading "Text");
 * `'exercise'` is a defensive fallback so the map stays total over the shared `FeedItemKind` union.
 */
const FOOTER_LABEL: Record<FeedItemKind, string> = {
  text: 'Text',
  exercise: 'Exercise'
};

/**
 * A single "Theory" (reading) card in the Kampus subchapter feed: a thumbnail image, title,
 * truncated excerpt, an overflow ("more") action, and a footer row naming the item's kind.
 *
 * This is a presentational component: it receives its `model` from the data-owning
 * `sl-subchapter-feed-list` and emits an event per action instead of navigating or fetching
 * anything itself.
 *
 * ```html
 * <sl-theory-card .model=${model}></sl-theory-card>
 * ```
 *
 * @fires sl-theory-card-open - Emitted when the user activates the title link.
 * @fires sl-theory-card-action - Emitted when the user activates the "more" button.
 */
export class TheoryCard extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The theory item this card renders: its identity, content and kind. */
  @property({ attribute: false }) model?: TheoryCardModel;

  /** Hides the "more" action button, e.g. for a read-only presentation of the card. */
  @property({ type: Boolean, reflect: true, attribute: 'actions-hidden' }) actionsHidden?: boolean;

  /** Emits when the user activates the title link. */
  @event({ name: 'sl-theory-card-open' }) openEvent!: EventEmitter<SlTheoryCardOpenEvent>;

  /** Emits when the user activates the "more" button. */
  @event({ name: 'sl-theory-card-action' }) actionEvent!: EventEmitter<SlTheoryCardActionEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const { id, title, excerpt, kind, image } = this.model;

    return html`
      <article>
        <div class="body">
          <figure class="thumbnail">
            <!-- The pipeline has no asset-export step: model.image.src points at /assets/... and
                 404s in this harness by design (recorded Stage 4 discrepancy). The real <img> is
                 still rendered, with its alt text, at the design's fixed box size so the layout
                 holds either way. -->
            ${image ? html`<img src=${image.src} alt=${image.alt} />` : nothing}
          </figure>
          <div class="content">
            <h3><a href="#" @click=${(event: MouseEvent) => this.#onOpen(event, id)}>${title}</a></h3>
            <p class="excerpt">${excerpt}</p>
          </div>
          ${this.actionsHidden
            ? nothing
            : html`
                <button
                  type="button"
                  class="more"
                  aria-label="More actions for ${title}"
                  @click=${() => this.#onAction(id)}
                >
                  <svg viewBox="0 0 512 512" aria-hidden="true">
                    <path
                      d="M64 224a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm192 0a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm192 0a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              `}
        </div>
        <div class="footer">
          <span class="label">${FOOTER_LABEL[kind]}</span>
        </div>
      </article>
    `;
  }

  #onOpen(event: MouseEvent, itemId: string): void {
    // The shared `TheoryCardModel` carries no real href - the anchor exists for keyboard
    // reachability/semantics, not navigation - so the default is prevented and the `-open` event
    // is the actual signal consumers hook into. Recorded as an intentional redundancy per the
    // brief: the anchor keeps the primary target keyboard-reachable, the event carries the data.
    event.preventDefault();
    this.openEvent.emit({ itemId });
  }

  #onAction(itemId: string): void {
    this.actionEvent.emit({ itemId, action: 'more' });
  }
}

// This is the top-level element for this component, so it registers itself globally, guarded so
// re-importing this module doesn't throw (it's rendered standalone here and also composed by the
// sibling `sl-subchapter-feed-list`).
if (!customElements.get('sl-theory-card')) {
  customElements.define('sl-theory-card', TheoryCard);
}
