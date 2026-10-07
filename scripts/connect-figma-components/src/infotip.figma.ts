// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=17355-98183
import figma from 'figma';
import { checkInstance, checkEnum } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const button = checkInstance(
      instance.findInstance('sl-button-rectangular', { traverseInstances: true }),
      'sl-button-rectangular'
    ),
    buttonBase = checkInstance(
      button.findInstance('Button-Base', { traverseInstances: true }),
      'Button-Base'
    );

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
