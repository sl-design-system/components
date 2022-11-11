import type { OffsetOptions } from '@floating-ui/core';
import type { Placement } from '@floating-ui/dom';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { topLayer } from './top-layer.js';
export type { Placement };

function roundByDPR(num: number): number {
  const dpr = window.devicePixelRatio || 1;
  return Math.round(num * dpr) / dpr || -10000;
}

let initialHeight: number;
let isConstrained: boolean;
const virtualTrigger = false;
// const placements: Record<string, Placement[]> = {
//     top: ['top', 'bottom'] as Placement[],
//     bottom: ['bottom', 'top'] as Placement[],
//     left: ['left', 'right'] as Placement[],
//     right: ['right', 'left'] as Placement[],
// }
// See: https://spectrum.adobe.com/page/popover/#Container-padding
const REQUIRED_DISTANCE_TO_EDGE = 8;
// See: https://github.com/adobe/spectrum-web-components/issues/910
const MIN_OVERLAY_HEIGHT = 25;

export const positionAnchoredElement = (
  element: HTMLElement,
  anchor: HTMLElement,
  placement: Placement,
  offsetOptions: OffsetOptions = {}
): (() => void) => {
  const cleanup = autoUpdate(anchor, element, () => {
    void computePosition(anchor, element, {
      strategy: 'fixed',
      placement,
      middleware: [
        shift({ padding: REQUIRED_DISTANCE_TO_EDGE }),
        flip({
          padding: REQUIRED_DISTANCE_TO_EDGE
        }),
        offset(offsetOptions),
        //   autoPlacement({allowedPlacements: placements[placement]}),
        // Make sure that the overlay is contained by the visisble page.
        size({
          padding: REQUIRED_DISTANCE_TO_EDGE,
          apply: ({ availableWidth, availableHeight, rects: { floating } }) => {
            const maxHeight = Math.max(MIN_OVERLAY_HEIGHT, Math.floor(availableHeight));
            const actualHeight = floating.height;
            initialHeight = !isConstrained && !virtualTrigger ? actualHeight : initialHeight || actualHeight;
            isConstrained = actualHeight < initialHeight || maxHeight <= actualHeight;
            const appliedHeight = isConstrained ? `${maxHeight}px` : '';
            Object.assign(element.style, {
              maxWidth: `${Math.floor(availableWidth)}px`,
              maxHeight: appliedHeight,
              height: appliedHeight
            });
          }
        }),
        topLayer()
      ]
    }).then(({ x, y, placement: actualPlacement }) => {
      Object.assign(element.style, {
        transform: `translate(${roundByDPR(x)}px, ${roundByDPR(y)}px)`
      });
      element.setAttribute('actual-placement', actualPlacement);
    });
  });
  return () => {
    cleanup();
  };
};
