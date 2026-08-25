import { type ToolBarItem } from './mapping.js';
/**
 * Calculate which items should be visible based on available width.
 *
 * Runs a two-pass algorithm:
 *
 * 1. Determine whether an overflow menu is needed at all.
 * 2. Set each item's `visible` flag based on the effective width (accounting for the overflow menu
 *    button when present).
 *
 * After the two passes, orphaned dividers (dividers with no visible non-divider neighbours on
 * either side) are also hidden.
 *
 * This function **mutates** the `visible` property of each item in place.
 */
export declare function calculateVisibility(
  items: ToolBarItem[],
  widths: number[],
  availableWidth: number,
  gap: number,
  menuButtonWidth: number
): void;
/** Apply CSS visibility and positioning to items based on their `visible` flag. */
export declare function applyVisibility(items: ToolBarItem[]): void;
/** Reveal all items (set them visible) so they can be measured accurately. */
export declare function revealAllItems(items: ToolBarItem[]): void;
/**
 * Measure the widths of all items. Returns `undefined` if measurements are invalid (e.g.
 * non-divider items have zero width).
 */
export declare function measureItemWidths(items: ToolBarItem[]): number[] | undefined;
/**
 * Measure the overflow menu button width including its margin. Uses the wrapper height (the button
 * is square) and falls back to the actual button width when the wrapper has no height.
 */
export declare function measureMenuButtonWidth(
  wrapper: HTMLElement,
  menuButton: HTMLElement | undefined,
  gap: number
): number;
/**
 * Measure the available width using CSS containment to prevent the toolbar from expanding its
 * parent. Falls back to the parent's width if containment collapses the toolbar to zero.
 */
export declare function measureConstrainedWidth(
  host: HTMLElement,
  internals: ElementInternals
): number;
/** Compute the content-box width of an element. */
export declare function getContentBoxWidth(host: HTMLElement): number;
/**
 * Check if the host is wider than its parent. This means the host sizes itself by its content (e.g.
 * `inline-size: fit-content`) instead of filling the parent. A 1px tolerance avoids false positives
 * from sub-pixel rounding.
 */
export declare function isFitContent(host: HTMLElement, parent: HTMLElement): boolean;
/** Check if the wrapper's content is overflowing its visible bounds. */
export declare function hasWrapperOverflow(wrapper: HTMLElement): boolean;
