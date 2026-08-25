import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-callout': Callout;
  }
}
export type CalloutDensity = 'default' | 'relaxed';
export type CalloutVariant = 'info' | 'success' | 'warning' | 'danger';
declare const Callout_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A callout component for displaying additional information. The component can contain actions
 * (e.g. buttons) and should not be shown/hidden dynamically in response to user actions (unlike the
 * inline-message). This means the callout should remain visible as part of the static page layout,
 * rather than appearing or disappearing based on user interaction. There is no aria role on this
 * component as it is not meant to interrupt the user.
 *
 * @slot default - The body of the callout.
 * @slot icon - Icon shown on the left side of the component.
 * @slot title - Title content for the callout.
 */
export declare class Callout extends Callout_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string;
  /** @internal If the title is missing, the content needs to be placed where the title should be. */
  noTitle: boolean;
  /**
   * The density of the callout.
   *
   * @default 'default'
   */
  density?: CalloutDensity;
  /**
   * The variant of the callout.
   *
   * @default 'info'
   */
  variant?: CalloutVariant;
  render(): TemplateResult;
}
export {};
