import type { TemplateResult } from 'lit';
import type { Grid } from './grid.js';
import type { EventEmitter } from '@sl-design-system/shared';
import { LitElement } from 'lit';
export type GridColumnHeaderRenderer = () => TemplateResult;
export type GridColumnDataRenderer<T> = (model: T) => TemplateResult;
export type GridColumnParts<T> = (model: T) => string | undefined;
export declare class GridColumn<T extends Record<string, unknown> = Record<string, unknown>> extends LitElement {
    #private;
    /** The alignment of the content within the column. */
    align: 'start' | 'center' | 'end';
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
    autoWidth?: boolean;
    /** Emits when the column definition has changed. */
    columnUpdate: EventEmitter<void>;
    /** The parent grid instance. */
    grid?: Grid<T>;
    /**
     * The ratio with which the column will grow relative to the other columns.
     * A ratio of 0 means the column width is fixed.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow}
     */
    grow: number;
    /** The label for the column header. */
    header?: string | GridColumnHeaderRenderer;
    /** The path to the value for this column. */
    path?: string;
    /** Custom parts to be set on the `<td>` so it can be styled externally. */
    parts?: string | GridColumnParts<T>;
    /** Renderer function for the column value of each cell. */
    renderer?: GridColumnDataRenderer<T>;
    /**
     * The custom elements used for rendering this column. Since the rendering the column cells is done
     * in the parent grid component, the custom elements need to be registered in the parent grid.
     */
    scopedElements?: Record<string, typeof HTMLElement>;
    /** Whether this column is sticky when the user scrolls horizontally. */
    sticky?: boolean;
    set width(value: number | undefined);
    /** Width of the cells for this column in pixels. */
    get width(): number | undefined;
    connectedCallback(): void;
    renderHeader(): TemplateResult;
    renderData(item: T): TemplateResult;
}
