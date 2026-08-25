export function ObserveAttributesMixin(constructor, observedAttributes = []) {
  class ObserveAttributesImpl extends constructor {
    #targetElement;
    static get observedAttributes() {
      return [...(super.observedAttributes ?? []), ...observedAttributes];
    }
    /** @internal */
    setAttributesTarget(target) {
      this.#targetElement = target;
    }
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      requestAnimationFrame(() => {
        if (this.#targetElement && observedAttributes.includes(name)) {
          const value = this.getAttribute(name);
          if (value !== null) {
            this.#targetElement.setAttribute(name, value);
            this.removeAttribute(name);
          }
        }
      });
    }
  }
  return ObserveAttributesImpl;
}
//# sourceMappingURL=observe-attributes-mixin.js.map
