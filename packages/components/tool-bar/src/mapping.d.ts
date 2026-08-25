import { Button } from '@sl-design-system/button';
import { MenuButton, type MenuItem } from '@sl-design-system/menu';
export interface ToolBarItemBase {
  element: HTMLElement;
  visible: boolean;
}
export interface ToolBarItemButton extends ToolBarItemBase {
  type: 'button';
  ariaDisabled?: boolean;
  disabled?: boolean;
  icon?: string | null;
  label?: string | null;
  selectable?: boolean;
  click?(): void;
}
export interface ToolBarItemDivider extends ToolBarItemBase {
  type: 'divider';
}
export interface ToolBarItemGroup extends ToolBarItemBase {
  type: 'group';
  buttons: ToolBarItemButton[];
  label?: string | null;
  selects?: 'single' | 'multiple';
}
export interface ToolBarItemMenu extends ToolBarItemBase {
  type: 'menu';
  ariaDisabled?: boolean;
  disabled?: boolean;
  icon?: string | null;
  label?: string | null;
  menuItems: Array<ToolBarItemButton | ToolBarItemDivider | ToolBarItemMenu>;
}
export type ToolBarItem =
  | ToolBarItemButton
  | ToolBarItemDivider
  | ToolBarItemGroup
  | ToolBarItemMenu;
export declare function mapButtonToItem(button: Button): ToolBarItemButton;
export declare function mapMenuButtonToItem(menuButton: MenuButton): ToolBarItemMenu;
export declare function mapMenuItemToItem(menuItem: MenuItem): ToolBarItemButton;
export declare function mapElementsToItems(elements: Element[]): ToolBarItem[];
