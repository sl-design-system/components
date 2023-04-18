import type { ReactiveElement } from 'lit';
import type { Constructor } from '@sl-design-system/shared';
export interface AnchoredInterface {
    anchorElement?: HTMLElement;
    addEventListenersToAnchor(): void;
    removeEventListenersFromAnchor(): void;
}
export declare function AnchoredMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<AnchoredInterface>;
