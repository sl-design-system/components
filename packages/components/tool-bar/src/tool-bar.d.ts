import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type ButtonFill } from '@sl-design-system/button';
import { MenuButton } from '@sl-design-system/menu';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type ToolBarItem } from './mapping.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar': ToolBar;
  }
}
declare const ToolBar_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A responsive toolbar that lays out buttons, menu-buttons, and dividers in a horizontal row. When
 * the available space is too narrow to fit all items, the toolbar automatically moves overflowing
 * items into an overflow menu at the end.
 *
 * The toolbar maps its slotted elements to internal data objects (see `mapping.ts`), measures their
 * widths, and recalculates visibility on resize. Overflow items are rendered as menu-items inside a
 * popup menu-button.
 *
 * Child attributes like `fill` and `inverted` are propagated to slotted buttons, and the `disabled`
 * state of the toolbar is synced to all child buttons.
 *
 * By default the toolbar has no border or padding, making it suitable for embedding inside other
 * components. Use the `contained` attribute for a toolbar with spacing. Make sure there is enough
 * space around the toolbar to show focus outlines.
 *
 * @csspart wrapper - The wrapper element that contains the tool bar items.
 *
 * @slot default - The tool bar items.
 */
export declare class ToolBar extends ToolBar_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * The horizontal alignment within the tool-bar.
   *
   * @default 'start'
   */
  align?: 'start' | 'end';
  /**
   * If `true`, the tool-bar will have a border (when there is no inverted set) and padding around
   * it. Use this when you want the tool-bar to be visually distinct from surrounding content.
   *
   * @default false
   */
  contained?: boolean;
  /**
   * If true, the tool-bar is disabled and cannot be interacted with.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The fill of buttons and menu buttons (also overflow menu button).
   *
   * @default undefined
   */
  fill?: ButtonFill;
  /**
   * Use this if you want the menu button that appears when the tool bar overflows to use the
   * "inverted" variant. Slotted buttons and menu-buttons without an explicit `variant` also use the
   * `inverted` variant when set.
   *
   * @default false
   */
  inverted?: boolean;
  /** @internal The tool bar items. */
  items: ToolBarItem[];
  /** @internal The menu button element. */
  menuButton?: MenuButton;
  /** @internal The tool bar items that should be shown in the overflow menu. */
  menuItems: ToolBarItem[];
  /** @internal The wrapper element. */
  wrapper?: HTMLElement;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  firstUpdated(): void;
  render(): TemplateResult;
  /** @internal */
  renderMenuItem(item: ToolBarItem): TemplateResult;
  /** Delegate focus to the roving tabindex controller so the first focusable item receives focus. */
  focus(): void;
  /**
   * Re-maps slotted elements, measures their widths, and recalculates which items are visible vs.
   * moved into the overflow menu. Called automatically on slot changes and DOM mutations, but you
   * may need to call it manually when using nested slots (which don't trigger `slotchange` or
   * `MutationObserver`).
   */
  refresh(): void;
  /**
   * Forces a recalculation of the tool-bar layout using a debounced measurement.
   *
   * In most cases, the tool-bar reacts automatically to size changes and DOM mutations, or can be
   * updated explicitly by calling {@link refresh}. Call this method only in advanced scenarios where
   * those mechanisms are insufficient, such as when the layout is affected by changes outside the
   * tool-bar (e.g. complex nested slots or container size changes that are not observed).
   *
   * When invoked, any pending recalculation is canceled and a new one is scheduled with a 200ms
   * delay. Once the timeout elapses, the tool-bar temporarily reveals the first hidden item,
   * measures the wrapper and items, and internally triggers a resize/measurement pass to recompute
   * which items should be visible or moved into the overflow menu.
   */
  forceRecalculation(): void;
}
export {};
