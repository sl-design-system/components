import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  nothing
} from 'lit';
import { type Emoji, type EmojiGroup, EmojiService } from './emoji-service.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-emoji-browser': EmojiBrowser;
  }
}
declare const EmojiBrowser_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
export declare class EmojiBrowser extends EmojiBrowser_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** The base URL where the emoji data can be found. */
  baseUrl: string;
  /** @internal The filtered emojis based on the `query` value. */
  filteredEmojis: Emoji[];
  /** Frequently used emojis, separated by spaces. */
  frequentlyUsed?: string;
  /** @internals The frequently used emojis. */
  frequentlyUsedEmojis: Emoji[];
  /** @internal The emojis, grouped by group. */
  emojis?: Map<EmojiGroup, Emoji[]>;
  /** The locale for this component. TODO: Use the LocaleMixin. */
  locale?: string;
  /** The query string to filter emojis. */
  query?: string;
  /** @internal Emits when the user selects an emoji. */
  selectEvent: EventEmitter<SlSelectEvent<Emoji>>;
  /** @internal Service for getting the data. */
  service?: EmojiService;
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): Promise<void>;
  render(): TemplateResult;
  renderEmojis(emojis: Emoji[]): TemplateResult | typeof nothing;
}
export {};
