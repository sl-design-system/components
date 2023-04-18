import type { CSSResultGroup, ReactiveElement } from 'lit';
import type { Constructor } from '@sl-design-system/shared';
export interface PopoverInterface {
    showPopover(): void;
    hidePopover(): void;
    open: boolean;
    popoverOpen: boolean;
    receivesFocus?: 'auto';
}
export declare const popoverMixinStyles: CSSResultGroup;
export declare function PopoverMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<PopoverInterface>;
