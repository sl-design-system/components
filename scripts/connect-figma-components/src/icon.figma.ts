// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=49-7103
import figma from 'figma';
import { checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const name = checkStringProperty(instance.getString('𝐓 - FontAwesome'), '𝐓 - FontAwesome'),
    slot = instance.getString('slot'),
    variant = instance.getEnum('Variant', { Outline: 'far', Solid: 'fas' });

  return figma.code`
    <sl-icon
      name="${variant ? `${variant}-` : ''}${name}"
      ${typeof slot === 'string' ? `slot="${slot}"` : ''}
    ></sl-icon>
  `;
}

export default {
  example: getExample(),
  id: 'icon'
};
