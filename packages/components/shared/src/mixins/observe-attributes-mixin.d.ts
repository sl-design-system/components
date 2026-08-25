import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';
export interface ObserveAttributesMixinInterface {
  setAttributesTarget(target: HTMLElement): void;
}
/**
 * Mixin that is used to rewrite aria attributes in the component (based on the observedAttributes)
 * to the focusable target element.
 */
export declare function ObserveAttributesMixin<
  T extends Constructor<ReactiveElement> & {
    observedAttributes?: string[];
  }
>(constructor: T, observedAttributes?: string[]): T & Constructor<ObserveAttributesMixinInterface>;
