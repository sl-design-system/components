import type { PropertyValues, TemplateResult } from 'lit';
import { GridColumn } from './column.js';
export declare class GridColumnGroup<T extends Record<string, unknown> = Record<string, unknown>> extends GridColumn<T> {
    #private;
    /** The nested columns in the group. */
    columns: Array<GridColumn<T>>;
    set width(value: number);
    /** The width of the group column is either manually specified, or the sum of the nested columns. */
    get width(): number;
    willUpdate(changes: PropertyValues<this>): void;
    render(): TemplateResult;
    renderHeader(): TemplateResult;
}
