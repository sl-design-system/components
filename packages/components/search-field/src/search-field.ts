import { msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, type TemplateResult, html, nothing } from 'lit';
import styles from './search-field.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-clear': SlClearEvent;
    'sl-search': SlSearchEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-search-field': SearchField;
  }
}

export type SlClearEvent = CustomEvent<void>;

export type SlSearchEvent = CustomEvent<string>;

/**
 * Search field component.
 *
 * @slot input - The slot for the input element
 */
export class SearchField extends ScopedElementsMixin(TextField) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      ...TextField.scopedElements,
      'sl-button': Button
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = [TextField.styles, styles];

  /** Event controller. */
  #events = new EventsController(this, { keydown: this.#onKeyDown });

  /** @internal Emits when the user clears the field. */
  @event({ name: 'sl-clear' }) clearEvent!: EventEmitter<SlClearEvent>;

  /** @internal Emits when the user presses enter. */
  @event({ name: 'sl-search' }) searchEvent!: EventEmitter<SlSearchEvent>;

  override renderPrefix(): TemplateResult {
    return html`<sl-icon name="search"></sl-icon>`;
  }

  override renderSuffix(): TemplateResult | typeof nothing {
    return this.value && !this.disabled
      ? html`
          <sl-button @click=${this.#onClick} aria-label=${msg('Clear text')} fill="ghost" size="sm">
            <sl-icon name="xmark"></sl-icon>
          </sl-button>
        `
      : nothing;
  }

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
