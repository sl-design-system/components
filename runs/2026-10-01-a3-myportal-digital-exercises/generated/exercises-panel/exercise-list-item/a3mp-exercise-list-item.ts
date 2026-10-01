import '@sl-design-system/icon/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './a3mp-exercise-list-item.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a3mp-exercise-add-toggle': SlA3mpExerciseAddToggleEvent;
    'sl-a3mp-exercise-view': SlA3mpExerciseViewEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a3mp-exercise-list-item': A3mpExerciseListItem;
  }
}

/** Emitted when the preview (eye) button is activated. */
export type SlA3mpExerciseViewEvent = CustomEvent<{ exerciseId: string }>;

/** Emitted when the add/added toggle is activated; `added` is the state being requested. */
export type SlA3mpExerciseAddToggleEvent = CustomEvent<{ exerciseId: string; added: boolean }>;

/** One exercise block in the Digital Exercises list. */
export interface ExerciseListItemModel {
  /** Stable key for the exercise. */
  id: string;
  /** The source line as drawn, e.g. `'Reken Maar! 2 | Blok 2'`. */
  source: string;
  /** Present when the row carries the `MAX` level badge. */
  level?: 'max';
  /** The exercise title, free text from the data source. */
  title: string;
  /** The interaction types, e.g. `['Single choice', 'Multi choice', 'Drag and drop']`. */
  typeKeys: string[];
  /** Duration in seconds; the component formats it as `mm:ss`. */
  durationSeconds: number;
  /** How many exercises the block contains. */
  exerciseCount: number;
  /** Whether the row is already added to the lesson. */
  added: boolean;
  /**
   * 1-based position in the list, and how many rows there are. The four rows in this design share
   * the same `title` and the same `source`, so position is the only thing that distinguishes them
   * — without it a screen-reader user navigating by buttons hears eight identically-named
   * controls.
   */
  position: number;
  /** How many exercises are in the list, for the accessible label. */
  total: number;
}

/**
 * Formats a duration as `mm:ss`. A real application would take the format from the user's locale
 * rather than fixing it here; the design shows `00:45` and this run reproduces that literally.
 */
const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60),
    seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * One exercise block: a source line with an optional `MAX` badge, a title, a divider, and a meta
 * strip of type / time / exercise count, with preview and add-toggle buttons at the right edge.
 *
 * ```html
 * <sl-a3mp-exercise-list-item .model=${exercise}></sl-a3mp-exercise-list-item>
 * ```
 *
 * @fires sl-a3mp-exercise-view - Emitted when the preview button is activated.
 * @fires sl-a3mp-exercise-add-toggle - Emitted when the add toggle is activated.
 */
export class A3mpExerciseListItem extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the add toggle is activated. */
  @event({ name: 'sl-a3mp-exercise-add-toggle' })
  exerciseAddToggleEvent!: EventEmitter<SlA3mpExerciseAddToggleEvent>;

  /** @internal Emits when the preview button is activated. */
  @event({ name: 'sl-a3mp-exercise-view' }) exerciseViewEvent!: EventEmitter<SlA3mpExerciseViewEvent>;

  /**
   * The exercise to render.
   *
   * @default undefined
   */
  @property({ attribute: false }) model?: ExerciseListItemModel;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <article>
        <div class="top">
          <div class="headings">
            <p class="source">
              <span>${model.source}</span>
              ${model.level === 'max'
                ? html`
                    <span class="max-badge">
                      <!-- Icon omitted: the design draws a small star before 'MAX'; 'star' is not
                           among the 34 names bingel-int registers. Its 10x10 footprint is kept. -->
                      <span aria-hidden="true" class="max-icon"></span>MAX
                    </span>
                  `
                : nothing}
            </p>
            <h3 class="title">${model.title}</h3>
          </div>
          <div class="actions">
            <button
              aria-label="Preview exercise ${model.position} of ${model.total}: ${model.title}"
              class="action"
              type="button"
              @click=${() => this.exerciseViewEvent.emit({ exerciseId: model.id })}>
              <!-- Icon omitted: 'eye' is not registered in bingel-int. The 16x16 footprint is kept
                   so the row's right edge does not move. Never hand-drawn. -->
              <span aria-hidden="true" class="action-icon"></span>
            </button>
            <button
              aria-label=${model.added
                ? `Remove exercise ${model.position} of ${model.total}, ${model.title}, from the lesson`
                : `Add exercise ${model.position} of ${model.total}, ${model.title}, to the lesson`}
              aria-pressed=${model.added ? 'true' : 'false'}
              class="action"
              type="button"
              @click=${() =>
                this.exerciseAddToggleEvent.emit({ exerciseId: model.id, added: !model.added })}>
              ${model.added
                ? // Only the solid weight of `check` is registered in this theme; the design draws
                  // the regular weight. The substitution is recorded as a Stage 4 discrepancy.
                  html`<sl-icon name="check-solid" size="md"></sl-icon>`
                : // Icon omitted: `plus` is not registered. Footprint preserved.
                  html`<span aria-hidden="true" class="action-icon"></span>`}
            </button>
          </div>
        </div>
        <hr />
        <dl class="meta">
          <div class="meta-group">
            <dt>Type:</dt>
            <dd>${model.typeKeys.join(' | ')}</dd>
          </div>
          <div class="meta-group meta-group-end">
            <dt>Time:</dt>
            <dd>${formatDuration(model.durationSeconds)}</dd>
          </div>
          <div class="meta-group meta-group-end">
            <dt>Exercises:</dt>
            <dd>
              <!-- Icon omitted: the design draws a 'list' glyph before the count; not registered. -->
              <span aria-hidden="true" class="meta-icon"></span>${model.exerciseCount}
            </dd>
          </div>
        </dl>
      </article>
    `;
  }
}

// Guarded global registration — a type-only import of this module would register nothing.
if (!customElements.get('sl-a3mp-exercise-list-item')) {
  customElements.define('sl-a3mp-exercise-list-item', A3mpExerciseListItem);
}
