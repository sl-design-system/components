import { Button } from '@sl-design-system/button';
import { MenuButton, type MenuItem } from '@sl-design-system/menu';
import {
  getForwardedAccessibleName,
  getForwardedAriaAttribute,
  getForwardedDescription,
  isForwardedDisabled
} from '@sl-design-system/shared/helpers/forward-aria.js';
import { ToolBarDivider } from './tool-bar-divider.js';

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

function getLabelFromAriaLabelledBy(host: HTMLElement): string {
  const labelledBy = host.ariaLabelledByElements ?? [];

  if (labelledBy.length) {
    return labelledBy
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');
  }

  const labelledByIds = host.getAttribute('aria-labelledby');

  if (!labelledByIds) {
    return '';
  }

  const root = host.getRootNode(),
    getLabelledByElement =
      root instanceof Document || root instanceof ShadowRoot
        ? (id: string) => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
        : undefined;

  return labelledByIds
    .split(/\s+/)
    .map(id => getLabelledByElement?.(id)?.textContent?.trim())
    .filter(Boolean)
    .join(' ');
}

function getMenuButtonLabel(menuButton: MenuButton): string {
  const fromForwardedAria =
    getForwardedAccessibleName(menuButton) || getForwardedDescription(menuButton);

  if (fromForwardedAria) {
    return fromForwardedAria;
  }

  const fromHostAria =
    getLabelFromAriaLabelledBy(menuButton) || menuButton.getAttribute('aria-label') || '';

  if (fromHostAria) {
    return fromHostAria;
  }

  return Array.from(menuButton.children)
    .filter((el): el is HTMLElement => el instanceof HTMLElement && el.slot === 'button')
    .map(el => el.textContent?.trim())
    .filter(Boolean)
    .join(' ');
}

export function mapButtonToItem(button: Button): ToolBarItemButton {
  const label = getForwardedAccessibleName(button) || getForwardedDescription(button),
    disabled = isForwardedDisabled(button);

  return {
    element: button,
    type: 'button',
    ariaDisabled: disabled === 'aria',
    disabled: disabled === true,
    icon: button.querySelector('sl-icon')?.getAttribute('name'),
    label,
    selectable: !!getForwardedAriaAttribute(button, 'aria-pressed'),
    visible: true,
    click: () => button.click()
  };
}

export function mapMenuButtonToItem(menuButton: MenuButton): ToolBarItemMenu {
  const label = getMenuButtonLabel(menuButton),
    // Only look at direct children so items nested inside a submenu aren't flattened into this menu.
    menuItems = Array.from(menuButton.querySelectorAll(':scope > sl-menu-item')).map(el =>
      mapMenuItemToItem(el)
    ),
    disabled = isForwardedDisabled(menuButton);

  return {
    element: menuButton,
    type: 'menu',
    ariaDisabled: disabled === 'aria',
    disabled: disabled === true,
    icon: menuButton.querySelector('sl-icon')?.getAttribute('name'),
    label,
    menuItems,
    visible: true
  };
}

export function mapMenuItemToItem(menuItem: MenuItem): ToolBarItemButton | ToolBarItemMenu {
  const ariaDisabled = menuItem.getAttribute('aria-disabled') === 'true',
    icon = menuItem.querySelector('sl-icon')?.getAttribute('name'),
    submenu = menuItem.querySelector(':scope > sl-menu[slot="submenu"]');

  if (submenu) {
    return {
      element: menuItem,
      type: 'menu',
      ariaDisabled,
      disabled: false,
      icon,
      label: getMenuItemLabel(menuItem),
      menuItems: Array.from(submenu.querySelectorAll(':scope > sl-menu-item')).map(el =>
        mapMenuItemToItem(el)
      ),
      visible: true
    };
  }

  return {
    element: menuItem,
    type: 'button',
    ariaDisabled,
    disabled: false,
    icon,
    label: getMenuItemLabel(menuItem),
    visible: true,
    click: () => menuItem.click()
  };
}

// Get the menu item's own label text, excluding any nested submenu content.
function getMenuItemLabel(menuItem: MenuItem): string | undefined {
  return (
    Array.from(menuItem.childNodes)
      .filter(node => !(node instanceof Element && node.getAttribute('slot') === 'submenu'))
      .map(node => node.textContent?.trim())
      .filter(Boolean)
      .join(' ') || undefined
  );
}

export function mapElementsToItems(elements: Element[]): ToolBarItem[] {
  return elements
    .map(element => {
      if (element instanceof Button) {
        return mapButtonToItem(element);
      } else if (element instanceof MenuButton) {
        return mapMenuButtonToItem(element);
      } else if (element instanceof ToolBarDivider) {
        return { element, type: 'divider' as const, visible: true };
      }

      return undefined;
    })
    .filter(item => item !== undefined);
}
