import { Button } from '@sl-design-system/button';
import { MenuButton } from '@sl-design-system/menu';
import {
  getForwardedAccessibleName,
  getForwardedAriaAttribute,
  getForwardedDescription,
  isForwardedDisabled
} from '@sl-design-system/shared/helpers/forward-aria.js';
import { ToolBarDivider } from './tool-bar-divider.js';
function getLabelFromAriaLabelledBy(host) {
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
        ? id => root.querySelector(`#${CSS.escape(id)}`)
        : void 0;
  return labelledByIds
    .split(/\s+/)
    .map(id => getLabelledByElement?.(id)?.textContent?.trim())
    .filter(Boolean)
    .join(' ');
}
function getMenuButtonLabel(menuButton) {
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
    .filter(el => el instanceof HTMLElement && el.slot === 'button')
    .map(el => el.textContent?.trim())
    .filter(Boolean)
    .join(' ');
}
export function mapButtonToItem(button) {
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
export function mapMenuButtonToItem(menuButton) {
  const label = getMenuButtonLabel(menuButton),
    menuItems = Array.from(menuButton.querySelectorAll('sl-menu-item')).map(el =>
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
export function mapMenuItemToItem(menuItem) {
  return {
    element: menuItem,
    type: 'button',
    disabled: menuItem.hasAttribute('disabled'),
    icon: menuItem.querySelector('sl-icon')?.getAttribute('name'),
    label: menuItem.textContent?.trim() || void 0,
    visible: true,
    click: () => menuItem.click()
  };
}
export function mapElementsToItems(elements) {
  return elements
    .map(element => {
      if (element instanceof Button) {
        return mapButtonToItem(element);
      } else if (element instanceof MenuButton) {
        return mapMenuButtonToItem(element);
      } else if (element instanceof ToolBarDivider) {
        return { element, type: 'divider', visible: true };
      }
      return void 0;
    })
    .filter(item => item !== void 0);
}
//# sourceMappingURL=mapping.js.map
