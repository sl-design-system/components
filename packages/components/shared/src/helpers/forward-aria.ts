import { type LitElement } from 'lit';
import { type ForwardAriaMixinInterface } from '../mixins/forward-aria-mixin.js';

/**
 * Follows the forwarding target chain to the deepest element. When the target itself
 * also uses `ForwardAriaMixin`, its `getProxyTarget()` is followed recursively
 * so that the helpers read from the actual native element where ARIA ends up.
 */
function resolveDeepTarget(host: LitElement & ForwardAriaMixinInterface): HTMLElement | undefined {
  let target = host.getProxyTarget();

  while (target && 'getProxyTarget' in target) {
    const next = (target as unknown as ForwardAriaMixinInterface).getProxyTarget();
    if (!next || next === target) break;
    target = next;
  }

  return target;
}

/**
 * Returns the accessible name for the given element that uses `ForwardAriaMixin`,
 * following the accessible name computation priority: aria-labelledby → aria-label → text content.
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 */
export function getForwardedAccessibleName(host: LitElement & ForwardAriaMixinInterface): string {
  const target = resolveDeepTarget(host);

  // 1. aria-labelledby
  const labelledBy = (target as Element)?.ariaLabelledByElements ?? [];
  if (labelledBy.length) {
    return labelledBy
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');
  }

  // 2. aria-label
  const ariaLabel = target?.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // 3. Slotted text content
  const slot = host.renderRoot?.querySelector('slot'),
    nodes = slot?.assignedNodes({ flatten: true }) ?? [];

  return nodes
    .map(node => node.textContent?.trim())
    .filter(Boolean)
    .join(' ');
}

/**
 * Returns the accessible description for the given element that uses `ForwardAriaMixin`,
 * following the priority: aria-describedby → aria-description.
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 */
export function getForwardedDescription(host: LitElement & ForwardAriaMixinInterface): string {
  const target = resolveDeepTarget(host);

  // 1. aria-describedby
  const describedBy = (target as Element)?.ariaDescribedByElements ?? [];
  if (describedBy.length) {
    return describedBy
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');
  }

  // 2. aria-description
  return target?.getAttribute('aria-description') || host.getAttribute('aria-description') || '';
}

/**
 * Returns the value of the given ARIA attribute on the forwarding target element.
 * Because `ForwardAriaMixin` forwards ARIA attributes from the host to
 * the target, this is where the actual value ends up.
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 * @param name The ARIA attribute name (e.g. 'aria-expanded', 'aria-current').
 */
export function getForwardedAriaAttribute(host: LitElement & ForwardAriaMixinInterface, name: string): string | null {
  return resolveDeepTarget(host)?.getAttribute(name) ?? null;
}

/**
 * Returns the value of the given ARIA property on the forwarding target element.
 * This is useful for element reference properties like `ariaLabelledByElements`
 * or `ariaDescribedByElements` that `ForwardAriaMixin` forwards from
 * the host to the target.
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 * @param name The property name on the target element (e.g. 'ariaLabelledByElements').
 */
export function getForwardedAriaProperty<K extends keyof HTMLElement>(
  host: LitElement & ForwardAriaMixinInterface,
  name: K
): HTMLElement[K] | undefined {
  return (resolveDeepTarget(host) as HTMLElement)?.[name];
}

/**
 * Returns the disabled state of the given element:
 * - `false` if the element is not disabled
 * - `true` if the element is natively disabled (the `disabled` attribute/property)
 * - `'aria'` if the element is disabled via `aria-disabled="true"`
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 */
export function isForwardedDisabled(host: LitElement & ForwardAriaMixinInterface): false | true | 'aria' {
  if ((host as unknown as { disabled?: boolean }).disabled) {
    return true;
  }

  const target = resolveDeepTarget(host);

  if (target?.ariaDisabled === 'true' || host.getAttribute('aria-disabled') === 'true') {
    return 'aria';
  }

  return false;
}
