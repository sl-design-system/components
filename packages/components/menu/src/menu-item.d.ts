import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Menu } from './menu.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-item': MenuItem;
  }
}
export type MenuItemVariant = 'default' | 'danger';
export type MenuItemEmphasis = 'subtle' | 'bold';
declare const MenuItem_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * Menu item component for use inside a menu.
 *
 * @csspart wrapper - The wrapper around the menu item content.
 *
 * @slot default - Content to display inside the menu item.
 * @slot submenu - The menu items that will be displayed when the menu item is shown.
 */
export declare class MenuItem extends MenuItem_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal The default offset of the submenu to the menu item. */
  static submenuOffset: number;
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether this menu item is disabled. */
  disabled?: boolean;
  /** @internal Emits the current selected state as a boolean when the user toggles the menu item. */
  selectEvent: EventEmitter<SlSelectEvent>;
  /** Whether this menu item has been selected. */
  selected?: boolean;
  /** Whether this menu item can be selected. */
  selectable?: boolean;
  /** Keyboard shortcut for activating this menu item. */
  shortcut?: string;
  /** @internal The sub menu, if present. */
  submenu?: Menu;
  /** @internal The emphasis, inherited from the menu. */
  emphasis?: MenuItemEmphasis;
  /** @internal The sub menu, if present. */
  wrapper?: HTMLElement;
  /** The variant of the menu item. */
  variant?: MenuItemVariant;
  connectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
