import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { type ExerciseCardModel, type ExerciseType } from '../../models.js';
import styles from './exercise-card.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-exercise-card-open': SlExerciseCardOpenEvent;
    'sl-exercise-card-action': SlExerciseCardActionEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-exercise-card': ExerciseCard;
  }
}

/** Emitted when the user activates the card's title link. */
export type SlExerciseCardOpenEvent = CustomEvent<{ itemId: string }>;

/** Emitted when the user activates one of the card's actions (currently just "more"). */
export type SlExerciseCardActionEvent = CustomEvent<{ itemId: string; action: 'more' }>;

/**
 * Structural/presentation config, not domain data: the eyebrow label and tile glyph are derived
 * from the model's stable `exerciseType` key, never carried by the model itself.
 *
 * Only `self-correcting` is evidenced in the design (including the stray space in "Self
 * -correcting exercise" - reproduced verbatim for fidelity). `open` and `teacher-checked` are a
 * plausible guess; the Figma component's full variant list was never enumerated because the file
 * publishes no Code Connect mappings. All three currently share the same glyph for the same
 * reason - no other glyph was evidenced.
 */
const EXERCISE_TYPE_INFO: Record<ExerciseType, { eyebrow: string }> = {
  'self-correcting': { eyebrow: 'Self -correcting exercise' },
  open: { eyebrow: 'Open exercise' },
  'teacher-checked': { eyebrow: 'Teacher-checked exercise' }
};

/** A filled star, used for the earned portion of the difficulty rating. */
const STAR_FILLED = svg`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.5l2.9 6.05 6.6.77-4.9 4.6 1.27 6.58L12 17.3l-5.87 3.2 1.27-6.58-4.9-4.6 6.6-.77z"
      fill="currentColor"
    />
  </svg>
`;

/** An outlined star, used for the unearned portion of the difficulty rating. */
const STAR_OUTLINE = svg`
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.5l2.9 6.05 6.6.77-4.9 4.6 1.27 6.58L12 17.3l-5.87 3.2 1.27-6.58-4.9-4.6 6.6-.77z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </svg>
`;

/** The decorative glyph shown in the tile, a stylized puzzle piece / exercise mark. */
const TILE_GLYPH = svg`
  <svg viewBox="0 0 512 512" aria-hidden="true">
    <path
      d="M448 224c17.67 0 32-14.33 32-32V128c0-17.67-14.33-32-32-32h-96V64c0-35.35-28.65-64-64-64s-64 28.65-64 64v32H128c-17.67 0-32 14.33-32 32v64h32c26.51 0 48 21.49 48 48s-21.49 48-48 48H96v64c0 17.67 14.33 32 32 32h64v-32c0-26.51 21.49-48 48-48s48 21.49 48 48v32h64c17.67 0 32-14.33 32-32v-96h32c26.51 0 48-21.49 48-48s-21.49-48-48-48h-32v-16z"
      fill="currentColor"
    />
  </svg>
`;

/** Structural constant: keeps the rating in a fixed 3-star scale. */
const MAX_DIFFICULTY = 3;

/**
 * A single "Exercise" card in the Kampus subchapter feed's exercise grid: an eyebrow label
 * derived from the exercise type, a purple glyph tile, a title, and a 3-star difficulty rating.
 *
 * This is a presentational component: it receives its `model` from the data-owning
 * `sl-subchapter-feed-list` and emits an event per action instead of navigating or fetching
 * anything itself.
 *
 * ```html
 * <sl-exercise-card .model=${model}></sl-exercise-card>
 * ```
 *
 * @fires sl-exercise-card-open - Emitted when the user activates the title link.
 * @fires sl-exercise-card-action - Emitted when the user activates the "more" button.
 */
export class ExerciseCard extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The exercise this card renders: its identity, type and difficulty. */
  @property({ attribute: false }) model?: ExerciseCardModel;

  /** Hides the "more" action button, e.g. for a read-only presentation of the card. */
  @property({ type: Boolean, reflect: true, attribute: 'actions-hidden' }) actionsHidden?: boolean;

  /** Emits when the user activates the title link. */
  @event({ name: 'sl-exercise-card-open' }) openEvent!: EventEmitter<SlExerciseCardOpenEvent>;

  /** Emits when the user activates the "more" button. */
  @event({ name: 'sl-exercise-card-action' }) actionEvent!: EventEmitter<SlExerciseCardActionEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const { id, title, exerciseType, difficulty = 0 } = this.model,
      { eyebrow } = EXERCISE_TYPE_INFO[exerciseType];

    return html`
      <article>
        <div class="header">
          <span class="eyebrow">${eyebrow}</span>
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
        <div class="main">
          <div class="tile">${TILE_GLYPH}</div>
          <h3 class="title">
            <a href="#" @click=${(mouseEvent: MouseEvent) => this.#onOpen(mouseEvent, id)}>${title}</a>
          </h3>
        </div>
        <div class="footer">
          <span class="rating" role="img" aria-label="Difficulty ${difficulty} of ${MAX_DIFFICULTY}">
            ${Array.from(
              { length: MAX_DIFFICULTY },
              (_, index) =>
                html`<span class=${index < difficulty ? 'star filled' : 'star outline'}
                  >${index < difficulty ? STAR_FILLED : STAR_OUTLINE}</span
                >`
            )}
          </span>
        </div>
      </article>
    `;
  }

  #onOpen(mouseEvent: MouseEvent, itemId: string): void {
    mouseEvent.preventDefault();
    this.openEvent.emit({ itemId });
  }

  #onAction(itemId: string): void {
    this.actionEvent.emit({ itemId, action: 'more' });
  }
}

// This is the top-level element for this component, so it registers itself globally, guarded so
// re-importing this module doesn't throw (it's rendered standalone here and also composed by the
// sibling `sl-subchapter-feed-list`).
if (!customElements.get('sl-exercise-card')) {
  customElements.define('sl-exercise-card', ExerciseCard);
}
