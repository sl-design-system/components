import '@sl-design-system/icon/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './a3mp-chapter-nav-item.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a3mp-chapter-toggle': SlA3mpChapterToggleEvent;
    'sl-a3mp-tool-select': SlA3mpToolSelectEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a3mp-chapter-nav-item': A3mpChapterNavItem;
  }
}

/** Emitted when the chapter row's expand/collapse affordance is activated. */
export type SlA3mpChapterToggleEvent = CustomEvent<{ chapterId: string; expanded: boolean }>;

/** Emitted when one of the expanded chapter's leaves is activated. */
export type SlA3mpToolSelectEvent = CustomEvent<{ chapterId: string; leafId: string }>;

/** One tool row inside an expanded chapter, e.g. `Digital Exercises (6)`. */
export interface ChapterNavLeaf {
  /** Stable key, e.g. `'digital-exercises'`. */
  id: string;
  /** The label as drawn, e.g. `'Digital Exercises'`. */
  label: string;
  /** The count shown in the trailing badge. */
  count: number;
  /** Whether this leaf is the currently open tool. At most one leaf across the whole nav. */
  selected: boolean;
}

/** The data for one chapter row; owned by the page and passed down through the chapter nav. */
export interface ChapterNavItemModel {
  /** Stable key, e.g. `'chapter-2'`. */
  id: string;
  /** The label as drawn, e.g. `'Chapter 2'`. */
  label: string;
  /** Whether the row is expanded to show its leaves. */
  expanded: boolean;
  /** Whether the row carries the blue emphasis border (the chapter being worked in). */
  highlighted: boolean;
  /** The leaves shown when expanded. Empty for a collapsed-only row. */
  leaves: ChapterNavLeaf[];
}

/**
 * One row of the chapter navigation: a header button that expands to reveal its tool leaves, each
 * with a count badge. Presentational — the page owns the model and the open/selected state.
 *
 * ```html
 * <sl-a3mp-chapter-nav-item .model=${chapter}></sl-a3mp-chapter-nav-item>
 * ```
 *
 * @fires sl-a3mp-chapter-toggle - Emitted when the header row is activated.
 * @fires sl-a3mp-tool-select - Emitted when a leaf row is activated.
 */
export class A3mpChapterNavItem extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the header row is activated. */
  @event({ name: 'sl-a3mp-chapter-toggle' }) chapterToggleEvent!: EventEmitter<SlA3mpChapterToggleEvent>;

  /** @internal Emits when a leaf row is activated. */
  @event({ name: 'sl-a3mp-tool-select' }) toolSelectEvent!: EventEmitter<SlA3mpToolSelectEvent>;

  /**
   * The chapter row to render.
   *
   * @default undefined
   */
  @property({ attribute: false }) model?: ChapterNavItemModel;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    const leavesId = `leaves-${model.id}`;

    return html`
      <div class=${model.highlighted ? 'row highlighted' : 'row'}>
        <button
          aria-controls=${leavesId}
          aria-expanded=${model.expanded ? 'true' : 'false'}
          class="header"
          type="button"
          @click=${() => this.#onToggle(model)}>
          <span class="lead">
            <!-- Icon omitted: the design's leading chapter glyph ('Book' / 'Books' / 'files' /
                 'book-open-cover') is not among the 34 names the bingel-int theme registers. Its
                 16x16 footprint is kept so the label does not shift. Never hand-drawn. -->
            <span aria-hidden="true" class="icon"></span>
            <span class="label">${model.label}</span>
          </span>
          <!-- There is no 'chevron-up' in this theme; the open state rotates 'chevron-down'. -->
          <sl-icon class="chevron" name="chevron-down" size="md"></sl-icon>
        </button>
        ${model.expanded
          ? html`
              <ul class="leaves" id=${leavesId}>
                ${model.leaves.map(leaf => this.#renderLeaf(model, leaf))}
              </ul>
            `
          : nothing}
      </div>
    `;
  }

  #renderLeaf(model: ChapterNavItemModel, leaf: ChapterNavLeaf): TemplateResult {
    return html`
      <li>
        <button
          aria-current=${leaf.selected ? 'page' : nothing}
          class=${leaf.selected ? 'leaf selected' : 'leaf'}
          type="button"
          @click=${() => this.toolSelectEvent.emit({ chapterId: model.id, leafId: leaf.id })}>
          <span class="leaf-label">${leaf.label}</span>
          <span class="badge">
            <span aria-hidden="true">${leaf.count}</span>
            <span class="sr-only">${leaf.count} items in ${leaf.label}</span>
          </span>
        </button>
      </li>
    `;
  }

  #onToggle(model: ChapterNavItemModel): void {
    this.chapterToggleEvent.emit({ chapterId: model.id, expanded: !model.expanded });
  }
}

// Guarded global registration — see the note in the page component about why a type-only import
// would register nothing.
if (!customElements.get('sl-a3mp-chapter-nav-item')) {
  customElements.define('sl-a3mp-chapter-nav-item', A3mpChapterNavItem);
}
