import { type ButtonFill } from '@sl-design-system/button';
/**
 * Propagate `fill`, `variant` and `inverted` attributes to child buttons, menu-buttons and
 * tool-bar-dividers inside the given elements.
 */
export declare function updateChildAttributes(
  elements: Element[],
  fill?: ButtonFill,
  inverted?: boolean
): void;
