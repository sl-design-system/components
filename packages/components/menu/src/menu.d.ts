import { type EventEmitter, type PopoverPosition } from '@sl-design-system/shared';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-menu': Menu;
  }
}
export type MenuEmphasis = 'subtle' | 'bold';
/**
 * A menu that can be used as a context menu or as a dropdown menu.
 *
 * @csspart menu - The sl-menu element, use this to set for example a min and/or max inline size of the menu
 *
 * @slot default - The menu's content: menu items or menu item groups.
 */
export declare class Menu extends LitElement {
  #private;
  /** @internal The default offset of the menu to its anchor. */
  static offset: number;
  /** @internal */
  static shadowRootOptions: {
    delegatesFocus: boolean;
    clonable?: boolean;
    customElementRegistry?: CustomElementRegistry | null;
    mode: ShadowRootMode;
    serializable?: boolean;
    slotAssignment?: SlotAssignmentMode;
    customElements?: CustomElementRegistry;
    registry?: CustomElementRegistry;
  };
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The default margin between the menu and the viewport. */
  static viewportMargin: number;
  /**
   * The offset of the menu to its anchor. This is a property on this instance so that it can be
   * overridden by the menu item in case of a nested menu. You should not need to set this property
   * yourself.
   */
  offset?: number;
  /** The position of the menu relative to its anchor. */
  position?: PopoverPosition;
  /** @internal Emits when the menu item selection changes. */
  selectEvent: EventEmitter<SlSelectEvent<void>>;
  /** @internal Whether this menu has any children that can be selected. */
  selectableChildren?: boolean;
  /** Determines whether if and how many menu items can be selected. */
  selects?: 'single' | 'multiple';
  /**
   * The emphasis of the menu.
   *
   * @default 'subtle'
   */
  emphasis?: MenuEmphasis;
  connectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /**
   * @internal Workaround for `delegatesFocus` on the shadowroot not taking
   * any of the menu items in the light DOM into account.
   */
  focus(): void;
  /** @internal */
  focusLastItem(): void;
}
