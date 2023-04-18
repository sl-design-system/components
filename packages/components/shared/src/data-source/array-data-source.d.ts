import { DataSource } from './data-source.js';
export declare class ArrayDataSource<T> extends DataSource<T> {
    #private;
    get items(): T[];
    get size(): number;
    constructor(items: T[]);
    update(): void;
}
