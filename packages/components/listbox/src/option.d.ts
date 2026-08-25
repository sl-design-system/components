import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-option': Option;
  }
}
export type OptionEmphasis = 'subtle' | 'bold';
declare const Option_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * An option in a list, such as select or combobox.
 *
 * @slot default - The option's label.
 */
export declare class Option<T = any> extends Option_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether this option is disabled. */
  get disabled(): boolean | undefined;
  set disabled(disabled: boolean | undefined);
  /**
   * The emphasis style when selected.
   *
   * @default 'subtle'
   */
  emphasis?: OptionEmphasis;
  /** Whether this option is selected. */
  selected?: boolean;
  /** @internal */
  get textContent(): string;
  /** @internal */
  set textContent(textContent: string);
  get value(): T;
  /**
   * The value for this option. If not explicitly set, the getter will return the text content of
   * the option.
   */
  set value(value: T | undefined);
  connectedCallback(): void;
  render(): TemplateResult;
}
export {};
