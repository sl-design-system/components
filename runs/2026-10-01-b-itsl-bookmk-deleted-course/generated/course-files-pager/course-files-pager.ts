import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './course-files-pager.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-course-files-page-change': SlCourseFilesPageChangeEvent;
    'sl-course-files-page-size-change': SlCourseFilesPageSizeChangeEvent;
  }
}

/**
 * The paging slice of the course files domain model. Data only — every label this component
 * shows is derived from these numbers inside its own `render`.
 *
 * `page` is **0-based**; the pager renders it as the 1-based page number the design shows.
 */
export interface CourseFilesPagerModel {
  page: number;
  pageSize: number;
  totalItems: number;
}

/** Emitted with the requested 0-based page index. */
export type SlCourseFilesPageChangeEvent = CustomEvent<number>;

/** Emitted with the requested number of items per page. */
export type SlCourseFilesPageSizeChangeEvent = CustomEvent<number>;

/**
 * Structural config: the page sizes this pager offers, in order. Not model data — the parent
 * says *where we are in the list*, this component knows *which page sizes it offers*.
 */
const PAGE_SIZES = [10, 25, 50, 100];

/**
 * The pager below the course files table: a previous/next pair around the numbered page links,
 * the "1 to 10 of 47" range status, and the items-per-page select.
 *
 * Presentational — the page owns the paging state and passes it in as `model`, and handles the
 * page / page size events this component emits.
 *
 * ```html
 * <sl-course-files-pager .model=${{ page: 0, pageSize: 10, totalItems: 47 }}></sl-course-files-pager>
 * ```
 *
 * @csspart pager - The `<nav>` holding the previous/next buttons and the numbered page links.
 * @csspart page - Every numbered page button.
 * @csspart page-current - The numbered page button for the page currently being shown.
 * @csspart status - The live range status ("1 to 10 of 47").
 * @csspart page-size - The items-per-page select.
 *
 * @fires sl-course-files-page-change - Emitted with the requested 0-based page index.
 * @fires sl-course-files-page-size-change - Emitted with the requested number of items per page.
 */
export class CourseFilesPager extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-option': Option,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits the 0-based index of the page the user asked for. */
  @event({ name: 'sl-course-files-page-change' })
  pageChangeEvent!: EventEmitter<SlCourseFilesPageChangeEvent>;

  /** @internal Emits the number of items per page the user asked for. */
  @event({ name: 'sl-course-files-page-size-change' })
  pageSizeChangeEvent!: EventEmitter<SlCourseFilesPageSizeChangeEvent>;

  /** Where we currently are in the list: the 0-based page, the page size and the total. */
  @property({ attribute: false }) model!: CourseFilesPagerModel;

  /** The number of page links to render; at least 1, even for an empty list. */
  get #pageCount(): number {
    const { pageSize = PAGE_SIZES[0], totalItems = 0 } = this.model ?? {};

    return Math.max(1, Math.ceil(totalItems / pageSize));
  }

  /**
   * The page actually being shown, clamped into the rendered range. A stale `page` from the parent
   * must never highlight a link that isn't rendered — and the click handlers must step from the
   * same value the user sees highlighted, or a bound button emits an index the parent clamps
   * straight back and looks dead.
   */
  get #currentPage(): number {
    return Math.min(Math.max(this.model?.page ?? 0, 0), this.#pageCount - 1);
  }

  override render(): TemplateResult {
    const { pageSize = PAGE_SIZES[0], totalItems = 0 } = this.model ?? {},
      pageCount = this.#pageCount,
      currentPage = this.#currentPage,
      start = totalItems === 0 ? 0 : currentPage * pageSize + 1,
      end = Math.min((currentPage + 1) * pageSize, totalItems);

    return html`
      <nav part="pager" aria-label="Pagination">
        <ul>
          <li>
            <button
              class="step"
              type="button"
              aria-label="Previous page"
              aria-disabled=${String(currentPage === 0)}
              @click=${this.#onPrevious}
            >
              <sl-icon name="chevron-left" size="xl" aria-hidden="true"></sl-icon>
            </button>
          </li>
          ${Array.from({ length: pageCount }, (_, index) => {
            const current = index === currentPage;

            return html`
              <li>
                <button
                  part=${current ? 'page page-current' : 'page'}
                  type="button"
                  aria-current=${ifDefined(current ? 'page' : undefined)}
                  @click=${() => this.#onPage(index)}
                >
                  ${index + 1}
                </button>
              </li>
            `;
          })}
          <li>
            <button
              class="step"
              type="button"
              aria-label="Next page"
              aria-disabled=${String(currentPage >= pageCount - 1)}
              @click=${this.#onNext}
            >
              <sl-icon name="chevron-right" size="xl" aria-hidden="true"></sl-icon>
            </button>
          </li>
        </ul>
      </nav>

      <div class="control">
        <span part="status" aria-live="polite">${start} to ${end} of ${totalItems}</span>

        <sl-select
          part="page-size"
          aria-label="Items per page"
          .value=${pageSize}
          @sl-change=${this.#onPageSizeChange}
        >
          ${PAGE_SIZES.map(size => html`<sl-option .value=${size}>${size}</sl-option>`)}
        </sl-select>
      </div>
    `;
  }

  /**
   * The step buttons stay focusable at the bounds (aria-disabled, not disabled) so the browser
   * never blurs the button the user is standing on to the body. aria-disabled does not block
   * activation, so the no-op lives here.
   */
  #onPrevious(): void {
    const currentPage = this.#currentPage;

    if (currentPage === 0) {
      return;
    }

    this.pageChangeEvent.emit(currentPage - 1);
  }

  #onNext(): void {
    const currentPage = this.#currentPage;

    if (currentPage >= this.#pageCount - 1) {
      return;
    }

    this.pageChangeEvent.emit(currentPage + 1);
  }

  #onPage(index: number): void {
    if (index !== this.#currentPage) {
      this.pageChangeEvent.emit(index);
    }
  }

  #onPageSizeChange(event: SlChangeEvent<number>): void {
    if (typeof event.detail === 'number' && event.detail !== this.model?.pageSize) {
      this.pageSizeChangeEvent.emit(event.detail);
    }
  }
}
