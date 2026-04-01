import { type Button } from './button.js';

/**
 * Returns the accessible name for the given button, following the accessible
 * name computation priority: aria-labelledby → aria-label → text content.
 *
 * Because `Button` uses `ProxyAriaAttributesMixin`, ARIA attributes on the host
 * may have been forwarded to the inner `<button>`. This function checks both.
 */
export function getButtonAccessibleName(button: Button): string {
  const inner = button.renderRoot?.querySelector('button');

  // 1. aria-labelledby (check inner button first since proxy forwards it)
  const labelledBy = inner?.ariaLabelledByElements ?? [];
  if (labelledBy.length) {
    return labelledBy
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');
  }

  // 2. aria-label (check inner button first since proxy forwards it)
  const ariaLabel = inner?.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // 3. Slotted text content
  const slot = button.renderRoot?.querySelector('slot'),
    nodes = slot?.assignedNodes({ flatten: true }) ?? [];

  return nodes
    .map(node => node.textContent?.trim())
    .filter(Boolean)
    .join(' ');
}

/**
 * Returns the value of the given ARIA attribute on the inner `<button>` element.
 * Because `ProxyAriaAttributesMixin` forwards ARIA attributes from the host to
 * the inner button, this is where the actual value ends up.
 */
export function getButtonAriaAttribute(button: Button, name: string): string | null {
  return button.renderRoot?.querySelector('button')?.getAttribute(name) ?? null;
}

/**
 * Returns the value of the given ARIA property on the inner `<button>` element.
 * This is useful for element reference properties like `ariaLabelledByElements`
 * or `ariaDescribedByElements` that `ProxyAriaAttributesMixin` forwards from
 * the host to the inner button.
 */
export function getButtonAriaProperty<K extends keyof HTMLButtonElement>(
  button: Button,
  name: K
): HTMLButtonElement[K] | undefined {
  return button.renderRoot?.querySelector('button')?.[name];
}

/**
 * Returns the accessible description for the given button, following the
 * priority: aria-describedby → aria-description.
 *
 * Because `Button` uses `ProxyAriaAttributesMixin`, ARIA attributes on the host
 * may have been forwarded to the inner `<button>`. This function checks both.
 */
export function getButtonDescription(button: Button): string {
  const inner = button.renderRoot?.querySelector('button');

  // 1. aria-describedby (check inner button first since proxy forwards it)
  const describedBy = inner?.ariaDescribedByElements ?? [];
  if (describedBy.length) {
    return describedBy
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');
  }

  // 2. aria-description (check inner button first since proxy forwards it)
  return inner?.getAttribute('aria-description') || button.getAttribute('aria-description') || '';
}

/**
 * Returns the disabled state of the given button:
 * - `false` if the button is not disabled
 * - `true` if the button is natively disabled (the `disabled` attribute/property)
 * - `'aria'` if the button is disabled via `aria-disabled="true"`
 *
 * Because `Button` uses `ProxyAriaAttributesMixin`, `aria-disabled` on the host
 * may have been forwarded to the inner `<button>`. This function checks both.
 */
export function isButtonDisabled(button: Button): false | true | 'aria' {
  if (button.disabled) {
    return true;
  }

  const inner = button.renderRoot?.querySelector('button');

  if (inner?.ariaDisabled === 'true' || button.getAttribute('aria-disabled') === 'true') {
    return 'aria';
  }

  return false;
}
