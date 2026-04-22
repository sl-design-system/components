import { type ToolBarItem } from './mapping.js';

/**
 * Calculate which items should be visible based on available width.
 *
 * Runs a two-pass algorithm:
 * 1. Determine whether an overflow menu is needed at all.
 * 2. Set each item's `visible` flag based on the effective width (accounting for the
 *    overflow menu button when present).
 *
 * After the two passes, orphaned dividers (dividers with no visible non-divider
 * neighbours on either side) are also hidden.
 *
 * This function **mutates** the `visible` property of each item in place.
 */
export function calculateVisibility(
  items: ToolBarItem[],
  widths: number[],
  availableWidth: number,
  gap: number,
  menuButtonWidth: number
): void {
  // First pass: determine if we need overflow menu
  let cumulativeWidth = 0,
    needsMenu = false;

  for (let i = 0; i < items.length; i++) {
    const itemWidth = widths[i],
      gapWidth = i > 0 ? gap : 0,
      requiredWidth = cumulativeWidth + gapWidth + itemWidth;

    if (requiredWidth > availableWidth) {
      needsMenu = true;
      break;
    }

    cumulativeWidth = requiredWidth;
  }

  // Reserve space for the menu button when present.
  const effectiveWidth = availableWidth - (needsMenu ? menuButtonWidth : 0);

  // Second pass: hide items that don't fit in the remaining space.
  setItemVisibility(items, widths, effectiveWidth, gap);

  // When all items are hidden the menu button loses its margin via CSS,
  // so there is a bit more space. Try fitting one more item, but hide it
  // again if the margin coming back would cause overflow.
  if (needsMenu && items.every(item => !item.visible || item.type === 'divider')) {
    setItemVisibility(items, widths, effectiveWidth + gap, gap);

    // Check that the visible items plus the menu button still fit.
    const visibleWidth = items.reduce(
      (sum, item, i) => (item.visible ? sum + (sum > 0 ? gap : 0) + widths[i] : sum),
      0
    );

    if (visibleWidth > 0 && visibleWidth + menuButtonWidth > availableWidth) {
      items.forEach(item => (item.visible = false));
    }
  }

  // Third pass: hide orphaned dividers
  for (let i = 0; i < items.length; i++) {
    if (items[i].type !== 'divider' || !items[i].visible) {
      continue;
    }

    const hasVisibleBefore = i > 0 && items.slice(0, i).some(item => item.visible && item.type !== 'divider'),
      hasVisibleAfter =
        i < items.length - 1 && items.slice(i + 1).some(item => item.visible && item.type !== 'divider');

    if (!hasVisibleBefore || !hasVisibleAfter) {
      items[i].visible = false;
    }
  }
}

/** Set item visibility based on effective width, hiding items that don't fit. */
function setItemVisibility(items: ToolBarItem[], widths: number[], effectiveWidth: number, gap: number): void {
  let cumulativeWidth = 0,
    overflowing = false;

  for (let i = 0; i < items.length; i++) {
    const itemWidth = widths[i],
      gapWidth = cumulativeWidth > 0 ? gap : 0,
      requiredWidth = cumulativeWidth + gapWidth + itemWidth;

    if (overflowing || requiredWidth > effectiveWidth) {
      items[i].visible = false;
      overflowing = true;
    } else {
      items[i].visible = true;
      cumulativeWidth = requiredWidth;
    }
  }
}

/** Apply CSS visibility and positioning to items based on their `visible` flag. */
export function applyVisibility(items: ToolBarItem[]): void {
  items.forEach(item => {
    item.element.style.visibility = item.visible ? '' : 'hidden';
    item.element.style.position = item.visible ? '' : 'absolute';
  });
}

/** Reveal all items (set them visible) so they can be measured accurately. */
export function revealAllItems(items: ToolBarItem[]): void {
  items.forEach(item => {
    item.element.style.visibility = '';
    item.element.style.position = '';
    item.visible = true;
  });
}

/**
 * Measure the widths of all items. Returns `undefined` if measurements are invalid
 * (e.g. non-divider items have zero width).
 */
export function measureItemWidths(items: ToolBarItem[]): number[] | undefined {
  const widths = items.map(item => item.element.getBoundingClientRect().width),
    hasInvalidMeasurements = items.some((item, i) => item.type !== 'divider' && widths[i] === 0);

  return hasInvalidMeasurements ? undefined : widths;
}

/**
 * Measure the overflow menu button width including its margin.
 * The menu button is square (aspect-ratio 1:1), so we use the wrapper height as
 * the button width. Falls back to the actual button width when the wrapper has no height.
 */
export function measureMenuButtonWidth(wrapper: HTMLElement, menuButton: HTMLElement | undefined, gap: number): number {
  let width = wrapper.getBoundingClientRect().height;

  if ((isNaN(width) || width === 0) && menuButton) {
    width = menuButton.getBoundingClientRect().width;
  }

  // Include the menu button's margin, or use the gap as a fallback estimate.
  if (menuButton) {
    width += parseFloat(getComputedStyle(menuButton).marginInlineStart) || 0;
  } else {
    width += gap;
  }

  return width;
}

/**
 * Measure the available width inside the host element.
 * Adds a `measuring` state so CSS applies `contain: inline-size`, preventing
 * the parent from growing to fit the toolbar. If that causes the toolbar to
 * collapse to zero, the natural width is used instead.
 */
export function measureConstrainedWidth(host: HTMLElement, internals: ElementInternals): number {
  const hostStyles = getComputedStyle(host),
    paddingInline = (parseFloat(hostStyles.paddingInlineStart) || 0) + (parseFloat(hostStyles.paddingInlineEnd) || 0),
    borderInline =
      (parseFloat(hostStyles.borderInlineStartWidth) || 0) + (parseFloat(hostStyles.borderInlineEndWidth) || 0);

  // Add the measuring state so CSS applies containment.
  internals.states.add('measuring');
  void host.offsetHeight;

  let measuredWidth = host.getBoundingClientRect().width - paddingInline - borderInline;

  // If containment collapsed the toolbar (e.g. inline-size: fit-content),
  // fall back to the parent's available width directly. We intentionally do
  // NOT remove the measuring state and re-measure the host here, because
  // toggling containment on and off forces multiple layouts and causes visible
  // flickering during zoom.
  if (measuredWidth <= 0 && host.parentElement) {
    measuredWidth = host.parentElement.clientWidth - paddingInline - borderInline;
  }

  // Remove the measuring state to restore normal layout.
  internals.states.delete('measuring');

  return measuredWidth;
}
