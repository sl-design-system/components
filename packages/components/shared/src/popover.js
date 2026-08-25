import { arrow, flip, offset, shift, size } from '@floating-ui/core';
import { autoUpdate, computePosition } from '@floating-ui/dom';
function roundByDPR(num) {
  const dpr = window.devicePixelRatio || 1;
  const rounded = Math.round(num * dpr) / dpr;
  return !isNaN(rounded) ? rounded : -1e4;
}
export const isPopoverOpen = element => {
  if (!element) {
    return false;
  } else {
    return element.matches(':popover-open') || element.matches('.\\:popover-open');
  }
};
const MIN_OVERLAY_HEIGHT = 25;
export const positionPopover = (element, anchor, options = {}) => {
  element.style.insetBlockStart = element.style.insetInlineStart = '0px';
  const cleanup = autoUpdate(anchor, element, () => {
    const middleware = [
      options.offset !== void 0 ? offset(options.offset) : void 0,
      flip(),
      options.viewportMargin !== void 0 ? shift({ padding: options.viewportMargin }) : void 0,
      size({
        // With popover, we no longer need to
        padding: options.viewportMargin,
        apply: ({ availableWidth, availableHeight, elements }) => {
          const style = getComputedStyle(element),
            maxBlock = style.getPropertyValue('--sl-popover-max-block-size'),
            currentMaxBlockSize = !isNaN(parseInt(maxBlock)) ? parseInt(maxBlock) : 0,
            minBlock = style.getPropertyValue('--sl-popover-min-block-size'),
            currentMinBlockSize = !isNaN(parseInt(minBlock)) ? parseInt(minBlock) : 0,
            maxInline = style.getPropertyValue('--sl-popover-max-inline-size'),
            currentMaxInlineSize = !isNaN(parseInt(maxInline)) ? parseInt(maxInline) : 0;
          const maxBlockSize =
              currentMaxBlockSize > 0
                ? Math.min(currentMaxBlockSize, Math.floor(availableHeight))
                : Math.floor(availableHeight),
            minBlockSize = Math.max(currentMinBlockSize, MIN_OVERLAY_HEIGHT);
          let maxInlineSize =
            currentMaxInlineSize > 0
              ? Math.min(currentMaxInlineSize, Math.floor(availableWidth))
              : Math.floor(availableWidth);
          maxInlineSize = options.maxWidth
            ? Math.min(options.maxWidth, maxInlineSize)
            : maxInlineSize;
          Object.assign(elements.floating.style, {
            maxInlineSize: `${maxInlineSize}px`,
            maxBlockSize: `${maxBlockSize}px`,
            minBlockSize: `${minBlockSize}px`
          });
        }
      })
    ].filter(Boolean);
    let arrowElement;
    if (options.arrowElement) {
      arrowElement =
        options.arrowElement instanceof HTMLElement
          ? options.arrowElement
          : element.shadowRoot?.querySelector(options.arrowElement);
      middleware.push(arrow({ element: arrowElement, padding: options.arrowPadding }));
    }
    computePosition(anchor, element, {
      strategy: 'fixed',
      placement: options.position ?? 'top',
      middleware
    }).then(({ x, y, middlewareData: { arrow: arrow2 }, placement: actualPlacement }) => {
      Object.assign(element.style, {
        insetInlineStart: `${roundByDPR(x)}px`,
        insetBlockStart: `${roundByDPR(y)}px`
      });
      element.setAttribute('actual-placement', actualPlacement);
      if (arrow2 && arrowElement) {
        Object.assign(arrowElement.style, {
          insetInlineStart: typeof arrow2.x === 'number' ? `${roundByDPR(arrow2.x)}px` : '',
          insetBlockStart: typeof arrow2.y === 'number' ? `${roundByDPR(arrow2.y)}px` : ''
        });
      }
    });
  });
  return () => cleanup();
};
//# sourceMappingURL=popover.js.map
