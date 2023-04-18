import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { GridColumn } from './column.js';
import type { DataSourceSortDirection, EventEmitter } from '@sl-design-system/shared';
import { LitElement } from 'lit';
export type GridSorterChange = 'added' | 'removed';
export declare class GridSorter extends LitElement {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /** The grid column.  */
    column: GridColumn;
    /** The direction in which to sort the items. */
    direction?: DataSourceSortDirection;
    directionChange: EventEmitter<DataSourceSortDirection | undefined>;
    sorterChange: EventEmitter<GridSorterChange>;
    connectedCallback(): void;
    updated(changes: PropertyValues<this>): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
    reset(): void;
}
