// source=packages/components/menu/src/menu-item.ts
// component=MenuItem
import figma from 'figma';
import {
  type InstanceHandle,
  type TextHandle,
  checkBooleanProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const selected = checkBooleanProperty(instance.getBoolean('selected'), 'selected'),
    label = instance.findText('label') as TextHandle;

  instance.findInstance('menu-base') as InstanceHandle;

  return figma.code`
    <sl-menu-item
      ${selected ? 'selectable selected' : ''}
          >
            ${label?.textContent ?? 'Menu Item'}
    </sl-menu-item>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
