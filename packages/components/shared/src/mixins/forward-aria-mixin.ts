import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';

export interface ForwardAriaMixinInterface {
  getProxyTarget(): HTMLElement | undefined;
  setProxyTarget(target: HTMLElement): void;
}

const ELEMENT_REFERENCES: Record<string, keyof ARIAMixin> = {
  'aria-activedescendant': 'ariaActiveDescendantElement',
  'aria-controls': 'ariaControlsElements',
  'aria-describedby': 'ariaDescribedByElements',
  'aria-details': 'ariaDetailsElements',
  'aria-labelledby': 'ariaLabelledByElements',
  'aria-owns': 'ariaOwnsElements'
};

const ELEMENT_REFERENCE_ATTRIBUTES: Partial<Record<keyof ARIAMixin, string>> = Object.fromEntries(
  Object.entries(ELEMENT_REFERENCES).map(([attribute, prop]) => [prop, attribute])
);

const MIRRORED_REFERENCE_ATTRIBUTES = new Set(['aria-labelledby']);

let nextMirrorId = 0;

const syncReferenceAttribute = Symbol('syncReferenceAttribute');

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
export function ForwardAriaMixin<
  T extends Constructor<ReactiveElement> & { observedAttributes?: string[] }
>(constructor: T, observedAttributes?: string[]): T & Constructor<ForwardAriaMixinInterface> {
  // Build the set of element reference properties (e.g. ariaLabelledByElements) that
  // correspond to the observed attributes. These need prototype-level property interceptors
  // to support nesting (see the defineProperty loop below).
  const interceptedProps = new Set<keyof ARIAMixin>();
  if (observedAttributes) {
    for (const attr of observedAttributes) {
      const prop = ELEMENT_REFERENCES[attr];
      if (prop) {
        interceptedProps.add(prop);
      }
    }
  } else {
    for (const prop of Object.values(ELEMENT_REFERENCES)) {
      interceptedProps.add(prop);
    }
  }

  // WeakMaps keyed by instance so private state is accessible from both the class
  // methods and the defineProperty interceptors (which can't access #private fields).
  const targetElements = new WeakMap<ForwardAriaImpl, HTMLElement>(),
    propertyStorage = new WeakMap<ForwardAriaImpl, Map<string, Element[] | Element | null>>(),
    ariaDisabledStorage = new WeakMap<ForwardAriaImpl, string | null>();

  class ForwardAriaImpl extends constructor {
    #observer?: MutationObserver;
    #rootObserver?: MutationObserver;
    #referenceMirrors = new Map<
      keyof ARIAMixin,
      {
        elements: HTMLElement[];
        observer: MutationObserver;
        sourceIds: string[];
        sources: HTMLElement[];
      }
    >();
    #pendingAttributes = new Set<string>();
    #unresolvedReferenceAttributes = new Map<string, string>();

    static override get observedAttributes(): string[] {
      return [...(super.observedAttributes ?? []), ...(observedAttributes ?? [])];
    }

    /** @internal */
    getProxyTarget(): HTMLElement | undefined {
      return targetElements.get(this);
    }

    /** @internal */
    setProxyTarget(target: HTMLElement): void {
      targetElements.set(this, target);

      // Forward any element reference properties that were set before the target was available
      const stored = propertyStorage.get(this);
      if (stored) {
        for (const [prop, value] of stored) {
          (target as unknown as Record<string, Element[] | Element | null>)[prop] = value;
        }
      }

      // Forward ariaDisabled if it was set via property before the target was available
      if (ariaDisabledStorage.has(this)) {
        const value = ariaDisabledStorage.get(this) ?? null;
        if (value === 'true') {
          target.setAttribute('aria-disabled', 'true');
        } else {
          target.removeAttribute('aria-disabled');
        }
      }

      // Forward any attributes that were set before the target was available
      this.#forwardAttributes();
    }

    override connectedCallback(): void {
      super.connectedCallback();

      // When no explicit list of attributes is provided, use a MutationObserver to
      // catch any aria-* attribute that gets set on the host (including ones set
      // before the element upgraded or before the target is available).
      if (!observedAttributes) {
        // Collect any aria-* attributes already present on the element
        for (const { name } of this.attributes) {
          if (name.startsWith('aria-')) {
            this.#pendingAttributes.add(name);
          }
        }

        this.#observer = new MutationObserver(mutations => {
          for (const { attributeName } of mutations) {
            if (attributeName?.startsWith('aria-')) {
              this.#pendingAttributes.add(attributeName);
            }
          }

          this.#forwardAttributes();
        });
        this.#observer.observe(this, { attributes: true });
      }
    }

    override disconnectedCallback(): void {
      this.#observer?.disconnect();
      this.#observer = undefined;
      this.#rootObserver?.disconnect();
      this.#rootObserver = undefined;
      this.#clearReferenceMirrors();
      this.#unresolvedReferenceAttributes.clear();

      super.disconnectedCallback();
    }

    override attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      // Only intercept attributes from our explicit list (the MutationObserver
      // path handles the "observe everything" case in connectedCallback).
      if (observedAttributes?.includes(name) && newValue !== null) {
        this.#pendingAttributes.add(name);
        this.#forwardAttributes();
      }
    }

    #forwardAttributes(): void {
      const targetElement = targetElements.get(this);

      if (!targetElement || this.#pendingAttributes.size === 0) {
        return;
      }

      // Resolve IDs from the host's root (light DOM document or parent shadow root),
      // not from our own shadow root.
      const root = this.getRootNode() as Document | ShadowRoot;

      for (const name of this.#pendingAttributes) {
        const value = this.getAttribute(name);
        if (!value) {
          continue;
        }

        const elementsProp = ELEMENT_REFERENCES[name];
        if (elementsProp) {
          // Reference attribute: resolve space-separated IDs to DOM elements and
          // assign via the element reference property (singular or plural).
          const ids = this.#parseReferenceIds(value),
            elements = this.#resolveReferenceElements(root, ids);

          // Keep track of unresolved id-based references so we can retry when matching elements
          // are inserted later (for example sibling tooltips rendered after the control).
          if (elements.length < ids.length) {
            this.#unresolvedReferenceAttributes.set(name, value);
            this.#ensureRootObserver(root);
          } else {
            this.#deleteUnresolvedReferenceAttribute(name);
          }

          this.#setElementReference(targetElement, elementsProp, elements);
        } else {
          targetElement.setAttribute(name, value);
        }

        this.removeAttribute(name);
      }

      this.#pendingAttributes.clear();
    }

    #ensureRootObserver(root: Document | ShadowRoot): void {
      if (this.#rootObserver) {
        return;
      }

      this.#rootObserver = new MutationObserver(() => this.#retryUnresolvedReferenceAttributes());
      this.#rootObserver.observe(root, { childList: true, subtree: true });
    }

    #retryUnresolvedReferenceAttributes(): void {
      const targetElement = targetElements.get(this);
      if (!targetElement || this.#unresolvedReferenceAttributes.size === 0) {
        return;
      }

      const root = this.getRootNode() as Document | ShadowRoot;

      for (const [name, value] of this.#unresolvedReferenceAttributes) {
        const elementsProp = ELEMENT_REFERENCES[name];
        if (!elementsProp) {
          this.#deleteUnresolvedReferenceAttribute(name);
          continue;
        }

        const ids = this.#parseReferenceIds(value),
          elements = this.#resolveReferenceElements(root, ids);

        if (elements.length === 0) {
          continue;
        }

        this.#setElementReference(targetElement, elementsProp, elements);

        if (elements.length === ids.length) {
          this.#deleteUnresolvedReferenceAttribute(name);
        }
      }
    }

    #parseReferenceIds(value: string): string[] {
      return value.trim().split(/\s+/).filter(Boolean);
    }

    #resolveReferenceElements(root: Document | ShadowRoot, ids: string[]): HTMLElement[] {
      return ids
        .map(id => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
        .filter((el): el is HTMLElement => el !== null);
    }

    #deleteUnresolvedReferenceAttribute(name: string): void {
      this.#unresolvedReferenceAttributes.delete(name);
      if (this.#unresolvedReferenceAttributes.size === 0) {
        this.#rootObserver?.disconnect();
        this.#rootObserver = undefined;
      }
    }

    #setElementReference(
      targetElement: HTMLElement,
      elementsProp: keyof ARIAMixin,
      elements: HTMLElement[]
    ): void {
      if (elementsProp.endsWith('Elements')) {
        (targetElement as unknown as Record<string, Element[]>)[elementsProp] = elements;
      } else {
        (targetElement as unknown as Record<string, Element | null>)[elementsProp] =
          elements[0] ?? null;
      }

      this[syncReferenceAttribute](targetElement, elementsProp, elements);
    }

    [syncReferenceAttribute](
      targetElement: HTMLElement,
      elementsProp: keyof ARIAMixin,
      elements: HTMLElement[]
    ): void {
      const attribute = ELEMENT_REFERENCE_ATTRIBUTES[elementsProp];
      if (!attribute || !MIRRORED_REFERENCE_ATTRIBUTES.has(attribute)) {
        return;
      }

      if ('getProxyTarget' in targetElement) {
        return;
      }

      const targetRoot = targetElement.getRootNode();
      if (targetRoot instanceof Document || targetRoot instanceof ShadowRoot) {
        const sameRootIds = elements
          .filter(element => element.id && element.getRootNode() === targetRoot)
          .map(element => element.id);

        if (sameRootIds.length === elements.length) {
          this.#removeReferenceMirror(elementsProp);
          if (sameRootIds.length) {
            targetElement.setAttribute(attribute, sameRootIds.join(' '));
          } else {
            targetElement.removeAttribute(attribute);
          }
          return;
        }
      }

      this.#syncReferenceMirror(targetElement, elementsProp, elements);
    }

    #syncReferenceMirror(
      targetElement: HTMLElement,
      elementsProp: keyof ARIAMixin,
      elements: HTMLElement[]
    ): void {
      const attribute = ELEMENT_REFERENCE_ATTRIBUTES[elementsProp];
      if (!attribute) {
        return;
      }

      if (!elements.length) {
        targetElement.removeAttribute(attribute);
        this.#removeReferenceMirror(elementsProp);

        if (elementsProp.endsWith('Elements')) {
          (targetElement as unknown as Record<string, Element[]>)[elementsProp] = [];
        } else {
          (targetElement as unknown as Record<string, Element | null>)[elementsProp] = null;
        }
        return;
      }

      const root = targetElement.getRootNode(),
        ownerDocument = targetElement.ownerDocument ?? document,
        parent = root instanceof ShadowRoot ? root : ownerDocument.body,
        sourceIds = elements.map(source => source.id);
      let mirror = this.#referenceMirrors.get(elementsProp);

      if (
        !mirror ||
        mirror.sources.length !== elements.length ||
        mirror.sources.some((source, index) => source !== elements[index]) ||
        mirror.sourceIds.some((id, index) => id !== sourceIds[index])
      ) {
        this.#removeReferenceMirror(elementsProp);

        mirror = {
          elements: elements.map(source => {
            const element = ownerDocument.createElement('span');

            element.id = source.id || `sl-forwarded-aria-${nextMirrorId++}`;
            this.#makeVisuallyHidden(element);
            parent.appendChild(element);

            return element;
          }),
          observer: new MutationObserver(() =>
            this.#updateReferenceMirrorText(elementsProp, elements)
          ),
          sourceIds,
          sources: elements
        };
        this.#referenceMirrors.set(elementsProp, mirror);
      }

      mirror.observer.disconnect();
      for (const element of elements) {
        mirror.observer.observe(element, {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true
        });
      }

      this.#updateReferenceMirrorText(elementsProp, elements);
      targetElement.setAttribute(attribute, mirror.elements.map(element => element.id).join(' '));
    }

    #updateReferenceMirrorText(elementsProp: keyof ARIAMixin, elements: HTMLElement[]): void {
      const mirror = this.#referenceMirrors.get(elementsProp);
      if (!mirror) {
        return;
      }

      mirror.elements.forEach((mirrorElement, index) => {
        mirrorElement.textContent = elements[index]?.textContent?.trim() ?? '';
      });
    }

    #removeReferenceMirror(elementsProp: keyof ARIAMixin): void {
      const mirror = this.#referenceMirrors.get(elementsProp);
      if (!mirror) {
        return;
      }

      mirror.observer.disconnect();
      mirror.elements.forEach(element => element.remove());
      this.#referenceMirrors.delete(elementsProp);
    }

    #clearReferenceMirrors(): void {
      for (const prop of this.#referenceMirrors.keys()) {
        this.#removeReferenceMirror(prop);
      }
    }

    #makeVisuallyHidden(element: HTMLElement): void {
      element.style.position = 'absolute';
      element.style.width = '1px';
      element.style.height = '1px';
      element.style.padding = '0';
      element.style.margin = '-1px';
      element.style.overflow = 'hidden';
      element.style.clip = 'rect(0, 0, 0, 0)';
      element.style.clipPath = 'inset(50%)';
      element.style.whiteSpace = 'nowrap';
      element.style.border = '0';
    }
  }

  // Intercept the ariaDisabled property so that setting it to null/false removes
  // aria-disabled from the target, which the MutationObserver/attributeChangedCallback
  // path cannot do (it skips null attribute values in #forwardAttributes).
  Object.defineProperty(ForwardAriaImpl.prototype, 'ariaDisabled', {
    configurable: true,
    enumerable: true,
    get(this: ForwardAriaImpl): string | null {
      return ariaDisabledStorage.get(this) ?? null;
    },
    set(this: ForwardAriaImpl, value: string | null) {
      ariaDisabledStorage.set(this, value);

      const target = targetElements.get(this);
      if (target) {
        if (value === 'true') {
          target.setAttribute('aria-disabled', 'true');
        } else {
          target.removeAttribute('aria-disabled');
        }
      }
    }
  });

  // Intercept element reference property assignments on the prototype. This is what
  // enables nesting: when a parent mixin resolves e.g. aria-labelledby to elements and
  // sets ariaLabelledByElements on this host, the setter stores the value *and* forwards
  // it to our own proxy target. If the target isn't available yet (it renders later),
  // the value is buffered in propertyStorage and flushed in setProxyTarget.
  for (const prop of interceptedProps) {
    Object.defineProperty(ForwardAriaImpl.prototype, prop, {
      configurable: true,
      enumerable: true,
      get(this: ForwardAriaImpl) {
        return propertyStorage.get(this)?.get(prop) ?? null;
      },
      set(this: ForwardAriaImpl, value: Element[] | Element | null) {
        let stored = propertyStorage.get(this);
        if (!stored) {
          stored = new Map();
          propertyStorage.set(this, stored);
        }
        stored.set(prop, value);

        const target = targetElements.get(this);
        if (target) {
          (target as unknown as Record<string, Element[] | Element | null>)[prop] = value;
          this[syncReferenceAttribute](
            target,
            prop,
            (Array.isArray(value) ? value : value ? [value] : []).filter(
              (element): element is HTMLElement => element instanceof HTMLElement
            )
          );
        }
      }
    });
  }

  return ForwardAriaImpl;
}
