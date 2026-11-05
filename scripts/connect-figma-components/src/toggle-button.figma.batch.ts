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
  const fillOptions = {
    outline: 'outline',
    solid: 'solid'
  } as const;
  const fill = checkEnum(instance.getEnum('fill', fillOptions), 'fill') || 'solid';

  const icon = instance.findInstance('Base/Icon', { traverseInstances: true }) as InstanceHandle;

  const name = checkStringProperty(icon.getString('icon-name'), 'icon-name'),
    variant = checkEnum(icon.getEnum('variant', { outline: 'far' }), 'icon variant') || 'far';

  const pressed = checkBooleanProperty(instance.getBoolean('pressed'), 'pressed');

  const sizeOptions = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  } as const;
  const size = checkEnum(instance.getEnum('size', sizeOptions), 'size') || 'md';

  return figma.code`
    <sl-toggle-button
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${pressed ? 'pressed' : ''}
      ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
      ${variant !== 'far' ? `variant="${variant}"` : ''}
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
