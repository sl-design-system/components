import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('State'), 'State') === 'Disabled';

  const fill =
    instance.getEnum('Type', {
      Outline: 'outline',
      Ghost: 'ghost',
      Link: 'link'
    }) || 'solid';

  const icon = checkInstance(
    instance.findInstance('Base/Icon', { traverseInstances: true }),
    'Base/Icon'
  );

  const name = checkStringProperty(icon.getString('𝐓 - FontAwesome'), '𝐓 - FontAwesome'),
    variant = icon.getEnum('Variant', { Outline: 'far', Solid: 'fas' });

  const selected = checkBooleanProperty(instance.getBoolean('Selected'), 'Selected');

  const size = instance.getEnum('↕️ - Size', { SM: 'sm', LG: 'lg' }) || 'md';

  return figma.code`
    <sl-toggle-button
      ${disabled ? 'disabled' : ''}
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${selected ? 'pressed' : ''}
      ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      <sl-icon name="${variant ? `${variant}-` : ''}${name}" slot="default"></sl-icon>
    </sl-toggle-button>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
