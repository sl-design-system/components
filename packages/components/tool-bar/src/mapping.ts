import { Button } from '@sl-design-system/button';
import { MenuButton } from '@sl-design-system/menu';
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

export type ToolBarItem = ToolBarItemButton | ToolBarItemDivider | ToolBarItemGroup | ToolBarItemMenu;

export function mapButtonToItem(host: HTMLElement, button: Button): ToolBarItemButton {
  let label: string | undefined = button.getAttribute('aria-label') || button.textContent?.trim();

  if (button.hasAttribute('aria-labelledby')) {
    const buttonLabelledby = button.getAttribute('aria-labelledby');

    if (host.querySelector(`#${buttonLabelledby}`)) {
      label = host.querySelector(`#${buttonLabelledby}`)?.textContent?.trim();
    } else if (
      button.nextElementSibling &&
      button.nextElementSibling.tagName === 'SL-TOOLTIP' &&
      buttonLabelledby === button.nextElementSibling.id
    ) {
      label = button.nextElementSibling.textContent?.trim();
    }
  } else if (!label && button.hasAttribute('aria-describedby')) {
    label = host.querySelector(`#${button.getAttribute('aria-describedby')}`)?.textContent?.trim();
  }

  const ariaDisabled = button.getAttribute('aria-disabled');

  return {
    element: button,
    type: 'button',
    ariaDisabled: ariaDisabled !== null && ariaDisabled !== 'false',
    disabled: button.hasAttribute('disabled'),
    icon: button.querySelector('sl-icon')?.getAttribute('name'),
    label,
    selectable: button.hasAttribute('aria-pressed'),
    visible: true,
    click: () => button.click()
  };
}

export function mapMenuButtonToItem(host: HTMLElement, menuButton: MenuButton): ToolBarItemMenu {
  let label: string | undefined =
    menuButton.renderRoot.querySelector('sl-button')?.getAttribute('aria-label') ||
    menuButton.querySelector('[slot="button"]')?.textContent?.trim();

  if (menuButton.hasAttribute('aria-labelledby')) {
    const buttonLabelledby = menuButton.getAttribute('aria-labelledby');

    if (host.querySelector(`#${buttonLabelledby}`)) {
      label = host.querySelector(`#${buttonLabelledby}`)?.textContent?.trim();
    } else if (
      menuButton.nextElementSibling &&
      menuButton.nextElementSibling.tagName === 'SL-TOOLTIP' &&
      buttonLabelledby === menuButton.nextElementSibling.id
    ) {
      label = menuButton.nextElementSibling.textContent?.trim();
    }
  } else if (!label && menuButton.hasAttribute('aria-describedby')) {
    label = host.querySelector(`#${menuButton.getAttribute('aria-describedby')}`)?.textContent?.trim();
  }

  // const menuItems = Array.from(menuButton.querySelectorAll('sl-menu-item')).map(el => mapButtonToItem(host, el));
  const menuItems: Array<ToolBarItemButton | ToolBarItemMenu> = [];

  const ariaDisabled = menuButton.getAttribute('aria-disabled');

  return {
    element: menuButton,
    type: 'menu',
    ariaDisabled: ariaDisabled !== null && ariaDisabled !== 'false',
    disabled: menuButton.hasAttribute('disabled'),
    icon: menuButton.querySelector('sl-icon')?.getAttribute('name'),
    label,
    menuItems,
    visible: true
  };
}

export function updateMapping(
  host: HTMLElement & { renderRoot: DocumentFragment | HTMLElement; empty?: boolean; items?: ToolBarItem[] }
): {
  needsMeasurement: boolean;
} {
  const slot = host.renderRoot.querySelector('slot')!,
    elements = slot.assignedElements({ flatten: true });

  host.empty = elements.length === 0;

  host.items = elements
    .map(element => {
      if (element instanceof HTMLElement) {
        element.style.visibility = '';
        element.style.position = '';
      }

      if (element instanceof Button) {
        return mapButtonToItem(host, element);
      } else if (element instanceof MenuButton) {
        return mapMenuButtonToItem(host, element);
      } else if (element instanceof ToolBarDivider) {
        return { element, type: 'divider' as const, visible: true };
      } else if (!['SL-TOOLTIP'].includes(element.tagName)) {
        console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar.`);
      }

      return undefined;
    })
    .filter(item => item !== undefined) as ToolBarItem[];

  return { needsMeasurement: true };
}
