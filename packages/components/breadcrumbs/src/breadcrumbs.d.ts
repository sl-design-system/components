import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-breadcrumbs': Breadcrumbs;
  }
  interface ShadowRoot {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}
export interface Breadcrumb {
  element: HTMLElement;
  tooltip: Tooltip;
}
declare const Breadcrumbs_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A component to display a breadcrumb trail.
 *
 * @slot default - The breadcrumbs to display.
 * @slot home - Custom home link element.
 * @slot tooltips - Internal slot for tooltip elements managed by the component.
 */
export declare class Breadcrumbs extends Breadcrumbs_base {
  #private;
  /**
   * When true, doesn't show a home label in the first breadcrumb next to the home icon.
   *
   * By changing this static property you can change the default value for all future instances of
   * the component. Changing the static property won't affect already created instances.
   */
  static hideHomeLabel: boolean;
  /**
   * The url for the home link, defaults to the root url.
   *
   * By changing this static property you can change the default value for all future instances of
   * the component. Changing the static property won't affect already created instances.
   */
  static homeUrl: string;
  /**
   * When true doesn't show a home link as the first breadcrumb.
   *
   * By changing this static property you can change the default value for all future instances of
   * the component. Changing the static property won't affect already created instances.
   */
  static noHome: boolean;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The slotted breadcrumbs. */
  breadcrumbs: Breadcrumb[];
  /** @internal The slotted custom home link, if any. */
  customHomeLink?: Element;
  /** @internal The threshold for when breadcrumbs should be collapsed into a menu. */
  collapseThreshold: number;
  /**
   * When true, doesn't show a home label in the first breadcrumb next to the home icon.
   *
   * If you want to change the default value for all future instances of the component, you can
   * change the static property. If you want to change the property of an already created instance,
   * you need to change this property.
   */
  hideHomeLabel: boolean;
  /**
   * Set this to true to invert the color of the breadcrumbs. This should be used when the
   * breadcrumbs are displayed on a dark background.
   */
  inverted?: boolean;
  /**
   * The url for the home link, defaults to the root url.
   *
   * If you want to change the default value for all future instances of the component, you can
   * change the static property. If you want to change the property of an already created instance,
   * you need to change this property.
   */
  homeUrl: string;
  /**
   * When true, doesn't show a home link as the first breadcrumb.
   *
   * If you want to change the default value for all future instances of the component, you can
   * change the static property. If you want to change the property of an already created instance,
   * you need to change this property.
   */
  noHome: boolean;
  connectedCallback(): void;
  disconnectedCallback(): void;
  firstUpdated(): void;
  render(): TemplateResult;
}
export {};
