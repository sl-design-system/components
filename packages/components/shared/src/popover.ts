import type { Middleware, MiddlewareState } from '@floating-ui/dom';
import { arrow, flip, shift, size } from '@floating-ui/core';
import { autoUpdate, computePosition, offset } from '@floating-ui/dom';
import { getContainingBlock, getWindow, isContainingBlock } from '@floating-ui/utils/dom';
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

const flipPlacement = (position: PopoverPosition): PopoverPosition[] => {
  // Position can have a secondary part (-start, -end); we are only
  // interested in the first part.
  const [, pos] = /(\w+).*$/.exec(position) || [];

  let replace = [];
  if (pos === 'top' || pos === 'bottom') {
    replace = pos === 'top' ? ['bottom', 'right', 'left'] : ['top', 'right', 'left'];
  } else {
    replace = pos === 'left' ? ['right', 'top', 'bottom'] : ['left', 'top', 'bottom'];
  }
  const positions: PopoverPosition[] = [];
  replace.forEach(replacePart => {
    positions.push(position.replace(pos, replacePart) as PopoverPosition);
  });
  return positions;
};

/** This is a temporary workaround until @floating-ui fixes this issue.
 *  https://github.com/floating-ui/floating-ui/pull/2351
 */
const topLayerOverTransforms = (): Middleware => ({
  name: 'topLayer',
  async fn(middlewareArguments: MiddlewareState) {
    const {
      x,
      y,
      elements: { reference, floating }
    } = middlewareArguments;
    let onTopLayer = false;
    let topLayerIsFloating = false;
    let withinReference = false;
    const diffCoords = {
      x: 0,
      y: 0
    };
    try {
      onTopLayer = onTopLayer || floating.matches(':popover-open');
      // eslint-disable-next-line no-empty
    } catch (error) {}
    try {
      onTopLayer = onTopLayer || floating.matches(':open');
      // eslint-disable-next-line no-empty
    } catch (error) {}
    try {
      onTopLayer = onTopLayer || floating.matches(':modal');
      // eslint-disable-next-line no-empty
      /* c8 ignore next 3 */
    } catch (error) {}
    topLayerIsFloating = onTopLayer;
    const dialogAncestorQueryEvent = new Event('floating-ui-dialog-test', {
      composed: true,
      bubbles: true
    });
    floating.addEventListener(
      'floating-ui-dialog-test',
      (event: Event) => {
        (event.composedPath() as unknown as Element[]).forEach(el => {
          withinReference = withinReference || el === reference;
          if (el === floating || el.localName !== 'dialog') return;
          try {
            onTopLayer = onTopLayer || el.matches(':modal');
            // eslint-disable-next-line no-empty
            /* c8 ignore next */
          } catch (error) {}
        });
      },
      { once: true }
    );
    floating.dispatchEvent(dialogAncestorQueryEvent);
    let overTransforms = false;

    const root = (withinReference ? reference : floating) as Element;
    const containingBlock = isContainingBlock(root) ? root : getContainingBlock(root);

    if (containingBlock !== null && getWindow(containingBlock) !== (containingBlock as unknown as Window)) {
      const css = getComputedStyle(containingBlock);
      overTransforms = css.transform !== 'none' || (css.filter ? css.filter !== 'none' : false);
    }

    if (onTopLayer && overTransforms && containingBlock) {
      const rect = containingBlock.getBoundingClientRect();
      diffCoords.x = rect.x;
      diffCoords.y = rect.y;
    }

    if (onTopLayer && topLayerIsFloating) {
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }

    if (onTopLayer) {
      return {
        x,
        y,
        data: diffCoords
      };
    }

    return {
      x: x - diffCoords.x,
      y: y - diffCoords.y,
      data: diffCoords
    };
  }
});

export const positionPopover = (
  element: HTMLElement,
  anchor: Element,
  options: PositionPopoverOptions
): (() => void) => {
  // Reset element to top left to prevent layout interference
  // See https://floating-ui.com/docs/computePosition#initial-layout
  element.style.insetBlockStart = '0px';
  element.style.insetInlineStart = '0px';

  console.log('element anchor', element, anchor);

  const cleanup = autoUpdate(anchor, element, () => {
    const { position = 'top', viewportMargin = 0 } = options;
    const middleware = [
      shift({ padding: viewportMargin }),
      flip({ fallbackPlacements: flipPlacement(position) }),
      offset(getOffset(element)),
      size({
        padding: viewportMargin,
        apply: ({ availableWidth, availableHeight, rects: { floating } }) => {
          // Make sure that the overlay is contained by the visible page.
          const maxHeight = Math.max(MIN_OVERLAY_HEIGHT, Math.floor(availableHeight)); // TODO: problems with maxHeight???
          const actualHeight = floating.height;
          initialHeight = !isConstrained && !virtualTrigger ? actualHeight : initialHeight || actualHeight;
          isConstrained = actualHeight < initialHeight || maxHeight <= actualHeight;
          // console.log('floating', floating, maxHeight, isConstrained, viewportMargin);
          const appliedHeight = isConstrained ? `${maxHeight}px` : '';
          Object.assign(element.style, {
            maxWidth: `${options.maxWidth ?? Math.floor(availableWidth)}px`,
            maxHeight: appliedHeight
          });
        }
      }),
      topLayerOverTransforms() // TODO: is it still necessary?
    ];

    console.log('fallbackPlacements', flipPlacement(position));

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

      console.log('middleware and actualPlacement', middleware, actualPlacement, position, viewportMargin);

      if (arrow && arrowElement) {
        arrowElement.style.translate = `${arrow.x || 0}px ${arrow.y || 0}px`; // TODO: not necessary??
      }
    });
  });

  return () => cleanup();
};
