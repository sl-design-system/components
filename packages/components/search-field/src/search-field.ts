import { msg } from '@lit/localize';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlClearEvent } from '@sl-design-system/shared/events.js';
import { TextField } from '@sl-design-system/text-field';
import { type TemplateResult, html, nothing } from 'lit';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-search': SlSearchEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-search-field': SearchField;
  }
}

export type SlSearchEvent = CustomEvent<string>;

/**
 * Search field component.
 *
 * @slot input - The slot for the input element
 */
export class SearchField extends TextField {
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeyDown });

  /** @internal Emits when the user clears the field. */
  @event({ name: 'sl-clear' }) clearEvent!: EventEmitter<SlClearEvent>;

  /** @internal Emits when the user presses enter. */
  @event({ name: 'sl-search' }) searchEvent!: EventEmitter<SlSearchEvent>;

  override connectedCallback(): void {
    super.connectedCallback();

    // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
    const style = document.createElement('style');
    style.innerHTML = `
       sl-search-field:has(input:hover):not(:focus-within) {
          --_bg-opacity: var(--sl-opacity-light-interactive-plain-hover);
       }
      `;
    this.prepend(style);
  }

  override renderPrefix(): TemplateResult {
    return html`<sl-icon name="search"></sl-icon>`;
  }

  override renderSuffix(): TemplateResult | typeof nothing {
    return this.value && !this.disabled
      ? html`
          <button @click=${this.#onClick} aria-label=${msg('Clear text')}>
            <sl-icon name="xmark"></sl-icon>
          </button>
        `
      : nothing;
  }

  /** Clears the value in the input element. */
  clear(): void {
    this.value = '';
    this.clearEvent.emit();
  }

  #onClick(): void {
    this.clear();
    this.input.focus();
  }

  #onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      this.searchEvent.emit(this.value?.toString() ?? '');
    } else if (event.key === 'Escape') {
      event.preventDefault();

      this.clear();
    }
  }
}
