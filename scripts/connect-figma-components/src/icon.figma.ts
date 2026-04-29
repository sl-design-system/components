// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=49-7103
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const name = instance.getString('𝐓 - FontAwesome'),
    variant = instance.getEnum('Variant', { Outline: 'far', Solid: 'fas' });

  return figma.code`<sl-icon name="${variant ? `${variant}-` : ''}${name}"></sl-icon>`;
}

export default {
  example: getExample(),
  id: 'icon'
};
