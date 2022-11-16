import { arrow } from '@floating-ui/core';
import type { Placement } from '@floating-ui/dom';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
export type { Placement };

function roundByDPR(num: number): number {
  const dpr = window.devicePixelRatio || 1;
  return Math.round(num * dpr) / dpr || -10000;
}

let initialHeight: number;
let isConstrained: boolean;
const virtualTrigger = false;

const MIN_OVERLAY_HEIGHT = 25;

export interface PositionAnchoredElementOptions {
  arrow?: HTMLElement;
  positions: Array<{ placement: Placement; offset?: [number, number] }>;
  viewportMargin?: number;
}

export const flipPlacement = (placement: Placement): Placement => {
  // Position can have a secondary part (-start, -end); we are only
  // interested in the first part.
  const [, pos] = /(\w+).*$/.exec(placement) || [];

  if (pos === 'top' || pos === 'bottom') {
    return pos === 'top' ? 'bottom' : 'top';
  } else {
    return pos === 'left' ? 'right' : 'left';
  }
};

export const positionAnchoredElement = (
  element: HTMLElement,
  anchor: HTMLElement,
  options: PositionAnchoredElementOptions
): (() => void) => {
  const cleanup = autoUpdate(anchor, element, () => {
    const { viewportMargin = 0 } = options,
      { placement, offset: [crossAxis, mainAxis] = [0, 0] } = options.positions[0];

    const middleware = [
      shift({ padding: viewportMargin }),
      flip({ fallbackPlacements: options.positions.slice(1).map(({ placement }) => placement) }),
      offset({ mainAxis, crossAxis }),
      size({
        padding: viewportMargin,
        apply: ({ availableWidth, availableHeight, rects: { floating } }) => {
          // Make sure that the overlay is contained by the visible page.
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
      })
    ];

    if (options.arrow) {
      middleware.push(arrow({ element: options.arrow }));
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    computePosition(anchor, element, {
      strategy: 'fixed',
      placement,
      middleware
    }).then(({ x, y, middlewareData: { arrow }, placement: actualPlacement }) => {
      Object.assign(element.style, {
        transform: `translate(${roundByDPR(x)}px, ${roundByDPR(y)}px)`
      });
      element.setAttribute('actual-placement', actualPlacement);

      if (arrow && options.arrow) {
        options.arrow.style.transform = `translateX(${arrow.x || 0}px)`;
      }
    });
  });

  return () => cleanup();
};
