// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1014-329272
import figma, { type InstanceHandle } from 'figma';
import { checkBooleanProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const selected = checkBooleanProperty(instance.getBoolean('Selected'), 'Selected');

  instance.findInstance('menu-base') as InstanceHandle;

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
