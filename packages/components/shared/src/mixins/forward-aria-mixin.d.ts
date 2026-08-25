import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';
export interface ForwardAriaMixinInterface {
  getProxyTarget(): HTMLElement | undefined;
  setProxyTarget(target: HTMLElement): void;
}
/**
 * Mixin that forwards ARIA attributes from a custom element host to a target element inside its
 * shadow DOM. This is necessary because screen readers cannot pierce the shadow boundary, so ARIA
 * attributes set on the host (e.g. by a consumer) must be forwarded to the actual interactive
 * element (e.g. a native `<button>`).
 *
 * The host calls `setProxyTarget(element)` (typically in `firstUpdated`) to designate the element
 * that should receive the forwarded attributes.
 *
 * There are two categories of ARIA attributes:
 *
 * - **Reference attributes** like `aria-labelledby` and `aria-describedby` point to other elements by
 *   ID. These are resolved to actual DOM elements and set via the corresponding element reference
 *   properties (e.g. `ariaLabelledByElements`) on the target.
 * - **Value attributes** like `aria-label` and `aria-disabled` are simple strings and are forwarded
 *   as regular attributes on the target.
 *
 * In both cases the attribute is removed from the host after forwarding, so the host element does
 * not expose duplicate or stale ARIA information.
 *
 * **`ariaDisabled` property:** The mixin intercepts the `ariaDisabled` property directly so that
 * both setting and clearing it are forwarded to the target. Setting `ariaDisabled` to `'true'` adds
 * `aria-disabled="true"` on the target; setting it to `null` (or any value other than `'true'`)
 * removes `aria-disabled` from the target. This is necessary because the `MutationObserver` path
 * cannot detect attribute _removal_ and would otherwise leave the target in a stale disabled
 * state.
 *
 * **Nesting:** When two components using this mixin are nested (e.g. `<sl-menu-button>` containing
 * `<sl-button>`), the outer mixin sets element reference properties on the inner host. The inner
 * host intercepts these property assignments and forwards them to its own target, so references
 * propagate all the way to the deepest native element.
 *
 * **Observed attributes:** Pass an array of attribute names to forward only those. When omitted,
 * all `aria-*` attributes are forwarded automatically using a MutationObserver.
 */
export declare function ForwardAriaMixin<
  T extends Constructor<ReactiveElement> & {
    observedAttributes?: string[];
  }
>(constructor: T, observedAttributes?: string[]): T & Constructor<ForwardAriaMixinInterface>;
