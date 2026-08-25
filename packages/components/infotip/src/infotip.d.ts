import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type ButtonSize } from '@sl-design-system/button';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-infotip': Infotip;
  }
}
declare const Infotip_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * An info icon button that triggers a popover showing slotted content.
 *
 * You can use it inside the `infotip` slot of `<sl-label>`:
 *
 * ```html
 * <sl-label>
 *   Label text
 *   <sl-infotip slot="infotip">This is additional information.</sl-infotip>
 * </sl-label>
 * ```
 *
 * @slot default - The content to display inside the infotip popover.
 * @slot icon - The icon to display in the button, defaults to `circle-info`.
 *
 * @csspart button - The button element.
 * @csspart popover - The popover element.
 */
export declare class Infotip extends Infotip_base {
  #private;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** The name of the element that this infotip describes. */
  describes?: string;
  /** The size of the infotip button. */
  size: ButtonSize;
  /** The unique ID assigned to the content copy for use with aria-describedby. */
  contentId?: string;
  connectedCallback(): void;
  firstUpdated(): void;
  disconnectedCallback(): void;
  render(): TemplateResult;
  focus(options?: FocusOptions): void;
  toggleInfotip(): void;
}
export {};
