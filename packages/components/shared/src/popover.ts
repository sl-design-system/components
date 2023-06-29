import { arrow, flip, offset, shift, size } from '@floating-ui/core';
import { autoUpdate, computePosition } from '@floating-ui/dom';

type Alignment = 'start' | 'end';
type Side = 'top' | 'right' | 'bottom' | 'left';
type AlignedPlacement = `${Side}-${Alignment}`;

export type PopoverPosition = Side | AlignedPlacement;

export interface PositionPopoverOptions {
  arrow?: HTMLElement;
  positions: Array<{ position: PopoverPosition; offset?: [number, number] }>;
  viewportMargin?: number;
}

function roundByDPR(num: number): number {
  const dpr = window.devicePixelRatio || 1;
  return Math.round(num * dpr) / dpr || -10000;
}

let initialHeight: number;
let isConstrained: boolean;
const virtualTrigger = false;

const MIN_OVERLAY_HEIGHT = 25;

// const flipPlacement = (position: PopoverPosition): PopoverPosition => {
//   // Position can have a secondary part (-start, -end); we are only
//   // interested in the first part.
//   const [, pos] = /(\w+).*$/.exec(position) || [];

//   let replace;
//   if (pos === 'top' || pos === 'bottom') {
//     replace = pos === 'top' ? 'bottom' : 'top';
//   } else {
//     replace = pos === 'left' ? 'right' : 'left';
//   }
//   return position.replace(pos, replace) as PopoverPosition;
// };

export const positionPopover = (
  element: HTMLElement,
  anchor: Element,
  options: PositionPopoverOptions
): (() => void) => {
  const cleanup = autoUpdate(anchor, element, () => {
    const { viewportMargin = 0 } = options,
      { position, offset: [crossAxis, mainAxis] = [0, 0] } = options.positions[0];

    const middleware = [
      shift({ padding: viewportMargin }),
      flip({ fallbackPlacements: options.positions.slice(1).map(({ position }) => position) }),
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
            maxHeight: appliedHeight
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
      placement: position,
      middleware
    }).then(({ x, y, middlewareData: { arrow }, placement: actualPlacement }) => {
      Object.assign(element.style, {
        translate: `${roundByDPR(x)}px ${roundByDPR(y)}px`
      });
      element.setAttribute('actual-placement', actualPlacement);

      if (arrow && options.arrow) {
        options.arrow.style.translate = `${arrow.x || 0}px ${arrow.y || 0}px`;
      }
    });
  });

  return () => cleanup();
};
