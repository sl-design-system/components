import type { Middleware } from '@floating-ui/dom';
import { arrow, flip, shift, size } from '@floating-ui/core';
import { autoUpdate, computePosition, offset } from '@floating-ui/dom';
import { getContainingBlock } from '@floating-ui/utils/dom';
import popoverPolyfillStyles from './popover.scss.js';

export { popoverPolyfillStyles };

type Alignment = 'start' | 'end';
type Side = 'top' | 'right' | 'bottom' | 'left';
type AlignedPlacement = `${Side}-${Alignment}`;

export type PopoverPosition = Side | AlignedPlacement;

export interface PositionPopoverOptions {
  arrow?: string | HTMLElement;
  position?: PopoverPosition;
  offset?: [block: number, inline: number];
  viewportMargin?: number;
  maxWidth?: number;
}

function getArrowElement(element: HTMLElement, arrow?: string | HTMLElement): HTMLElement | undefined {
  if (arrow instanceof HTMLElement) {
    return arrow;
  } else if (typeof arrow === 'string') {
    return element.shadowRoot?.querySelector(arrow) || undefined;
  }

  return undefined;
}

function getOffset(element: HTMLElement): number {
  return parseInt(window.getComputedStyle(element).getPropertyValue('--sl-popover-offset')) || 0;
}

function roundByDPR(num: number): number {
  const dpr = window.devicePixelRatio || 1;
  const rounded = Math.round(num * dpr) / dpr;

  return !isNaN(rounded) ? rounded : -10000;
}

export const isPopoverOpen = (element?: HTMLElement): boolean => {
  if (!element) {
    return false;
  } else {
    return element.matches(':popover-open') || element.matches('.\\:popover-open');
  }
};

let initialHeight: number;
let isConstrained: boolean;
const virtualTrigger = false;

const MIN_OVERLAY_HEIGHT = 25;

const flipPlacement = (position: PopoverPosition): PopoverPosition => {
  // Position can have a secondary part (-start, -end); we are only
  // interested in the first part.
  const [, pos] = /(\w+).*$/.exec(position) || [];

  let replace;
  if (pos === 'top' || pos === 'bottom') {
    replace = pos === 'top' ? 'bottom' : 'top';
  } else {
    replace = pos === 'left' ? 'right' : 'left';
  }
  return position.replace(pos, replace) as PopoverPosition;
};

/** This is a temporary workaround until @floating-ui fixes this issue.
 *  https://github.com/floating-ui/floating-ui/pull/2351
 */
const topLayerOverTransforms = (): Middleware => ({
  name: 'topLayer',
  async fn({ x, y, elements: { reference, floating } }) {
    let onTopLayer = false;
    const diffCoords = { x: 0, y: 0 };

    // browsers will throw when they do not support the following selectors, catch the errors.
    try {
      onTopLayer = onTopLayer || floating.matches(':modal') || floating.matches(':popover-open');
    } catch (e) {}

    if (!onTopLayer) {
      return { x, y, data: diffCoords };
    }

    const containingBlock = getContainingBlock(reference as Element);
    const inContainingBlock = containingBlock && !isWindow(containingBlock);

    if (onTopLayer && inContainingBlock) {
      const rect = reference.getBoundingClientRect();
      diffCoords.x = Math.trunc(rect.x - (reference as HTMLElement).offsetLeft);
      diffCoords.y = Math.trunc(rect.y - (reference as HTMLElement).offsetTop);
    }

    return {
      x: x + diffCoords.x,
      y: y + diffCoords.y,
      data: diffCoords
    };
  }
});

const isWindow = (value: unknown): boolean => {
  if (typeof value === 'undefined' || value === null || !(value instanceof Object)) {
    return false;
  }
  return ['document', 'location', 'alert', 'setInterval'].every(p => Object.keys(value).includes(p));
};

export const positionPopover = (
  element: HTMLElement,
  anchor: Element,
  options: PositionPopoverOptions
): (() => void) => {
  // Reset element to top left to prevent layout interference
  // See https://floating-ui.com/docs/computePosition#initial-layout
  element.style.insetBlockStart = '0px';
  element.style.insetInlineStart = '0px';

  const cleanup = autoUpdate(anchor, element, () => {
    const { position = 'top', viewportMargin = 0 } = options;

    const middleware = [
      shift({ padding: viewportMargin }),
      flip({ fallbackPlacements: [flipPlacement(position)] }),
      offset(getOffset(element)),
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
            maxWidth: `${options.maxWidth ? options.maxWidth : Math.floor(availableWidth)}px`,
            maxHeight: appliedHeight
          });
        }
      }),
      topLayerOverTransforms()
    ];

    let arrowElement: HTMLElement | undefined;
    if (options.arrow) {
      arrowElement = getArrowElement(element, options.arrow);

      middleware.push(arrow({ element: arrowElement }));
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

      if (arrow && arrowElement) {
        arrowElement.style.translate = `${arrow.x || 0}px ${arrow.y || 0}px`;
      }
    });
  });

  return () => cleanup();
};
