import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './table-footer.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a10-page-change': SlA10PageChangeEvent;
    'sl-a10-page-size-change': SlA10PageSizeChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a10-user-table-footer': A10UserTableFooter;
  }
}

/** The paging slice of the user table's domain model. Owned by the page, rendered here. */
export interface TablePageModel {
  /** Zero-based index of the page currently shown. */
  page: number;
  /** How many rows a single page holds. */
  pageSize: number;
  /** How many rows the (unpaged) result set holds in total. */
  totalItems: number;
}

/**
 * Emitted with the zero-based index of the page the user asked for.
 *
 * The `sl-a10-` prefix is load-bearing: `@sl-design-system/paginator` already declares
 * `sl-page-change` in `GlobalEventHandlersEventMap`, and redeclaring that key with a different
 * payload is a duplicate-identifier build break, not a naming preference.
 */
export type SlA10PageChangeEvent = CustomEvent<number>;

/**
 * Emitted with the page size the user picked.
 *
 * Prefixed `sl-a10-` for the same reason as {@link SlA10PageChangeEvent}: `sl-page-size-change`
 * is already claimed by `@sl-design-system/paginator`.
 */
export type SlA10PageSizeChangeEvent = CustomEvent<number>;

/**
 * Structural config, not data: the page sizes this footer offers are a property of the control,
 * so they live here as a module-level constant rather than arriving through the model.
 */
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * The pagination bar pinned to the bottom edge of the FAM user table: a rows-per-page picker,
 * a range/total status read-out and a previous/next pair.
 *
 * Purely presentational — every value it shows is derived from `model`, and it emits intent
 * rather than paging itself. The data-owning page applies the new page / page size and feeds a
 * fresh `model` back in.
 *
 * This is a hand-port rather than `<sl-paginator>`: the paginator always renders numbered page
 * buttons and an `<sl-select>` page picker that this design has neither of, and
 * `<sl-paginator-status>` renders `"1 - 1 of 1 items"` (spaced hyphens plus a mandatory item
 * noun), which cannot be shaped into `1-3 of 3` through any `itemLabel`.
 *
 * ```html
 * <sl-a10-user-table-footer .model=${page}></sl-a10-user-table-footer>
 * ```
 *
 * @fires sl-a10-page-change - Emitted with the zero-based index of the requested page.
 * @fires sl-a10-page-size-change - Emitted with the newly picked page size.
 */
export class A10UserTableFooter extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The page, page size and total item count this footer renders. */
  @property({ attribute: false }) model!: TablePageModel;

  /** Emits when the user steps to the previous or next page. */
  @event({ name: 'sl-a10-page-change' }) pageChangeEvent!: EventEmitter<SlA10PageChangeEvent>;

  /** Emits when the user picks a different number of rows per page. */
  @event({ name: 'sl-a10-page-size-change' })
  pageSizeChangeEvent!: EventEmitter<SlA10PageSizeChangeEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    // The status text is COMPUTED, not transcribed. The design's literal reads "1-1 of 1" while
    // the table above it shows three rows, so the mock-up contradicts itself. Computing
    // `start`-`end` of `totalItems` makes the design's own data read "1-3 of 3". This is an
    // intentional, recorded deviation from the design's literal text: hardcoding the Figma
    // string would ship a footer that contradicts its own table.
    const { page, pageSize, totalItems } = this.model,
      lastPage = Math.max(0, Math.ceil(totalItems / pageSize) - 1),
      start = totalItems === 0 ? 0 : page * pageSize + 1,
      end = Math.min((page + 1) * pageSize, totalItems);

    return html`
      <div class="footer">
        <label class="rows-label" for="page-size">Rows per page:</label>

        <div class="page-size">
          <select @change=${this.#onPageSizeChange} id="page-size">
            ${PAGE_SIZE_OPTIONS.map(
              size => html`
                <option .selected=${size === pageSize} value=${size}>${size}</option>
              `
            )}
          </select>
          <!--
            Substitution: the design uses the Material Icons glyph "arrow_drop_down", which this
            theme does not ship. "caret-down-solid" is the nearest of the 54 registered icons.
            A Material -> Font Awesome family change is a real visual difference, recorded.
          -->
          <sl-icon name="caret-down-solid"></sl-icon>
        </div>

        <!--
          role="status" (implicitly aria-live="polite") partially restores the live announcement
          sl-paginator-status would have made through its announce() call, which this hand-port
          gives up. See the comment above the computation for why the range is derived, not
          transcribed from the design's self-contradictory "1-1 of 1".
        -->
        <span class="status" role="status">${start}-${end} of ${totalItems}</span>

        <!--
          A pagination "nav" is not one of the page-level singleton landmarks the host app owns,
          so a labelled "<nav>" here is safe (unlike "<main>", which is never generated).
        -->
        <nav aria-label="Pagination">
          <!--
            Substitution: the design uses the Material Icons glyph "chevron_left"; "chevron-left"
            is the registered Font Awesome equivalent. Family change recorded.
          -->
          <sl-button
            @click=${this.#onPrevious}
            aria-label="Previous page"
            ?disabled=${page === 0}
            fill="ghost"
            shape="pill"
          >
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>

          <!--
            Substitution: the design uses the Material Icons glyph "navigate_next";
            "chevron-right" is the registered Font Awesome equivalent. Family change recorded.
          -->
          <sl-button
            @click=${this.#onNext}
            aria-label="Next page"
            ?disabled=${page >= lastPage}
            fill="ghost"
            shape="pill"
          >
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </nav>
      </div>
    `;
  }

  #onPageSizeChange(event: Event): void {
    this.pageSizeChangeEvent.emit(Number((event.target as HTMLSelectElement).value));
  }

  #onPrevious(): void {
    this.pageChangeEvent.emit(Math.max(0, this.model.page - 1));
  }

  #onNext(): void {
    const { page, pageSize, totalItems } = this.model,
      lastPage = Math.max(0, Math.ceil(totalItems / pageSize) - 1);

    this.pageChangeEvent.emit(Math.min(lastPage, page + 1));
  }
}
