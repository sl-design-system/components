import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ButtonFill } from '@sl-design-system/button';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-panel': Panel;
  }
}
export type PanelDensity = 'default' | 'relaxed' | 'plain' | 'comfortable';
export type PanelElevation = 'none' | 'raised' | 'sunken';
export type TogglePlacement = 'start' | 'end';
declare const Panel_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A container that can be collapsed and expanded.
 *
 * @csspart header - The header of the panel.
 * @csspart wrapper - The wrapper around the heading.
 * @csspart body - The body of the panel.
 * @csspart inner - The inner container of the panel.
 * @csspart content - The content container of the panel.
 * @csspart titles - The container for the heading.
 *
 * @cssprop --sl-panel-content-padding - The padding for the panel content, e.g. set to 0 to have content without any padding.
 *
 * @slot heading - The panel's heading. Use this if the `heading` property does not suffice.
 * @slot aside - Additional content to show in the header; replaces the button bar.
 * @slot actions - The panel's actions; will slot in a tool bar by default.
 * @slot default - The panel's content.
 * @slot prefix - Content to show before the heading.
 * @slot suffix - Content to show after the heading.
 */
export declare class Panel extends Panel_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** Indicates whether the panel is collapsed or expanded . */
  collapsed?: boolean;
  /** Indicates whether the panel can be collapsed. */
  collapsible?: boolean;
  /**
   * The density of the panel. Note: the `plain` and `comfortable` density values are deprecated and
   * will be removed in the future.
   *
   * @default 'default'
   * @param {'plain' | 'comfortable'} - These density values are deprecated and will be removed in
   *   the future.
   */
  density?: PanelDensity;
  /** Will render a horizontal divider between the header and content when set. */
  divider?: boolean;
  /** The elevation style of the panel. */
  elevation?: PanelElevation;
  /**
   * The fill of the buttons in the tool-bar.
   *
   * @default 'ghost'
   */
  fill: Extract<ButtonFill, 'ghost' | 'outline'>;
  /**
   * The text shown in the header. Use this property if your heading is a string. If you need more
   * flexibility, such as an icon or other elements, use the `heading` slot.
   */
  heading?: string;
  /** Hide the border around the panel when true. */
  noBorder?: boolean;
  /**
   * The placement of the toggle button when it's collapsible.
   *
   * @default `start`
   */
  togglePlacement?: TogglePlacement;
  /** @internal Emits when the panel expands/collapses. */
  toggleEvent: EventEmitter<SlToggleEvent<boolean>>;
  /** @internal Whether the actions slot has slotted elements. */
  private hasActions;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  firstUpdated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /**
   * Toggles the collapsed state of the panel. This only does something if the panel is collapsible.
   *
   * @param force Whether to force the panel to be collapsed or expanded.
   */
  toggle(force?: boolean): void;
}
export {};
