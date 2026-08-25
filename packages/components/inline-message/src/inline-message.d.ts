import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-dismiss': SlDismissEvent;
  }
  interface HTMLElementTagNameMap {
    'sl-inline-message': InlineMessage;
  }
}
export type InlineMessageSize = 'auto' | 'sm' | 'md' | 'lg';
export type InlineMessageVariant = 'info' | 'success' | 'warning' | 'danger';
export type SlDismissEvent = CustomEvent<void>;
declare const InlineMessage_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * An inline message component for displaying additional information.
 *
 * @slot default - The body of the inline-message
 * @slot icon - Icon shown on the left side of the component
 * @slot title - Title content for the inline message
 */
export declare class InlineMessage extends InlineMessage_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal If the content spans more than 2 lines, this will be true. */
  contentOverflow?: boolean;
  /** @internal Emits when the inline message is dismissed. */
  dismissEvent: EventEmitter<SlDismissEvent>;
  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string;
  /**
   * If set, will remove the ability to dismiss the inline message by removing the close button.
   *
   * @default false
   */
  indismissible?: boolean;
  /** @internal If the action is missing, we need to hide the action part. */
  noAction: boolean;
  /** @internal If the title is missing, the content needs to be placed where the title should be. */
  noTitle: boolean;
  get size(): InlineMessageSize;
  /**
   * The size of the inline message. By default, this is set to `'auto'` which means the component
   * will automatically determine the size based on the content. If the content spans more than 2
   * lines, the size will be set to `'lg'`. If a title is present, the size will be set to `'lg'`.
   * Otherwise, the size will be set to `'md'`. If you want to explicitly set the size the `'sm'`,
   * `'md'`, or `'lg'`, you can do so. But beware that some sizes may not work well with the
   * content. `'sm'` and `'md'` for example are not meant to be used with a title.
   *
   * @default 'auto'
   */
  set size(size: InlineMessageSize);
  /**
   * The variant of the inline message.
   *
   * @default 'info'
   */
  variant?: InlineMessageVariant;
  firstUpdated(changes: PropertyValues): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
