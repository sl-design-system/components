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

  // Second pass: set visibility based on effective width.
  setItemVisibility(items, widths, effectiveWidth, gap);

  // When all items are hidden, the menu button's margin is removed via CSS,
  // freeing extra space. Retry to see if an item fits, but verify it still
  // fits once the margin is restored to prevent flickering.
  if (needsMenu && items.every(item => !item.visible || item.type === 'divider')) {
    setItemVisibility(items, widths, effectiveWidth + gap, gap);

    // Verify if visible items + menu button (with margin) exceed the
    // available width, revert to all-hidden to prevent flickering.
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

  console.log('items in calculateVisibility', items);
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
 * Measure the content-box width of the host element.
 *
 * Uses temporary `contain: inline-size` to prevent parent containers from
 * expanding to fit the toolbar's content. Falls back to the natural width
 * when containment collapses the toolbar (e.g. `inline-size: fit-content`).
 */
export function measureConstrainedWidth(host: HTMLElement): number {
  const hostStyles = getComputedStyle(host),
    paddingInline = (parseFloat(hostStyles.paddingInlineStart) || 0) + (parseFloat(hostStyles.paddingInlineEnd) || 0),
    borderInline =
      (parseFloat(hostStyles.borderInlineStartWidth) || 0) + (parseFloat(hostStyles.borderInlineEndWidth) || 0);

  // Apply containment so parent containers don't expand to fit our content.
  host.style.contain = 'inline-size';
  void host.offsetHeight;

  let measuredWidth = host.getBoundingClientRect().width - paddingInline - borderInline;

  // If containment collapsed the toolbar (e.g. inline-size: fit-content),
  // fall back to the natural width without containment.
  if (measuredWidth <= 0) {
    host.style.contain = '';
    void host.offsetHeight;
    measuredWidth = host.getBoundingClientRect().width - paddingInline - borderInline;
  }

  // Restore normal containment.
  host.style.contain = '';

  return measuredWidth;
}
