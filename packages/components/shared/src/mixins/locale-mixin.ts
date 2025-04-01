import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';
import { property } from 'lit/decorators.js';

export interface Locale {
  locale?: string;
}

let documentLanguage = document.documentElement.lang || navigator.language;

const connectedElements = new Set<ReactiveElement>();
const documentElementObserver = new MutationObserver(() => {
  documentLanguage = document.documentElement.lang || navigator.language;

  [...connectedElements.keys()].forEach((el: ReactiveElement) => {
    if (typeof el.requestUpdate === 'function') {
      el.requestUpdate();
    }
  });
});

// Watch for changes on <html lang>
documentElementObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});

export function LocaleMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<Locale> {
  class LocaleImpl extends constructor {
    #locale?: string;

    get locale(): string {
      return this.#locale ?? documentLanguage ?? 'default';
    }

    /** The component's locale. */
    @property()
    set locale(value: string) {
      this.#locale = value;
    }

    override connectedCallback(): void {
      super.connectedCallback();

      connectedElements.add(this);
    }

    override disconnectedCallback(): void {
      connectedElements.delete(this);

      super.disconnectedCallback();
    }
  }

  return LocaleImpl;
}
