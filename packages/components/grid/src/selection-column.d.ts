import type { PropertyValues, TemplateResult } from 'lit';
import { GridColumn } from './column.js';
export declare class GridSelectionColumn<T extends Record<string, unknown> = Record<string, unknown>> extends GridColumn {
    #private;
    /** When true, the active rows get selected automatically. */
    autoSelect?: boolean;
    /** When true, all items are selected. */
    selectAll?: boolean;
    connectedCallback(): void;
    updated(changes: PropertyValues<this>): void;
    renderHeader(): TemplateResult;
    renderData(item: T): TemplateResult;
}
