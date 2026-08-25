import { type EventEmitter } from '@sl-design-system/shared';
import { type SlClearEvent } from '@sl-design-system/shared/events.js';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, type TemplateResult, nothing } from 'lit';
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
export declare class SearchField extends TextField {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal Emits when the user clears the field. */
  clearEvent: EventEmitter<SlClearEvent>;
  /** @internal Emits when the user presses enter. */
  searchEvent: EventEmitter<SlSearchEvent>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  renderPrefix(): TemplateResult;
  renderSuffix(): TemplateResult | typeof nothing;
  /** Clears the value in the input element. */
  clear(): void;
}
