import { type InstanceHandle } from 'figma';
import { checkBooleanProperty } from './figma-assertions.js';

export type FigmaMenuItem = {
  label: string;
  selected: boolean;
};

export function getMenuItems(menuPanel: InstanceHandle): FigmaMenuItem[] {
  return menuPanel
    .findLayers(layer => layer.type === 'INSTANCE' && /^item-\d+$/.test(layer.name), {
      traverseInstances: true
    })
    .filter(item => item.type === 'INSTANCE')
    .sort((first, second) => Number(first.name.slice(5)) - Number(second.name.slice(5)))
    .flatMap(item => {
      const itemNumber = item.name.slice(5).padStart(2, '0'),
        visible = checkBooleanProperty(
          menuPanel.getBoolean(`Item ${itemNumber}`),
          `Item ${itemNumber}`
        );
      if (!visible) return [];

      const menuBase = item.findInstance('menu-base', { traverseInstances: true });
      if (menuBase.type === 'ERROR') return [];

      const label = menuBase.getString('label'),
        selected = item.getString('Selected') === 'true';

      return typeof label === 'string' ? [{ label, selected }] : [];
    });
}
