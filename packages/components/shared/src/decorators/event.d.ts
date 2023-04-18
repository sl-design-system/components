export interface EventOptions {
    /** Indicate if event bubbles up through the DOM or not */
    bubbles?: boolean;
    /** Indicate if event is cancelable */
    cancelable?: boolean;
    /** Indicate if event can bubble across the boundary between the shadow DOM and the light DOM */
    composed?: boolean;
    /** Custom event name */
    name?: string;
}
export declare class EventEmitter<T> {
    private target;
    private eventName;
    private options?;
    constructor(target: HTMLElement, eventName: string, options?: EventOptions | undefined);
    emit(value: T, options?: EventOptions): boolean;
}
export declare function event(options?: EventOptions): any;
