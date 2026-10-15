// source=packages/components/toggle-button/src/toggle-button.ts
// component=ToggleButton
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('State'), 'State') === 'Disabled';

  const fill = checkEnum(
    instance.getEnum('Type', {
      Outline: 'outline',
      Solid: 'solid'
    }) || 'solid'
  );

  const icon = instance.findInstance('Base/Icon', { traverseInstances: true }) as InstanceHandle;

  const name = checkStringProperty(icon.getString('icon-name'), 'icon-name'),
    variant = checkEnum(icon.getEnum('variant', { Outline: 'far', Solid: 'fas' }) || 'far');

  const selected = checkBooleanProperty(instance.getBoolean('Selected'), 'Selected');

  const size = checkEnum(instance.getEnum('↕️ - Size', { SM: 'sm', LG: 'lg' }) || 'md');

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
