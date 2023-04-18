import type { Placement } from '@floating-ui/dom';
export type { Placement };
export interface PositionAnchoredElementOptions {
    arrow?: HTMLElement;
    positions: Array<{
        placement: Placement;
        offset?: [number, number];
    }>;
    viewportMargin?: number;
}
export declare const flipPlacement: (placement: Placement) => Placement;
export declare const positionAnchoredElement: (element: HTMLElement, anchor: HTMLElement, options: PositionAnchoredElementOptions) => (() => void);
