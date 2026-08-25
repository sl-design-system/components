import { type LitElement } from 'lit';
import { type ForwardAriaMixinInterface } from '../mixins/forward-aria-mixin.js';
/**
 * Returns the accessible name for the given element that uses `ForwardAriaMixin`, following the
 * accessible name computation priority: aria-labelledby → aria-label → text content.
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 */
export declare function getForwardedAccessibleName(
  host: LitElement & ForwardAriaMixinInterface
): string;
/**
 * Returns the accessible description for the given element that uses `ForwardAriaMixin`, following
 * the priority: aria-describedby → aria-description.
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 */
export declare function getForwardedDescription(
  host: LitElement & ForwardAriaMixinInterface
): string;
/**
 * Returns the value of the given ARIA attribute on the forwarding target element. Because
 * `ForwardAriaMixin` forwards ARIA attributes from the host to the target, this is where the actual
 * value ends up.
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 * @param name The ARIA attribute name (e.g. 'aria-expanded', 'aria-current').
 */
export declare function getForwardedAriaAttribute(
  host: LitElement & ForwardAriaMixinInterface,
  name: string
): string | null;
/**
 * Returns the value of the given ARIA property on the forwarding target element. This is useful for
 * element reference properties like `ariaLabelledByElements` or `ariaDescribedByElements` that
 * `ForwardAriaMixin` forwards from the host to the target.
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 * @param name The property name on the target element (e.g. 'ariaLabelledByElements').
 */
export declare function getForwardedAriaProperty<K extends keyof HTMLElement>(
  host: LitElement & ForwardAriaMixinInterface,
  name: K
): HTMLElement[K] | undefined;
/**
 * Returns the disabled state of the given element: - `false` if the element is not disabled -
 * `true` if the element is natively disabled (the `disabled` attribute/property) - `'aria'` if the
 * element is disabled via `aria-disabled="true"`
 *
 * @param host The custom element host that uses `ForwardAriaMixin`.
 */
export declare function isForwardedDisabled(
  host: LitElement & ForwardAriaMixinInterface
): false | true | 'aria';
