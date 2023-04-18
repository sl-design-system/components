import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type { DataSource, EventEmitter } from '@sl-design-system/shared';
import { SelectionController } from '@sl-design-system/shared';
import { LitElement } from 'lit';
import { GridColumn } from './column.js';
export declare class GridActiveItemChangeEvent<T> extends Event {
    readonly item: T;
    readonly relatedEvent: Event | null;
    constructor(item: T, relatedEvent: Event | null);
}
export type GridItemParts<T> = (model: T) => string | undefined;
declare const Grid_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types.js").ScopedElementsHost>;
export declare class Grid<T extends Record<string, unknown> = Record<string, unknown>> extends Grid_base {
    #private;
    /** @private */
    static get scopedElements(): ScopedElementsMap;
    /** @private */
    static styles: CSSResultGroup;
    /** Selection manager. */
    readonly selection: SelectionController<T>;
    /** The active item in the grid. */
    activeItem?: T;
    /** Emits when the active item changes */
    activeItemChange: EventEmitter<GridActiveItemChangeEvent<T>>;
    /** The columns in the grid. */
    columns: Array<GridColumn<T>>;
    /** Provide your own implementation for getting the data. */
    dataSource?: DataSource<T>;
    /** An array of items to be displayed in the grid. */
    items?: T[];
    /** Custom parts to be set on the `<tr>` so it can be styled externally. */
    itemParts?: GridItemParts<T>;
    /** Hide the border around the grid when true. */
    noBorder?: boolean;
    /** Hides the border between rows when true. */
    noRowBorder?: boolean;
    /** Uses alternating background colors for the rows when set. */
    striped?: boolean;
    willUpdate(changes: PropertyValues<this>): void;
    updated(changes: PropertyValues<this>): void;
    render(): TemplateResult;
    renderStyles(): TemplateResult;
    renderHeader(): TemplateResult;
    renderItem(item: T, index: number): TemplateResult;
    /** Updates the `width` of all columns which have `autoWidth` set to `true`. */
    recalculateColumnWidths(): Promise<void>;
}
export {};
