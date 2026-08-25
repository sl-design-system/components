import { type Button } from '@sl-design-system/button';
import { type MenuButton } from '@sl-design-system/menu';
type InteractiveElement = Button | MenuButton;
/**
 * Find all direct child buttons and menu-buttons of the given host element, filtering to only those
 * whose closest `sl-tool-bar` ancestor is the host itself.
 */
export declare function queryToolBarButtons(host: HTMLElement): InteractiveElement[];
/**
 * Synchronize the disabled state of the toolbar host to its child buttons and menu-buttons.
 *
 * When `disabled` is `true`, every child is converted to `aria-disabled="true"` so it remains
 * focusable (required for roving tabindex). The original disabled state of each element is tracked
 * via `data-toolbar-*` attributes so it can be faithfully restored when the toolbar is re-enabled.
 *
 * Tracking attributes:
 *
 * - `data-toolbar-disabled-native` – element was natively `disabled` (value: `"attribute"` or
 *   `"property"`)
 * - `data-toolbar-disabled-original` – element already had an `aria-disabled` value (stored as-is)
 * - `data-toolbar-disabled` – element had no disabled state; we added `aria-disabled`
 */
export declare function syncDisabledState(host: HTMLElement, disabled: boolean | undefined): void;
export {};
