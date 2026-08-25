import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { EventEmitter } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-remove': SlRemoveEvent;
  }
  interface HTMLElementTagNameMap {
    'sl-tag': Tag;
  }
}
export type SlRemoveEvent = CustomEvent<void>;
export type TagSize = 'md' | 'lg';
export type TagVariant = 'neutral' | 'info';
declare const Tag_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A tag component containing label.
 *
 * ```html
 * <sl-tag>Tag label</sl-tag>
 * ```
 *
 * @slot default - The tag label.
 *
 * @csspart label - The wrapper around the tag label.
 * @csspart button - The remove button.
 * @csspart tooltip - The tooltip shown when the content is truncated.
 */
export declare class Tag extends Tag_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /**
   * Whether the tag component is disabled, when set no interaction is possible.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The text to be shown in the tooltip. If the tooltip property isn't set explicitly to a string,
   * the component itself will automatically determine when to show a tooltip based on the content's
   * truncation.
   */
  tooltip?: boolean | string;
  /** @internal The label of the tag component. */
  label: string;
  /** @internal Clarifies tag list keyboard navigation for assistive technologies. */
  navigationDescription?: string;
  /** @internal Additional description for the tag label. */
  labelDescription?: string;
  /**
   * Whether the tag component is removable.
   *
   * @default false
   */
  removable?: boolean;
  /** @internal Emits when the tag is removed. */
  removeEvent: EventEmitter<SlRemoveEvent>;
  /**
   * The size of the tag.
   *
   * @default 'md'
   */
  size?: TagSize;
  /**
   * The variant of the tag.
   *
   * @default 'neutral'
   */
  variant?: TagVariant;
  /** @internal */
  get tabIndex(): number;
  /** @internal */
  set tabIndex(tabIndex: number);
  connectedCallback(): void;
  disconnectedCallback(): void;
  focus(options?: FocusOptions): void;
  protected updated(changes: Map<PropertyKey, unknown>): void;
  render(): TemplateResult;
}
export {};
