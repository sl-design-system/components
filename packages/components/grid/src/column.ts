import { type ListDataSourceDataItem, ListDataSourcePlaceholder } from '@sl-design-system/data-source';
import {
  type EventEmitter,
  type PathKeys,
  dasherize,
  event,
  getNameByPath,
  getValueByPath
} from '@sl-design-system/shared';
import { type CSSResult, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridColumnHeaderRenderer<T = any> = (column: GridColumn<T>) => string | undefined | TemplateResult;

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

  /** The scoped elements set on this column. */
  #scopedElements: Record<string, typeof HTMLElement> = {};

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

  /** The number of header rows for this column. */
  headerRowCount = 1;

  /** The path to the value for this column. */
  @property() path?: PathKeys<T>;

  /** Custom parts to be set on the `<td>` so it can be styled externally. */
  @property() parts?: string | GridColumnParts<T>;

  /** Renderer function for the column value of each cell. */
  @property({ attribute: false }) renderer?: GridColumnDataRenderer<T>;

  get scopedElements(): Record<string, typeof HTMLElement> {
    return this.#scopedElements;
  }

  /**
   * The custom elements used for rendering this column. Since the rendering the column cells is done
   * in the parent grid component, the custom elements need to be registered in the parent grid.
   */
  @property({ attribute: false })
  set scopedElements(value: Record<string, typeof HTMLElement> | undefined) {
    this.#scopedElements = value ?? {};
  }

  /** Whether this column is sticky when the user scrolls horizontally. */
  @property({ type: Boolean }) sticky?: boolean;

  /** Whether this column is the first or last sticky column. */
  @state() stickyOrder?: 'first' | 'last';

  /** The position where the column should be sticky: at the start of the grid, or at the end. */
  @state() stickyPosition?: 'start' | 'end';

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

  /**
   * This method renders the `<th>` element and all the related attributes, classes and content.
   * Override this method if you want to customize how a header is rendered. Do not override this
   * if you only want to change the classes, contents or parts of the header. See this specific
   * methods for that.
   */
  renderHeaderRow(index: number): TemplateResult | typeof nothing {
    if (index >= this.headerRowCount) {
      return nothing;
    }

    const classes = this.getClasses(),
      parts = ['header', ...this.getParts()];

    return html`
      <th
        class=${ifDefined(classes.length ? classes.join(' ') : undefined)}
        part=${parts.join(' ')}
        role="columnheader"
      >
        ${this.renderHeaderLabel()}
      </th>
    `;
  }

  /**
   * This method renders the label for the header. This is used to render the content of the
   * `<th>` element. Override this method if you want to customize how a header label is rendered.
   * Do not override this if you only want to change the classes, contents or parts of the header.
   */
  renderHeaderLabel(): string | undefined | TemplateResult {
    if (this.header) {
      return typeof this.header === 'string' ? html`<span>${this.header}</span>` : this.header(this);
    } else if (this.path) {
      return html`<span>${getNameByPath(this.path)}</span>`;
    }

    return undefined;
  }

  /**
   * This method renders the `<td>` element and all the related attributes, classes and content.
   * Override this method if you want to customize how a cell is rendered. Do not override this
   * if you only want to change the classes, contents or parts of the cell. See this specific
   * methods for that.
   */
  renderData(item: ListDataSourceDataItem<T>): TemplateResult {
    const classes = this.getClasses(item.data),
      data = this.getDisplayValue(item.data),
      parts = ['data', ...this.getParts(item.data)];

    if (this.ellipsizeText && typeof data === 'string') {
      return html`
        <td class=${ifDefined(classes.length ? classes.join(' ') : undefined)} part=${parts.join(' ')}>
          <sl-ellipsize-text>${data}</sl-ellipsize-text>
        </td>
      `;
    } else {
      return html`
        <td class=${ifDefined(classes.length ? classes.join(' ') : undefined)} part=${parts.join(' ')}>${data}</td>
      `;
    }
  }

  /** Override this method to provide internal styling for a cell. */
  renderStyles(): CSSResult | void {}

  /**
   * Returns an array of strings that are set as class attribute on the `<td>` element.
   * This is used for styling the cells internally. Override this method if you want to add
   * custom classes to the cells.
   */
  getClasses(_item?: T): string[] {
    const classes: string[] = [];

    if (this.sticky && this.stickyOrder && this.stickyPosition) {
      classes.push(`sticky-${this.stickyPosition}-${this.stickyOrder}`);
    }

    return classes;
  }

  /**
   * Returns the display value for the given item. This is used to render the cell content.
   * The logic here is as follows:
   * 1. If a renderer is set, it will be used to render the cell content.
   * 2. If the item is a placeholder, a skeleton will be returned.
   * 3. If a path is set, the value will be retrieved from the item using the path.
   * 4. If no path is set, the value 'No path set' will be returned.
   *
   * Override this method if you want to change the way the cell content is rendered.
   */
  getDisplayValue(item: T): unknown {
    if (this.renderer) {
      return this.renderer(item);
    } else if (item === ListDataSourcePlaceholder) {
      return html`<sl-skeleton style="inline-size: ${Math.max(Math.random() * 100, 30)}%"></sl-skeleton>`;
    } else if (this.path) {
      return getValueByPath(item, this.path);
    } else {
      return 'No path set';
    }
  }

  /**
   * Returns an array of strings that are set as part attributes on the `<td>` element.
   * This is used for styling the cells externally. Override this method if you want to add
   * custom parts to the cells.
   */
  getParts(item?: T): string[] {
    let parts: string[] = [];

    if (typeof this.parts === 'string') {
      parts = this.parts.split(' ');
    } else if (typeof this.parts === 'function' && item) {
      parts = this.parts(item)?.split(' ') ?? [];
    }

    if (item === ListDataSourcePlaceholder) {
      parts.push('placeholder');
    }

    if (this.path) {
      parts.push(dasherize(this.path.replaceAll('.', '-')));
    }

    return parts;
  }
}
