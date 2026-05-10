// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1014-329272
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const selected = instance.getBoolean('Selected');

  const menuBase = instance.findInstance('menu-base');
  if (menuBase.type === 'ERROR') return null;

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
