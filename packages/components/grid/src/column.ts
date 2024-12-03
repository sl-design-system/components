import { FetchDataSourcePlaceholder } from '@sl-design-system/data-source';
import {
  type EventEmitter,
  type PathKeys,
  dasherize,
  event,
  getNameByPath,
  getValueByPath
} from '@sl-design-system/shared';
import { type CSSResult, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { type Grid } from './grid.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-column-update': SlColumnUpdateEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-grid-column': GridColumn;
  }
}

/** Custom for aligning the content in the cells. */
export type GridColumnAlignment = 'start' | 'center' | 'end';

/** Custom renderer type for column headers. */
export type GridColumnHeaderRenderer = () => string | undefined | TemplateResult;

/** Custom renderer type for column cells. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridColumnDataRenderer<T = any> = (model: T) => string | undefined | TemplateResult;

/** Custom type for providing parts to a cell. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridColumnParts<T = any> = (model: T) => string | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlColumnUpdateEvent<T = any> = CustomEvent<{ grid: Grid; column: GridColumn<T> }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridColumn<T = any> extends LitElement {
  /** The parent grid. */
  #grid?: Grid<T>;

  /** The state changed event callback. */
  #onStateChanged = () => this.stateChanged();

  /** Actual width of the column. */
  #width?: number;

  /** The alignment of the content within the column. */
  @property() align?: GridColumnAlignment;

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

  /** @internal Emits when the column definition has changed. */
  @event({ name: 'sl-column-update' }) columnUpdateEvent!: EventEmitter<SlColumnUpdateEvent<T>>;

  /** This will ellipsize the text in the `<td>` elements when it overflows. */
  @property({ type: Boolean, attribute: 'ellipsize-text' }) ellipsizeText?: boolean;

  /** The parent grid instance. */
  @property({ attribute: false })
  set grid(value: Grid<T> | undefined) {
    this.#grid?.removeEventListener('sl-grid-state-change', this.#onStateChanged);
    this.#grid = value;
    this.#grid?.addEventListener('sl-grid-state-change', this.#onStateChanged);
  }

  get grid(): Grid<T> | undefined {
    return this.#grid;
  }

  /**
   * The ratio with which the column will grow relative to the other columns.
   * A ratio of 0 means the column width is fixed.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow}
   */
  @property({ type: Number }) grow = 1;

  /** The label for the column header. Can contain custom HTML. */
  @property() header?: string | GridColumnHeaderRenderer;

  /** The path to the value for this column. */
  @property() path?: PathKeys<T>;

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
  @property({ type: Boolean }) sticky?: boolean;

  /** Whether this column is the first or last sticky column. */
  @state() stickyOrder?: 'first' | 'last';

  /** The position where the column should be sticky: at the start of the grid, or at the end. */
  @state() stickyPosition?: 'start' | 'end';

  @state() selected?: boolean;

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

  override disconnectedCallback(): void {
    this.#grid?.removeEventListener('sl-grid-state-change', this.#onStateChanged);
    this.#grid = undefined;

    super.disconnectedCallback();
  }

  /**
   * This method is called when the contents of the grid has changed.
   * This happens when the items property is directly set or when the data source has changed.
   */
  itemsChanged(): void {}

  /**
   * This method is called when the state of the grid has changed.
   * This happens for examples when a filter or sorting changes.
   */
  stateChanged(): void {}

  renderHeader(): TemplateResult {
    const classes = this.getClasses(),
      parts = ['header', ...this.getParts()];

    return html`<th class=${classes.join(' ')} part=${parts.join(' ')}>${this.header ?? getNameByPath(this.path)}</th>`;
  }

  renderData(item: T): TemplateResult {
    const classes = this.getClasses(item),
      parts = ['data', ...this.getParts(item)];

    let data: unknown;
    if (this.renderer) {
      data = this.renderer(item);
    } else if (item === FetchDataSourcePlaceholder) {
      data = html`<sl-skeleton style="inline-size: ${Math.max(Math.random() * 100, 30)}%"></sl-skeleton>`;
    } else if (this.path) {
      data = getValueByPath(item, this.path);
    }

    if (this.ellipsizeText && typeof data === 'string') {
      return html`
        <td class=${classes.join(' ')} part=${parts.join(' ')}>
          <sl-ellipsize-text>${data}</sl-ellipsize-text>
        </td>
      `;
    } else {
      return html`<td class=${classes.join(' ')} part=${parts.join(' ')}>${data || 'No path set'}</td>`;
    }
  }

  renderStyles(): CSSResult | void {}

  getClasses(_item?: T): string[] {
    const classes: string[] = [];

    if (this.sticky && this.stickyOrder && this.stickyPosition) {
      classes.push(`sticky-${this.stickyPosition}-${this.stickyOrder}`);
    }

    return classes;
  }

  getParts(item?: T): string[] {
    let parts: string[] = [];

    if (typeof this.parts === 'string') {
      parts = this.parts.split(' ');
    } else if (typeof this.parts === 'function' && item) {
      parts = this.parts(item)?.split(' ') ?? [];
    }

    if (item === FetchDataSourcePlaceholder) {
      parts.push('placeholder');
    }

    if (this.path) {
      parts.push(dasherize(this.path.replaceAll('.', '-')));
    }

    return parts;
  }
}
