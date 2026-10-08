// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=17355-98183
import figma, { type InstanceHandle } from 'figma';
import { checkEnum } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const button = instance.findInstance('sl-button-rectangular', {
      traverseInstances: true
    }) as InstanceHandle,
    buttonBase = button.findInstance('Button-Base', { traverseInstances: true }) as InstanceHandle;

  const size = checkEnum(
    buttonBase.getEnum('↕️ - Size', {
      SM: 'sm',
      MD: 'md',
      LG: 'lg'
    }) ?? 'md'
  );

  return figma.code`
    <sl-infotip
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      Infotip content
    </sl-infotip>
  `;
}

export default {
  example: getExample(),
  id: 'infotip'
};
