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

  // Calculate effective width (reserve space for menu button when present).
  // The caller is expected to include any margin/spacing in menuButtonWidth,
  // so we only subtract the button width itself (no extra gap).
  const menuButtonTotalWidth = needsMenu ? menuButtonWidth : 0,
    effectiveWidth = availableWidth - menuButtonTotalWidth;

  // Second pass: set visibility based on effective width.
  // Once an item doesn't fit, all subsequent items are hidden to preserve order.
  cumulativeWidth = 0;
  let overflowing = false;
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
 * the button width. Falls back to the actual button width or a gap estimate.
 */
export function measureMenuButtonWidth(wrapper: HTMLElement, menuButton: HTMLElement | undefined, gap: number): number {
  let width = wrapper.getBoundingClientRect().height;

  if ((isNaN(width) || width === 0) && menuButton) {
    width = menuButton.getBoundingClientRect().width;
  }

  // Include the menu button's margin so we reserve the full space it occupies.
  // When the menu button is not yet rendered, use the wrapper gap as an estimate
  // since the CSS sets both to the same design token (--sl-size-100).
  if (menuButton) {
    width += parseFloat(getComputedStyle(menuButton).marginInlineStart) || 0;
  } else {
    width += gap;
  }

  return width;
}

/**
 * Measure the content-box width of the host element using inline-size containment.
 *
 * Temporarily sets `contain: inline-size` so the browser treats the element's
 * intrinsic size as 0, preventing parent containers from expanding (e.g. a flex
 * child in a grid cell). Falls back to the natural width when containment
 * collapses the toolbar (e.g. `inline-size: fit-content`).
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
