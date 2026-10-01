import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Option, Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './paginator.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a6-page-change': SlA6PageChangeEvent;
    'sl-a6-page-size-change': SlA6PageSizeChangeEvent;
  }
}

/** The data this component renders; owned by `sl-a6-file-browser`. `page` is 0-based. */
export interface PaginatorModel {
  page: number;
  pageSize: number;
  totalItems: number;
}

export type SlA6PageChangeEvent = CustomEvent<number>;
export type SlA6PageSizeChangeEvent = CustomEvent<number>;

/**
 * The page sizes offered. Structure, not data — the design reveals only `10`, but the list is a
 * property of the control, not of the folder.
 */
const PAGE_SIZES = [10, 25, 50, 100] as const;

/**
 * The range sentence the design draws: `1 to 10 of 47`.
 *
 * Exported so `sl-a6-file-browser` can render the identical string in its own toolbar without
 * duplicating the arithmetic. With 0-based `page`:
 *   start = page * pageSize + 1          → 0 * 10 + 1 = 1
 *   end   = min((page + 1) * pageSize, totalItems) → min(10, 47) = 10
 */
export function formatItemRange(page: number, pageSize: number, totalItems: number): string {
  const start = totalItems === 0 ? 0 : page * pageSize + 1,
    end = Math.min((page + 1) * pageSize, totalItems);

  return `${start} to ${end} of ${totalItems}`;
}

/**
 * Figma `Pagination` `4411:11863` → `5512:7934`, 664 x 40 — previous/next controls, the page
 * links, the item-range sentence and a page-size select.
 *
 * `page` is 0-based in both the model and the event payload, matching
 * `packages/components/paginator/src/paginator.ts`; the labels add 1.
 *
 * **`sl-paginator`, `sl-paginator-status` and `sl-paginator-page-size` are deliberately not
 * used.** Six mismatches, none reachable through their public APIs: `sl-paginator` hardcodes
 * `caret-left-solid`/`caret-right-solid` where this design draws `chevron-left`/`chevron-right`;
 * `sl-paginator-status` emits a baked `"1 - 10 of 47 items"` where the design says
 * `"1 to 10 of 47"`; `sl-paginator-page-size` always renders a visible
 * `<sl-label>Items per page:</sl-label>` where the design has a bare select; the active-page fill
 * is the theme's green where the design is purple; `.page` is a square chip
 * (`inline-size: calc(1lh + …)`, `padding-inline: 0`) where the design is 40px tall with 16px
 * side padding; and that fill is driven by private `--_bg-color` / `--_bg-mix-color` /
 * `--_bg-opacity`. Reaching past a public API is not allowed here, so the bar is built from
 * `sl-button`, `sl-icon`, `sl-select` and `sl-option`. An earlier itslearning run reached the
 * same conclusion independently.
 *
 * ```html
 * <sl-a6-paginator .model=${model}></sl-a6-paginator>
 * ```
 *
 * @fires sl-a6-page-change - Emitted with the new 0-based page index.
 * @fires sl-a6-page-size-change - Emitted with the new page size.
 */
export class A6Paginator extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-option': Option,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The current page, page size and total item count. */
  @property({ attribute: false }) model?: PaginatorModel;

  /** @internal Emits the new 0-based page index. */
  @event({ name: 'sl-a6-page-change' })
  pageChangeEvent!: EventEmitter<SlA6PageChangeEvent>;

  /** @internal Emits the new page size. */
  @event({ name: 'sl-a6-page-size-change' })
  pageSizeChangeEvent!: EventEmitter<SlA6PageSizeChangeEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    const { page, pageSize, totalItems } = model,
      // 47 items at 10 per page = 5 pages. Derived, never hardcoded: the design happens to show
      // exactly pages 1-5 because that is the whole range at this size.
      pageCount = Math.max(1, Math.ceil(totalItems / pageSize)),
      pages = Array.from({ length: pageCount }, (_, index) => index);

    return html`
      <nav aria-label="Pagination">
        <ul class="pager">
          <li>
            <sl-button
              @click=${() => this.#onPageClick(page - 1)}
              ?disabled=${page <= 0}
              aria-label="Previous page"
              class="step"
              fill="ghost">
              <sl-icon name="chevron-left" size="xl"></sl-icon>
            </sl-button>
          </li>
          ${pages.map(
            index => html`
              <li>
                <button
                  @click=${() => this.#onPageClick(index)}
                  aria-current=${index === page ? 'page' : false}
                  aria-label=${`Page ${index + 1}`}
                  class="page"
                  type="button">
                  ${index + 1}
                </button>
              </li>
            `
          )}
          <li>
            <sl-button
              @click=${() => this.#onPageClick(page + 1)}
              ?disabled=${page >= pageCount - 1}
              aria-label="Next page"
              class="step"
              fill="ghost">
              <sl-icon name="chevron-right" size="xl"></sl-icon>
            </sl-button>
          </li>
        </ul>
      </nav>
      <div class="control">
        <span class="range">${formatItemRange(page, pageSize, totalItems)}</span>
        <!--
          The design draws a filled 'caret-down'. sl-select renders 'chevron-down' and exposes no
          'icon' property, so the glyph differs by one shape. Accepted rather than reached around.
          The select carries no visible label in the design, so it needs an explicit one.
        -->
        <sl-select
          @sl-change=${this.#onPageSizeChange}
          .value=${pageSize}
          aria-label="Items per page"
          class="page-size">
          ${PAGE_SIZES.map(size => html`<sl-option .value=${size}>${size}</sl-option>`)}
        </sl-select>
      </div>
    `;
  }

  #onPageClick(index: number): void {
    const pageCount = this.model ? Math.ceil(this.model.totalItems / this.model.pageSize) : 1;

    if (index < 0 || index > pageCount - 1 || index === this.model?.page) {
      return;
    }

    this.pageChangeEvent.emit(index);
  }

  #onPageSizeChange(event: Event & { detail?: unknown }): void {
    const size = Number(event.detail);

    if (!Number.isNaN(size) && size > 0) {
      this.pageSizeChangeEvent.emit(size);
    }
  }
}
