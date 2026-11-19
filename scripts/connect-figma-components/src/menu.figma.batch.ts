// source=packages/components/menu/src/menu.ts
// component=Menu
import figma from 'figma';
import { checkEnum } from './_shared/figma-assertions.js';
import { getMenuItems } from './_shared/figma-menu.js';

const instance = figma.selectedInstance;

function getExample() {
  const emphasis = checkEnum(
      instance.getEnum('emphasis', { Muted: 'subtle', Bold: 'bold' }) ?? 'subtle'
    ),
    items = getMenuItems(instance)
      .map(
        item => `
          <sl-menu-item ${item.selected ? 'selected' : ''}>
            ${item.label}
          </sl-menu-item>`
      )
      .join('\n');

  return figma.code`
    <sl-menu
      ${emphasis !== 'subtle' ? `emphasis="${emphasis}"` : ''}
    >
      ${items}
    </sl-menu>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
