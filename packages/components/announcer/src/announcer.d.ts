import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-announce': SlAnnounceEvent;
  }
  interface HTMLElementTagNameMap {
    'sl-announcer': Announcer;
  }
}
export type SlAnnounceEvent = CustomEvent<{
  message: string;
  urgency?: 'polite' | 'assertive';
  force?: boolean;
}>;
/**
 * Utility that serves as a recipient for all live-aria notifications and supplies them for
 * screenreaders from a central place in your application.
 *
 * ```html
 * <sl-live-aria></sl-live-aria>
 * ```
 */
export declare class Announcer extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  connectedCallback(): void;
  render(): TemplateResult;
}
