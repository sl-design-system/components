import { arrow, flip, offset, shift, size } from '@floating-ui/core';
import { type Elements, autoUpdate, computePosition } from '@floating-ui/dom';

type Alignment = 'start' | 'end';
type Side = 'top' | 'right' | 'bottom' | 'left';
type AlignedPlacement = `${Side}-${Alignment}`;

export type PopoverPosition = Side | AlignedPlacement;

export interface PositionPopoverOptions {
  arrowElement?: string | HTMLElement;
  arrowPadding?: number;
  maxWidth?: number;
  offset?: number;
  position?: PopoverPosition;
  viewportMargin?: number;
  rootMarginTop?: number;
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
  element.style.insetBlockStart = element.style.insetInlineStart = '0px';

  const cleanup = autoUpdate(anchor, element, () => {
    // Offset should come first, according to floating-ui docs
    // Flip should come before shift, otherwise it won't flip properly
    const middleware = [
      options.offset !== undefined ? offset(options.offset) : undefined,
      flip(),
      options.viewportMargin !== undefined ? shift({ padding: options.viewportMargin }) : undefined,
      size({
        // With popover, we no longer need to
        padding: options.viewportMargin,
        apply: ({ availableWidth, availableHeight, elements }) => {
          // Make sure that the overlay is contained by the visible page.
          const style = getComputedStyle(element),
            maxBlock = style.getPropertyValue('--sl-popover-max-block-size'),
            currentMaxBlockSize = !isNaN(parseInt(maxBlock)) ? parseInt(maxBlock) : 0,
            minBlock = style.getPropertyValue('--sl-popover-min-block-size'),
            currentMinBlockSize = !isNaN(parseInt(minBlock)) ? parseInt(minBlock) : 0,
            maxInline = style.getPropertyValue('--sl-popover-max-inline-size'),
            currentMaxInlineSize = !isNaN(parseInt(maxInline)) ? parseInt(maxInline) : 0;

          // If the element already has a max inline or block size that is smaller
          // than the available space, don't override it.
          const maxBlockSize =
              currentMaxBlockSize > 0
                ? Math.min(currentMaxBlockSize, Math.floor(availableHeight))
                : Math.floor(availableHeight),
            minBlockSize = Math.max(currentMinBlockSize, MIN_OVERLAY_HEIGHT);
          let maxInlineSize =
            currentMaxInlineSize > 0
              ? Math.min(currentMaxInlineSize, Math.floor(availableWidth))
              : Math.floor(availableWidth);
          maxInlineSize = options.maxWidth ? Math.min(options.maxWidth, maxInlineSize) : maxInlineSize;

          Object.assign((elements as Elements).floating.style, {
            maxInlineSize: `${maxInlineSize}px`,
            maxBlockSize: `${maxBlockSize}px`,
            minBlockSize: `${minBlockSize}px`
          });
        }
      })
    ].filter(Boolean);

    let arrowElement: HTMLElement | null | undefined;
    if (options.arrowElement) {
      arrowElement =
        options.arrowElement instanceof HTMLElement
          ? options.arrowElement
          : element.shadowRoot?.querySelector(options.arrowElement);

      middleware.push(arrow({ element: arrowElement, padding: options.arrowPadding }));
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    computePosition(anchor, element, {
      strategy: 'fixed',
      placement: options.position ?? 'top',
      middleware
    }).then(({ x, y, middlewareData: { arrow }, placement: actualPlacement }) => {
      Object.assign(element.style, {
        insetInlineStart: `${roundByDPR(x)}px`,
        insetBlockStart: `${roundByDPR(y)}px`
      });
      element.setAttribute('actual-placement', actualPlacement);

      if (arrow && arrowElement) {
        Object.assign(arrowElement.style, {
          insetInlineStart: typeof arrow.x === 'number' ? `${roundByDPR(arrow.x)}px` : '',
          insetBlockStart: typeof arrow.y === 'number' ? `${roundByDPR(arrow.y)}px` : ''
        });
      }
    });
  });

  return () => cleanup();
};
