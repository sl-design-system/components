import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-ellipsize-text': EllipsizeText;
  }
}
declare const EllipsizeText_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * Small utility component to add ellipsis to text that overflows its container. It also adds a
 * tooltip with the full text.
 *
 * @slot - The text to be truncated.
 */
export declare class EllipsizeText extends EllipsizeText_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal Whether the tooltip is visible. */
  tooltip?: boolean;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): TemplateResult;
}
export {};
