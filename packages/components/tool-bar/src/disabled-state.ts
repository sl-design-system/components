import { type Button } from '@sl-design-system/button';
import { type MenuButton } from '@sl-design-system/menu';

type InteractiveElement = Button | MenuButton;

/**
 * Find all direct child buttons and menu-buttons of the given host element, filtering to only those
 * whose closest `sl-tool-bar` ancestor is the host itself.
 */
export function queryToolBarButtons(host: HTMLElement): InteractiveElement[] {
  return Array.from(host.querySelectorAll('sl-button, sl-menu-button')).filter(
    btn => btn.closest('sl-tool-bar') === host
  ) as InteractiveElement[];
}

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
export function syncDisabledState(host: HTMLElement, disabled: boolean | undefined): void {
  const buttons = queryToolBarButtons(host);

  if (disabled) {
    buttons.forEach(el => {
      if (el.hasAttribute('disabled') || el.disabled) {
        // If natively disabled, convert to aria-disabled for focusability
        const isAttribute = el.hasAttribute('disabled');
        el.removeAttribute('disabled');
        if ('ariaDisabled' in el) {
          el.ariaDisabled = 'true';
        }
        el.disabled = false;
        el.setAttribute('data-toolbar-disabled-native', isAttribute ? 'attribute' : 'property');
      } else if (
        !el.hasAttribute('data-toolbar-disabled') &&
        !el.hasAttribute('data-toolbar-disabled-original') &&
        !el.hasAttribute('data-toolbar-disabled-native')
      ) {
        // Store original aria-disabled state if we haven't already
        let ariaDisabled = el.getAttribute('aria-disabled');
        if (el.tagName === 'SL-MENU-BUTTON' && ariaDisabled === null) {
          const internalButton = el.renderRoot.querySelector('sl-button');
          ariaDisabled = internalButton?.getAttribute('aria-disabled') ?? null;
        }

        if (ariaDisabled !== null) {
          el.setAttribute('data-toolbar-disabled-original', ariaDisabled);
        } else {
          el.setAttribute('data-toolbar-disabled', '');
        }
        el.ariaDisabled = 'true';
      }
    });
  } else {
    buttons.forEach(el => {
      const nativeMarker = el.getAttribute('data-toolbar-disabled-native');
      if (nativeMarker !== null) {
        if (nativeMarker === 'attribute') {
          el.setAttribute('disabled', '');
        }
        el.disabled = true;
        el.ariaDisabled = null;
        el.removeAttribute('data-toolbar-disabled-native');
        el.removeAttribute('data-toolbar-disabled-original');
        el.removeAttribute('data-toolbar-disabled');
      } else if (el.hasAttribute('data-toolbar-disabled-original')) {
        const original = el.getAttribute('data-toolbar-disabled-original');
        el.ariaDisabled = original;
        el.removeAttribute('data-toolbar-disabled-original');
        el.removeAttribute('data-toolbar-disabled');
      } else if (el.hasAttribute('data-toolbar-disabled')) {
        el.ariaDisabled = null;
        el.removeAttribute('data-toolbar-disabled');
      }
    });
  }
}
