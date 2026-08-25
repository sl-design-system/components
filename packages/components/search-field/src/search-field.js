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
import { msg } from '@lit/localize';
import { EventsController, event } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { html, nothing } from 'lit';
import styles from './search-field.scss.js';
export class SearchField extends TextField {
  static {
    /** @internal */
    this.styles = [TextField.styles, styles];
  }
  /** @internal Debounce timer for search events */
  #debounceTimer;
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeyDown, input: this.#onInput });
  connectedCallback() {
    super.connectedCallback();
    const style = document.createElement('style');
    style.innerHTML = `
       sl-search-field:has(input:hover):not(:focus-within) {
          --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
       }
      `;
    this.prepend(style);
  }
  disconnectedCallback() {
    this.#clearDebounceTimer();
    super.disconnectedCallback();
  }
  renderPrefix() {
    return html`
      <slot name="prefix">
        <sl-icon name="search"></sl-icon>
      </slot>
    `;
  }
  renderSuffix() {
    return this.value && !this.disabled
      ? html`
          <button
            @click=${this.#onClick}
            aria-label=${msg('Clear text', { id: 'sl.searchField.clearText' })}
            tabindex="-1">
            <sl-icon name="circle-xmark"></sl-icon>
            <sl-icon name="circle-xmark-solid"></sl-icon>
          </button>
        `
      : nothing;
  }
  /** Clears the value in the input element. */
  clear() {
    this.value = '';
    this.#clearDebounceTimer();
    this.searchEvent.emit('');
    this.clearEvent.emit();
  }
  #onClick() {
    this.clear();
    this.input.focus();
  }
  #onInput() {
    this.#startDebounceTimer();
  }
  #onKeyDown(event2) {
    if (this.disabled) {
      return;
    }
    if (event2.key === 'Enter') {
      event2.preventDefault();
      this.#clearDebounceTimer();
      this.searchEvent.emit(this.value?.toString() ?? '');
    } else if (event2.key === 'Escape') {
      event2.preventDefault();
      this.clear();
    }
  }
  #startDebounceTimer() {
    this.#clearDebounceTimer();
    this.#debounceTimer = setTimeout(() => {
      const value = this.value?.toString() ?? '';
      if (value.trim() !== '') {
        this.searchEvent.emit(value);
      } else {
        this.searchEvent.emit('');
        this.clearEvent.emit();
      }
    }, 300);
  }
  #clearDebounceTimer() {
    if (this.#debounceTimer !== void 0) {
      clearTimeout(this.#debounceTimer);
      this.#debounceTimer = void 0;
    }
  }
}
__decorateClass([event({ name: 'sl-clear' })], SearchField.prototype, 'clearEvent', 2);
__decorateClass([event({ name: 'sl-search' })], SearchField.prototype, 'searchEvent', 2);
//# sourceMappingURL=search-field.js.map
