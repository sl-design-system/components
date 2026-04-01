import { getButtonAccessibleName, getButtonDescription, isButtonDisabled } from '@sl-design-system/button/helpers.js';
import { type MenuButton } from './menu-button.js';

/**
 * Returns the accessible name for the given menu button, following the accessible
 * name computation priority: aria-labelledby → aria-label → slotted button content.
 *
 * `MenuButton` proxies ARIA to its inner `sl-button` via `ProxyAriaAttributesMixin`.
 * Reference attributes (`aria-labelledby`) are set as element properties on the
 * `sl-button` and don't propagate further, so they must be checked there. Value
 * attributes (`aria-label`) are forwarded as attributes to `sl-button`, which then
 * delegates to `getButtonAccessibleName`.
 */
export function getMenuButtonAccessibleName(menuButton: MenuButton): string {
  // Delegate aria-label and text content resolution to the button helper
  return getButtonAccessibleName(menuButton.button);
}

/**
 * Returns the accessible description for the given menu button, following the
 * priority: aria-describedby → aria-description.
 *
 * `MenuButton` proxies ARIA to its inner `sl-button` via `ProxyAriaAttributesMixin`.
 * Reference attributes (`aria-describedby`) are set as element properties on the
 * `sl-button` and don't propagate further, so they must be checked there. Value
 * attributes (`aria-description`) are forwarded as attributes to `sl-button`, which
 * then delegates to `getButtonDescription`.
 */
export function getMenuButtonDescription(menuButton: MenuButton): string {
  const slButton = menuButton.renderRoot?.querySelector('sl-button');

  // aria-describedby stays on sl-button as element references (not forwarded further)
  const describedBy = slButton?.ariaDescribedByElements ?? [];
  if (describedBy.length) {
    return describedBy
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');
  }

  // Delegate aria-description resolution to the button helper
  if (slButton) {
    return getButtonDescription(slButton);
  }

  return '';
}

/**
 * Returns the disabled state of the given menu button:
 * - `false` if the menu button is not disabled
 * - `true` if the menu button is natively disabled (the `disabled` property)
 * - `'aria'` if the menu button is disabled via `aria-disabled="true"`
 *
 * Delegates to `isButtonDisabled` with the inner `sl-button`.
 */
export function isMenuButtonDisabled(menuButton: MenuButton): false | true | 'aria' {
  return isButtonDisabled(menuButton.button);
}
