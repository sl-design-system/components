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
  menuButtonWidth: {
    /** Button width including margin (used when some items are visible alongside the menu button). */
    full: number;
    /** Button width without margin (used when all items are hidden and the margin is removed via CSS). */
    base: number;
  }
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
  const effectiveWidth = availableWidth - (needsMenu ? menuButtonWidth.full : 0);

  // Second pass: set visibility based on effective width.
  setItemVisibility(items, widths, effectiveWidth, gap);

  // When all items are hidden, the menu button's margin is removed (via
  // the `all-items-hidden` CSS rule). Retry with just the base button width
  // (no margin) to see if an item fits, preventing an oscillation loop.
  if (needsMenu && items.every(item => !item.visible || item.type === 'divider')) {
    const effectiveWidthNoMargin = availableWidth - menuButtonWidth.base;

    setItemVisibility(items, widths, effectiveWidthNoMargin, gap);
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
 * Measure the overflow menu button width.
 * Returns both the full width (with margin, for normal overflow) and the base
 * width (without margin, for the all-items-hidden state where margin is removed).
 */
export function measureMenuButtonWidth(
  wrapper: HTMLElement,
  menuButton: HTMLElement | undefined,
  gap: number
): { full: number; base: number } {
  let base = wrapper.getBoundingClientRect().height;

  if ((isNaN(base) || base === 0) && menuButton) {
    base = menuButton.getBoundingClientRect().width;
  }

  // Calculate margin: actual value from the menu button, or gap as estimate.
  const margin = menuButton ? parseFloat(getComputedStyle(menuButton).marginInlineStart) || 0 : gap;

  return { full: base + margin, base };
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
