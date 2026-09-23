// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1040-29501
import figma from 'figma';
import { checkBooleanProperty, checkEnum } from './_shared/figma-assertions.js';
import { getMenuItems } from './_shared/figma-menu.js';

const instance = figma.selectedInstance;

function getExample() {
  const multiSelect = checkBooleanProperty(instance.getBoolean('Multi select'), 'Multi select'),
    emphasis = checkEnum(
      instance.getEnum('Emphasis', { Muted: 'subtle', Bold: 'bold' }) ?? 'subtle'
    ),
    items = getMenuItems(instance)
      .map(
        item => `
          <sl-menu-item${item.selected ? ' selectable selected' : ''}>
            ${item.label}
          </sl-menu-item>`
      )
      .join('\n');

  return figma.code`
    <sl-menu
      ${multiSelect ? 'selects="multiple"' : ''}
      ${emphasis !== 'subtle' ? `emphasis="${emphasis}"` : ''}
    >
      ${items}
    </sl-menu>
  `;
}

export default {
  example: getExample(),
  id: 'menu-panel'
};
