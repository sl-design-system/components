import { arrow, flip, offset, shift, size } from '@floating-ui/core';
import { autoUpdate, computePosition } from '@floating-ui/dom';
import popoverPolyfillStyles from './popover.scss.js';

export { popoverPolyfillStyles };

type Alignment = 'start' | 'end';
type Side = 'top' | 'right' | 'bottom' | 'left';
type AlignedPlacement = `${Side}-${Alignment}`;

export type PopoverPosition = Side | AlignedPlacement;

export interface PositionPopoverOptions {
  arrow?: string | HTMLElement;
  maxWidth?: number;
  offset?: number;
  position?: PopoverPosition;
  viewportMargin?: number;
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

const MIN_OVERLAY_HEIGHT = 25;

export const positionPopover = (
  element: HTMLElement,
  anchor: Element,
  options: PositionPopoverOptions = {}
): (() => void) => {
  // Reset element to top left to prevent layout interference
  // See https://floating-ui.com/docs/computePosition#initial-layout
  element.style.insetBlockStart = '0px';
  element.style.insetInlineStart = '0px';

  const cleanup = autoUpdate(anchor, element, () => {
    // Offset should come first, according to floating-ui docs
    // Flip should come before shift, otherwise it won't flip properly
    const middleware = [
      options.offset !== undefined ? offset(options.offset) : undefined,
      flip({ fallbackAxisSideDirection: 'end' }),
      options.viewportMargin !== undefined ? shift({ padding: options.viewportMargin }) : undefined,
      size({
        padding: options.viewportMargin,
        apply: ({ availableWidth, availableHeight }) => {
          // Make sure that the overlay is contained by the visible page.
          const maxHeight = Math.max(MIN_OVERLAY_HEIGHT, Math.floor(availableHeight));

          Object.assign(element.style, {
            maxWidth: `${options.maxWidth ?? Math.floor(availableWidth)}px`,
            maxHeight: `${maxHeight - (options.viewportMargin ?? 0)}px`
          });
        }
      })
    ].filter(Boolean);

    let arrowElement: HTMLElement | null | undefined;
    if (options.arrow) {
      arrowElement =
        options.arrow instanceof HTMLElement ? options.arrow : element.shadowRoot?.querySelector(options.arrow);

      middleware.push(arrow({ element: arrowElement }));
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    computePosition(anchor, element, {
      strategy: 'fixed',
      placement: options.position ?? 'top',
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
