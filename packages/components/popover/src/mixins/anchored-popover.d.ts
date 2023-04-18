import type { ReactiveElement } from 'lit';
import type { AnchoredInterface } from './anchored.js';
import type { PopoverInterface } from './popover.js';
import type { Constructor } from '@sl-design-system/shared';
export declare function AnchoredPopoverMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<AnchoredInterface & PopoverInterface>;
