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

  // Calculate effective width (reserve space for menu button + gap before it)
  const menuButtonTotalWidth = needsMenu ? menuButtonWidth + gap : 0,
    effectiveWidth = availableWidth - menuButtonTotalWidth;

  // Second pass: set visibility based on effective width
  cumulativeWidth = 0;
  for (let i = 0; i < items.length; i++) {
    const itemWidth = widths[i],
      gapWidth = i > 0 ? gap : 0,
      requiredWidth = cumulativeWidth + gapWidth + itemWidth;

    items[i].visible = requiredWidth <= effectiveWidth;

    if (items[i].visible) {
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
