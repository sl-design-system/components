var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { property } from 'lit/decorators.js';
let documentLanguage = document.documentElement.lang || navigator.language;
const connectedElements = /* @__PURE__ */ new Set();
const documentElementObserver = new MutationObserver(() => {
  documentLanguage = document.documentElement.lang || navigator.language;
  [...connectedElements.keys()].forEach(el => {
    if (typeof el.requestUpdate === 'function') {
      el.requestUpdate('locale');
    }
  });
});
documentElementObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});
export function LocaleMixin(constructor) {
  class LocaleImpl extends constructor {
    #locale;
    get locale() {
      return this.#locale ?? documentLanguage ?? 'default';
    }
    set locale(value) {
      this.#locale = value;
    }
    connectedCallback() {
      super.connectedCallback();
      connectedElements.add(this);
    }
    disconnectedCallback() {
      connectedElements.delete(this);
      super.disconnectedCallback();
    }
  }
  __decorateClass([property()], LocaleImpl.prototype, 'locale', 1);
  return LocaleImpl;
}
//# sourceMappingURL=locale-mixin.js.map
