import type { CSSResult, PropertyValues, TemplateResult } from 'lit';
import type { EventEmitter } from '@sl-design-system/shared';
import { EventsController, dasherize, event, getNameByPath, getValueByPath } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { type Grid, GridEvent } from './grid.js';

/** Custom for aligning the content in the cells. */
export type GridColumnAlignment = 'start' | 'center' | 'end';

/** Custom renderer type for column headers. */
export type GridColumnHeaderRenderer = () => string | undefined | TemplateResult;

/** Custom renderer type for column cells. */
export type GridColumnDataRenderer<T> = (model: T) => string | undefined | TemplateResult;

/** Custom type for providing parts to a cell. */
export type GridColumnParts<T> = (model: T) => string | undefined;

export class GridColumnEvent<T> extends GridEvent<T> {
  constructor(type: string, public readonly column: GridColumn<T>) {
    super(type, column.grid!);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridColumn<T = any> extends LitElement {
  #events = new EventsController(this);

  /** Actual width of the column. */
  #width?: number;

  /** The alignment of the content within the column. */
  @property() align: GridColumnAlignment = 'start';

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
  @event() columnUpdate!: EventEmitter<GridColumnEvent<T>>;

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
  @property({ type: Number })
  get width(): number | undefined {
    return this.#width;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // If width and autoWidth are not set, set autoWidth to true
    if (this.width === undefined && this.autoWidth === undefined) {
      this.autoWidth = true;
    }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('grid') && this.grid) {
      this.#events.listen(this.grid, 'sl-grid-items-change', this.itemsChanged);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  itemsChanged(): void {}

  renderHeader(): TemplateResult {
    const parts = ['header', ...this.#getParts()];

    return html`<th part=${parts.join(' ')}>${this.header ?? getNameByPath(this.path)}</th>`;
  }

  renderData(item: T): TemplateResult {
    const parts = ['data', ...this.#getParts(item)];

    return html`
      <td part=${parts.join(' ')}>
        ${this.renderer ? this.renderer(item) : this.path ? getValueByPath(item, this.path) : 'No path set'}
      </td>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  renderStyles(): CSSResult | void {}

  #getParts(item?: T): string[] {
    let parts: string[] = [];

    if (typeof this.parts === 'string') {
      parts = this.parts.split(' ');
    } else if (typeof this.parts === 'function' && item) {
      parts = this.parts(item)?.split(' ') ?? [];
    }

    if (this.path) {
      parts.push(dasherize(this.path.replaceAll('.', '-')));
    }

    return parts;
  }
}
