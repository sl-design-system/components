import type { TemplateResult } from 'lit';
import type { Grid } from './grid.js';
import type { EventEmitter } from '@sl-design-system/shared';
import { dasherize, event, getNameByPath, getValueByPath } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export type GridColumnHeaderRenderer = () => string | undefined | TemplateResult;

export type GridColumnDataRenderer<T> = (model: T) => string | undefined | TemplateResult;

export type GridColumnParts<T> = (model: T) => string | undefined;

export class GridColumn<T extends Record<string, unknown> = Record<string, unknown>> extends LitElement {
  #width?: number;

  /** The alignment of the content within the column. */
  @property() align: 'start' | 'center' | 'end' = 'start';

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

  /** Emits when the column definition has changed. */
  @event() columnUpdate!: EventEmitter<void>;

  /** The parent grid instance. */
  @property({ attribute: false }) grid?: Grid<T>;

  /**
   * The ratio with which the column will grow relative to the other columns.
   * A ratio of 0 means the column width is fixed.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow}
   */
  @property({ type: Number }) grow = 1;

  /** The label for the column header. */
  @property() header?: string | GridColumnHeaderRenderer;

  /** The path to the value for this column. */
  @property() path?: string;

  /** Custom parts to be set on the `<td>` so it can be styled externally. */
  @property() parts?: string | GridColumnParts<T>;

  /** Renderer function for the column value of each cell. */
  @property({ attribute: false }) renderer?: GridColumnDataRenderer<T>;

  /**
   * The custom elements used for rendering this column. Since the rendering the column cells is done
   * in the parent grid component, the custom elements need to be registered in the parent grid.
   */
  @property({ attribute: false }) scopedElements?: Record<string, typeof HTMLElement>;

  /** Whether this column is sticky when the user scrolls horizontally. */
  @property({ type: Boolean, reflect: true }) sticky?: boolean;

  set width(value: number | undefined) {
    this.#width = value;
  }

  /** Width of the cells for this column in pixels. */
  @property()
  get width(): number | undefined {
    return this.#width;
  }

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
    let parts;

    if (typeof this.parts === 'string') {
      parts = this.parts;
    } else if (typeof this.parts === 'function') {
      parts = this.parts(item);
    }

    if (this.path) {
      parts = `${dasherize(this.path.replaceAll('.', '-'))} ${parts || ''}`.trim();
    }

    return html`
      <td part=${ifDefined(parts)}>
        ${this.renderer ? this.renderer(item) : this.path ? getValueByPath(item, this.path) : 'No path set'}
      </td>
    `;
  }
}
