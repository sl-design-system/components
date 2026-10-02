// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1014-329272
import figma from 'figma';
import { checkBooleanProperty, checkInstance } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const selected = checkBooleanProperty(instance.getBoolean('Selected'), 'Selected');

  checkInstance(instance.findInstance('menu-base'), 'menu-base');

  return figma.code`
    <sl-menu-item
      ${selected ? 'selectable selected' : ''}
    >
      Menu Item
    </sl-menu-item>
  `;
}

export default {
  example: getExample(),
  id: 'menu-item'
};
