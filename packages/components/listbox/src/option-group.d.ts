import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-option-group': OptionGroup;
  }
}
declare const OptionGroup_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * An option group in a list, such as select or combobox.
 *
 * @slot default - The option's label.
 */
export declare class OptionGroup extends OptionGroup_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** The optional label for the group. */
  label?: string;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): TemplateResult;
}
export {};
