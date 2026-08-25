import { nothing } from 'lit';
import {
  Directive,
  type DirectiveParameters,
  type ElementPart,
  type PartInfo
} from 'lit/directive.js';
import { Ref } from 'lit/directives/ref.js';
import { type PositionPopoverOptions } from '../popover.js';
declare global {
  interface HTMLElement {
    anchorElement: Element | undefined;
  }
}
export interface AnchorDirectiveConfig extends PositionPopoverOptions {
  element?: Element | Ref<Element>;
  /**
   * Setting this to true will cause the directive to do nothing if CSS anchor positioning is
   * supported in the browser. It will then use CSS anchor positioning to position the element. In
   * older browsers it will still use floating-ui to position the element.
   */
  supportCSSAnchorPositioning?: boolean;
}
export declare class AnchorDirective extends Directive {
  #private;
  observer?: IntersectionObserver;
  constructor(partInfo: PartInfo);
  render(_config?: AnchorDirectiveConfig): typeof nothing;
  update(part: ElementPart, [config]: DirectiveParameters<this>): void;
}
export declare const anchor: (
  _config?: AnchorDirectiveConfig | undefined
) => import('lit-html/directive.js').DirectiveResult<typeof AnchorDirective>;
