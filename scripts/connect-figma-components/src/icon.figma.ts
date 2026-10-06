// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=49-7103
// source=packages/components/icon/src/icon.ts
// component=Icon
import figma from 'figma';
import { checkEnum, checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const name = checkStringProperty(instance.getString('icon-name'), 'icon-name'),
    slot = instance.getString('slot'),
    variant = checkEnum(
      instance.getEnum('variant', {
        outline: 'far',
        solid: 'fas',
        'duotone-outline': 'fadr',
        'duotone-solid': 'fad'
      }) ?? 'far'
    );

  return figma.code`
    <sl-icon
      name="${variant ? `${variant}-` : ''}${name}"
      ${typeof slot === 'string' ? `slot="${slot}"` : ''}
    ></sl-icon>
  `;
}

export default {
  example: getExample(),
  id: 'icon',
  metadata: { nestable: true }
};
