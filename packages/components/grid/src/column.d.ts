import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { type EventEmitter, type PathKeys } from '@sl-design-system/shared';
import { type CSSResult, LitElement, type TemplateResult, nothing } from 'lit';
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
export type GridColumnHeaderRenderer<T = any> = (
  column: GridColumn<T>
) => string | undefined | TemplateResult;
/** Custom renderer type for column cells. */
export type GridColumnDataRenderer<T = any> = (model: T) => string | undefined | TemplateResult;
/** Custom type for providing parts to a cell. */
export type GridColumnParts<T = any> = (model: T) => string | undefined;
/**
 * Callback that returns additional row context appended to the column label for form controls
 * inside a cell. Return only the row context (e.g. "John Doe"), not the full label.
 */
export type GridColumnFormControlLabel<T = any> = (model: T) => string | undefined;
export type SlColumnUpdateEvent<T = any> = CustomEvent<{
  grid: Grid;
  column: GridColumn<T>;
}>;
export declare class GridColumn<T = any> extends LitElement {
  #private;
  /** The alignment of the content within the column. */
  align?: GridColumnAlignment;
  /**
   * Automatically sets the width of the column based on the column contents when this is set to
   * `true`.
   *
   * For performance reasons the column width is calculated automatically only once when the grid
   * items are rendered for the first time and the calculation only considers the rows which are
   * currently rendered in DOM (a bit more than what is currently visible). If the grid is scrolled,
   * or the cell content changes, the column width might not match the contents anymore.
   *
   * Hidden columns are ignored in the calculation and their widths are not automatically updated
   * when you show a column that was initially hidden.
   *
   * You can manually trigger the auto sizing behavior again by calling
   * `grid.recalculateColumnWidths()`.
   *
   * The column width may still grow larger when `grow` is not 0.
   */
  autoWidth?: boolean;
  /**
   * @internal The internal scoped elements for this column. This is defined separately so it doesn't
   * get overridden by the public `scopedElements` property.
   */
  get baseScopedElements(): Record<string, typeof HTMLElement>;
  /** @internal Emits when the column definition has changed. */
  columnUpdateEvent: EventEmitter<SlColumnUpdateEvent<T>>;
  /** This will ellipsize the text in the `<td>` elements when it overflows. */
  ellipsizeText?: boolean;
  /** Optional column label for form controls rendered inside a cell. */
  formControlColumnLabel?: string;
  /** Optional row context to add to form controls rendered inside a cell. */
  formControlLabel?: GridColumnFormControlLabel<T>;
  /** The parent grid instance. */
  set grid(value: Grid<T> | undefined);
  get grid(): Grid<T> | undefined;
  /**
   * The ratio with which the column will grow relative to the other columns. A ratio of 0 means the
   * column width is fixed.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow}
   */
  grow: number;
  /** The label for the column header. Can contain custom HTML. */
  header?: string | GridColumnHeaderRenderer;
  /** Whether the column header text should be visually hidden. */
  hideHeaderText?: boolean;
  /** The number of header rows for this column. */
  headerRowCount: number;
  /** The path to the value for this column. */
  path?: PathKeys<T>;
  /** Custom parts to be set on the `<td>` so it can be styled externally. */
  parts?: string | GridColumnParts<T>;
  /** Renderer function for the column value of each cell. */
  renderer?: GridColumnDataRenderer<T>;
  get scopedElements(): Record<string, typeof HTMLElement>;
  /**
   * The custom elements used for rendering this column. Since the rendering the column cells is
   * done in the parent grid component, the custom elements need to be registered in the parent
   * grid.
   */
  set scopedElements(value: Record<string, typeof HTMLElement> | undefined);
  /** Whether this column is sticky when the user scrolls horizontally. */
  sticky?: boolean;
  /** Whether this column is the first or last sticky column. */
  stickyOrder?: 'first' | 'last';
  /** The position where the column should be sticky: at the start of the grid, or at the end. */
  stickyPosition?: 'start' | 'end';
  set width(value: number | undefined);
  /** Width of the cells for this column in pixels. */
  get width(): number | undefined;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  /**
   * This method is called when the contents of the grid has changed. This happens when the items
   * property is directly set or when the data source has changed.
   */
  itemsChanged(): void;
  /**
   * This method is called when the state of the grid has changed. This happens for examples when a
   * filter or sorting changes.
   */
  stateChanged(): void;
  /**
   * This method renders the `<th>` element and all the related attributes, classes and content.
   * Override this method if you want to customize how a header is rendered. Do not override this if
   * you only want to change the classes, contents or parts of the header. See this specific methods
   * for that.
   */
  renderHeaderRow(index: number): TemplateResult | typeof nothing;
  /**
   * This method renders the label for the header. This is used to render the content of the `<th>`
   * element. Override this method if you want to customize how a header label is rendered. Do not
   * override this if you only want to change the classes, contents or parts of the header.
   */
  renderHeaderLabel(): string | undefined | TemplateResult;
  /**
   * This method renders the `<td>` element and all the related attributes, classes and content.
   * Override this method if you want to customize how a cell is rendered. Do not override this if
   * you only want to change the classes, contents or parts of the cell. See this specific methods
   * for that.
   */
  renderData(item: ListDataSourceDataItem<T>): TemplateResult;
  /** Override this method to provide internal styling for a cell. */
  renderStyles(): CSSResult | void;
  /**
   * Returns an array of strings that are set as class attribute on the `<td>` element. This is used
   * for styling the cells internally. Override this method if you want to add custom classes to the
   * cells.
   */
  getClasses(_item?: T): string[];
  /**
   * Returns the display value for the given item. This is used to render the cell content. The
   * logic here is as follows: 1. If a renderer is set, it will be used to render the cell content.
   * 2. If the item is a placeholder, a skeleton will be returned. 3. If a path is set, the value
   * will be retrieved from the item using the path. 4. If no path is set, the value 'No path set'
   * will be returned.
   *
   * Override this method if you want to change the way the cell content is rendered.
   */
  getDisplayValue(item: T): unknown;
  /** Returns a label for form controls rendered inside this column. */
  getFormControlLabel(item: T): string;
  /**
   * Returns an array of strings that are set as part attributes on the `<td>` element. This is used
   * for styling the cells externally. Override this method if you want to add custom parts to the
   * cells.
   */
  getParts(item?: T): string[];
}
