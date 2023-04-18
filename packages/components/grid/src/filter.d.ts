import type { CSSResultGroup, TemplateResult } from 'lit';
import type { GridColumn } from './column.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type { EventEmitter } from '@sl-design-system/shared';
import { LitElement } from 'lit';
export type GridFilterChange = 'added' | 'removed';
export declare class GridFilterValueChangeEvent extends Event {
    readonly column: GridColumn;
    readonly value: string;
    constructor(column: GridColumn, value: string);
}
declare const GridFilter_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types.js").ScopedElementsHost>;
export declare class GridFilter extends GridFilter_base {
    #private;
    /** @private */
    static get scopedElements(): ScopedElementsMap;
    /** @private */
    static styles: CSSResultGroup;
    /** The grid column. */
    column: GridColumn;
    filterChange: EventEmitter<GridFilterChange>;
    filterValueChange: EventEmitter<GridFilterValueChangeEvent>;
    set value(value: string);
    get value(): string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}
export {};
