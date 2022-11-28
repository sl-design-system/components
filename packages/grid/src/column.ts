import type { TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { getNameByPath, getValueByPath } from './utils.js';

export type GridColumnRenderer<T> = (model: T) => TemplateResult;

export class GridColumn<T extends { [x: string]: unknown } = Record<string, unknown>> extends LitElement {
  /**
   * Automatically sets the width of the column based on the column contents when this is set to `true`.
   *
   * For performance reasons the column width is calculated automatically only once when the grid items
   * are rendered for the first time and the calculation only considers the rows which are currently
   * rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell
   * content changes, the column width might not match the contents anymore.
   *
   * Hidden columns are ignored in the calculation and their widths are not automatically updated when
   * you show a column that was initially hidden.
   *
   * You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.
   *
   * The column width may still grow larger when `grow` is not 0.
   */
  @property({ type: Boolean, attribute: 'auto-width' }) autoWidth?: boolean;

  /**
   * The ratio with which the column will grow relative to the other columns.
   * A ratio of 0 means the column width is fixed.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow}
   */
  @property({ type: Number }) grow = 1;

  /** The label for the column header. */
  @property() header?: string;

  /** The path to the value for this column. */
  @property() path?: string;

  /** Renderer function for the column value of each cell. */
  @property({ attribute: false }) renderer?: GridColumnRenderer<T>;

  /** Whether this column is sticky when the user scrolls horizontally. */
  @property({ type: Boolean, reflect: true }) sticky?: boolean;

  /** Width of the cells for this column in pixels. */
  @property() width?: number;

  override connectedCallback(): void {
    super.connectedCallback();

    // If width and autoWidth are not set, set autoWidth to true
    if (!this.width && this.autoWidth === undefined) {
      this.autoWidth = true;
    }
  }

  renderHeader(): TemplateResult {
    return html`<th>${this.header ?? getNameByPath(this.path)}</th>`;
  }

  renderData(item: T): TemplateResult {
    if (this.renderer) {
      return html`<td>${this.renderer(item)}</td>`;
    } else {
      return html`<td>${this.path ? getValueByPath(item, this.path) : 'No path set'}</td>`;
    }
  }
}
