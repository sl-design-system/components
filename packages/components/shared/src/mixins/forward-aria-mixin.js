const ELEMENT_REFERENCES = {
  'aria-activedescendant': 'ariaActiveDescendantElement',
  'aria-controls': 'ariaControlsElements',
  'aria-describedby': 'ariaDescribedByElements',
  'aria-details': 'ariaDetailsElements',
  'aria-labelledby': 'ariaLabelledByElements',
  'aria-owns': 'ariaOwnsElements'
};
function setAriaDisabled(target, value) {
  target.ariaDisabled = value === 'true' ? 'true' : null;
}
export function ForwardAriaMixin(constructor, observedAttributes) {
  const interceptedProps = /* @__PURE__ */ new Set();
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
  const targetElements = /* @__PURE__ */ new WeakMap(),
    propertyStorage = /* @__PURE__ */ new WeakMap(),
    ariaDisabledStorage = /* @__PURE__ */ new WeakMap(),
    forwardedElementsStorage = /* @__PURE__ */ new WeakMap();
  class ForwardAriaImpl extends constructor {
    /** Set while `#forwardAttributes()` cleans up the host attribute it just forwarded. */
    #forwarding = false;
    #observer;
    #pendingAttributes = /* @__PURE__ */ new Set();
    static get observedAttributes() {
      return [...(super.observedAttributes ?? []), ...(observedAttributes ?? [])];
    }
    /** @internal */
    getProxyTarget() {
      return targetElements.get(this);
    }
    /** @internal */
    setProxyTarget(target) {
      targetElements.set(this, target);
      const stored = propertyStorage.get(this);
      if (stored) {
        for (const [prop, value] of stored) {
          if (value === null || (Array.isArray(value) && value.length === 0)) {
            continue;
          }
          target[prop] = value;
        }
      }
      if (ariaDisabledStorage.has(this)) {
        const value = ariaDisabledStorage.get(this) ?? null;
        setAriaDisabled(target, value);
      }
      this.#forwardAttributes();
    }
    connectedCallback() {
      super.connectedCallback();
      if (!observedAttributes) {
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
    disconnectedCallback() {
      this.#observer?.disconnect();
      this.#observer = void 0;
      super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (observedAttributes?.includes(name) && newValue !== null) {
        this.#pendingAttributes.add(name);
        this.#forwardAttributes();
      }
    }
    removeAttribute(name) {
      if (observedAttributes ? observedAttributes.includes(name) : name.startsWith('aria-')) {
        this.#pendingAttributes.delete(name);
        if (!this.#forwarding) {
          const target = targetElements.get(this);
          if (target) {
            if (name === 'aria-disabled') {
              setAriaDisabled(target, null);
              ariaDisabledStorage.set(this, null);
            } else {
              const elementsProp = ELEMENT_REFERENCES[name];
              if (elementsProp?.endsWith('Elements')) {
                const forwarded = forwardedElementsStorage.get(this),
                  previous = forwarded?.get(elementsProp) ?? [],
                  current = target[elementsProp] ?? [],
                  remaining = current.filter(el => !previous.includes(el));
                target[elementsProp] = remaining.length ? remaining : null;
                forwarded?.delete(elementsProp);
              } else if (elementsProp) {
                target[elementsProp] = null;
              } else {
                target.removeAttribute(name);
              }
            }
          }
        }
      }
      super.removeAttribute(name);
    }
    #forwardAttributes() {
      const targetElement = targetElements.get(this);
      if (!targetElement || this.#pendingAttributes.size === 0) {
        return;
      }
      const root = this.getRootNode();
      for (const name of this.#pendingAttributes) {
        const value = this.getAttribute(name);
        if (!value) {
          continue;
        }
        const elementsProp = ELEMENT_REFERENCES[name];
        if (elementsProp) {
          const elements = value
            .split(/\s+/)
            .map(id => root.querySelector(`#${CSS.escape(id)}`))
            .filter(el => el !== null);
          if (elementsProp.endsWith('Elements')) {
            let forwarded = forwardedElementsStorage.get(this);
            if (!forwarded) {
              forwarded = /* @__PURE__ */ new Map();
              forwardedElementsStorage.set(this, forwarded);
            }
            const current = targetElement[elementsProp] ?? [],
              ours = /* @__PURE__ */ new Set([...(forwarded.get(elementsProp) ?? []), ...elements]);
            targetElement[elementsProp] = [...current.filter(el => !ours.has(el)), ...elements];
            forwarded.set(elementsProp, elements);
          } else {
            targetElement[elementsProp] = elements[0] ?? null;
          }
        } else {
          targetElement.setAttribute(name, value);
        }
        this.#forwarding = true;
        this.removeAttribute(name);
        this.#forwarding = false;
      }
      this.#pendingAttributes.clear();
    }
  }
  Object.defineProperty(ForwardAriaImpl.prototype, 'ariaDisabled', {
    configurable: true,
    enumerable: true,
    get() {
      return ariaDisabledStorage.get(this) ?? null;
    },
    set(value) {
      ariaDisabledStorage.set(this, value);
      const target = targetElements.get(this);
      if (target) {
        setAriaDisabled(target, value);
      }
    }
  });
  for (const prop of interceptedProps) {
    Object.defineProperty(ForwardAriaImpl.prototype, prop, {
      configurable: true,
      enumerable: true,
      get() {
        return propertyStorage.get(this)?.get(prop) ?? null;
      },
      set(value) {
        let stored = propertyStorage.get(this);
        if (!stored) {
          stored = /* @__PURE__ */ new Map();
          propertyStorage.set(this, stored);
        }
        stored.set(prop, value);
        const target = targetElements.get(this);
        if (target) {
          target[prop] = value;
        }
      }
    });
  }
  return ForwardAriaImpl;
}
//# sourceMappingURL=forward-aria-mixin.js.map
