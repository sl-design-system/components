import '@sl-design-system/icon/register.js';
import '@sl-design-system/select/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
// Bare import for the side effect only — see the note in the page component.
import './exercise-list-item/a3mp-exercise-list-item.js';
import { type ExerciseListItemModel } from './exercise-list-item/a3mp-exercise-list-item.js';
import styles from './a3mp-exercises-panel.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a3mp-level-change': SlA3mpLevelChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a3mp-exercises-panel': A3mpExercisesPanel;
  }
}

/** Emitted when the exercises-level filter changes. */
export type SlA3mpLevelChangeEvent = CustomEvent<{ levelId: string }>;

/** One option in the exercises-level filter. */
export interface ExerciseLevelOption {
  /** Stable key, e.g. `'regular'`. */
  id: string;
  /** The label as drawn, e.g. `'Regular'`. */
  label: string;
  /** Whether the option is selectable. The design greys out all but the first two. */
  disabled: boolean;
}

/** The data the exercises panel renders; owned by the page. */
export interface ExercisesPanelModel {
  /** The panel heading, as drawn: `'Digital Exercises'`. */
  heading: string;
  /** The label above the level filter, as drawn: `'Exercises level'`. */
  levelLabel: string;
  /** The currently selected level's id. */
  selectedLevelId: string;
  /** The level options, in display order. */
  levels: ExerciseLevelOption[];
  /** The exercise blocks, in display order. */
  exercises: ExerciseListItemModel[];
}

/**
 * The right-hand panel: a heading, an exercises-level filter, and the list of exercise blocks.
 * Presentational — the page owns the model.
 *
 * The level `sl-select` renders **closed**. The design captures it open, but `sl-select` exposes no
 * public API for that (`listbox` is `@query` and marked `@internal`), so the drawn open state is
 * recorded as a deliberate Stage 4 discrepancy rather than faked with a positioned element. The
 * story's `LevelMenuOpen` variant reaches past that internal deliberately and says so.
 *
 * ```html
 * <sl-a3mp-exercises-panel .model=${panel}></sl-a3mp-exercises-panel>
 * ```
 *
 * @fires sl-a3mp-level-change - Emitted when the level filter changes.
 */
export class A3mpExercisesPanel extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the level filter changes. */
  @event({ name: 'sl-a3mp-level-change' }) levelChangeEvent!: EventEmitter<SlA3mpLevelChangeEvent>;

  /**
   * The panel's heading, filter and exercises.
   *
   * @default undefined
   */
  @property({ attribute: false }) model?: ExercisesPanelModel;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <section aria-labelledby="exercises-heading" class="panel">
        <h2 id="exercises-heading">${model.heading}</h2>
        <div class="filter">
          <span class="filter-label" id="level-label">${model.levelLabel}</span>
          <!-- Icon omitted: the design draws an infotip glyph beside the label; no circle-info is
               among the 34 names bingel-int registers. Its 16x16 footprint is kept. -->
          <span aria-hidden="true" class="infotip"></span>
        </div>
        <sl-select
          aria-labelledby="level-label"
          class="level-select"
          .value=${model.selectedLevelId}
          @sl-change=${this.#onLevelChange}>
          ${model.levels.map(
            level => html`
              <sl-option ?disabled=${level.disabled} .value=${level.id}>${level.label}</sl-option>
            `
          )}
        </sl-select>
        <ul class="exercises">
          ${model.exercises.map(
            exercise => html`
              <li>
                <sl-a3mp-exercise-list-item .model=${exercise}></sl-a3mp-exercise-list-item>
              </li>
            `
          )}
        </ul>
      </section>
    `;
  }

  #onLevelChange(event: Event & { detail?: unknown }): void {
    this.levelChangeEvent.emit({ levelId: String(event.detail ?? '') });
  }
}

// Guarded global registration.
if (!customElements.get('sl-a3mp-exercises-panel')) {
  customElements.define('sl-a3mp-exercises-panel', A3mpExercisesPanel);
}
