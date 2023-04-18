import type { ReactiveControllerHost } from 'lit';
export interface SelectionControllerOptions {
    multiple: boolean;
}
export declare class SelectionController<T> {
    #private;
    /** The total number of items in the selection. */
    size: number;
    /** Whether more than 1 item can be selected at a time. */
    multiple: boolean;
    get selection(): Set<T>;
    constructor(host: ReactiveControllerHost, options?: Partial<SelectionControllerOptions>);
    select(item: T): void;
    selectAll(): void;
    deselect(item: T): void;
    deselectAll(): void;
    toggle(item: T): void;
    areAllSelected(): boolean;
    areSomeSelected(): boolean;
    isSelected(item: T): boolean;
}
