import '@sl-design-system/search-field/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
// Bare import for the side effect only — see the note in the page component.
import './chapter-nav-item/a3mp-chapter-nav-item.js';
import { type ChapterNavItemModel } from './chapter-nav-item/a3mp-chapter-nav-item.js';
import styles from './a3mp-chapter-nav-column.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a3mp-search-change': SlA3mpSearchChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a3mp-chapter-nav': A3mpChapterNav;
  }
}

/** Emitted when the search field's value changes. */
export type SlA3mpSearchChangeEvent = CustomEvent<{ value: string }>;

/** The data the chapter navigation renders; owned by the page. */
export interface ChapterNavModel {
  /** The search field's placeholder, as drawn: `'Search by name'`. */
  searchPlaceholder: string;
  /** The chapter rows, in display order. */
  chapters: ChapterNavItemModel[];
}

/**
 * The left column: a search field over a list of chapter rows, one of which is expanded to show
 * its tool leaves. Presentational — the page owns the model and the expanded/selected state.
 *
 * ```html
 * <sl-a3mp-chapter-nav .model=${nav}></sl-a3mp-chapter-nav>
 * ```
 *
 * @fires sl-a3mp-search-change - Emitted when the search value changes.
 */
export class A3mpChapterNav extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the search value changes. */
  @event({ name: 'sl-a3mp-search-change' }) searchChangeEvent!: EventEmitter<SlA3mpSearchChangeEvent>;

  /**
   * The search placeholder and chapter rows.
   *
   * @default undefined
   */
  @property({ attribute: false }) model?: ChapterNavModel;

  override render(): TemplateResult {
    const chapters = this.model?.chapters ?? [];

    return html`
      <nav aria-label="Chapters and materials">
        <!-- 'sl-search-field' renders '<sl-icon name="search">' internally, and 'search' is NOT
             among the 34 icon names the bingel-int theme registers — so its prefix icon is blank
             here. That is a design-system/theme gap, recorded as a Stage 4 discrepancy rather
             than patched from this component. -->
        <sl-search-field
          placeholder=${this.model?.searchPlaceholder ?? ''}
          @sl-change=${this.#onSearch}
          @sl-clear=${() => this.searchChangeEvent.emit({ value: '' })}>
        </sl-search-field>
        <ul>
          ${chapters.map(
            chapter => html`
              <li>
                <sl-a3mp-chapter-nav-item .model=${chapter}></sl-a3mp-chapter-nav-item>
              </li>
            `
          )}
        </ul>
      </nav>
    `;
  }

  #onSearch(event: Event & { detail?: unknown }): void {
    this.searchChangeEvent.emit({ value: String(event.detail ?? '') });
  }
}

// Guarded global registration.
if (!customElements.get('sl-a3mp-chapter-nav')) {
  customElements.define('sl-a3mp-chapter-nav', A3mpChapterNav);
}
