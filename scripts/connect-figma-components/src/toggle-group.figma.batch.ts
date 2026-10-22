// source=packages/components/toggle-group/src/toggle-group.ts
// component=ToggleGroup
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance,
  shape = checkEnum(instance.getEnum('shape', { pill: 'pill', rect: 'rect' }), 'shape'),
  size = checkEnum(instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' }), 'size'),
  fill = checkEnum(instance.getEnum('fill', { outline: 'outline', solid: 'solid' }), 'fill'),
  chips =
    checkEnum(instance.getEnum('chips', { true: 'true', false: 'false' }), 'chips') === 'true';

function getButtonExample(button: InstanceHandle): string {
  const hasIcon =
      checkEnum(button.getEnum('icon', { true: 'true', false: 'false' }), 'icon') === 'true',
    hasText =
      checkEnum(button.getEnum('text', { true: 'true', false: 'false' }), 'text') === 'true',
    pressed =
      checkEnum(button.getEnum('selected', { true: 'true', false: 'false' }), 'selected') ===
      'true';

  let content = '';

  if (hasIcon) {
    const icon = button.findInstance('Base/Icon', { traverseInstances: true });
    if (icon.type !== 'INSTANCE') throw new Error('Missing Figma icon instance in toggle button');

    const name = checkStringProperty(icon.getString('icon-name'), 'icon-name'),
      variant = checkEnum(
        icon.getEnum('variant', {
          outline: 'far',
          solid: 'fas',
          'duotone - outline': 'fadr',
          'duotone - solid': 'fad',
          'custom SVG': 'custom SVG'
        }),
        'icon variant'
      );

    content += `<sl-icon name="${variant ? `${variant}-` : ''}${name}" slot="default"></sl-icon>`;
  }

  if (hasText) {
    const label = button.findText('Label', { traverseInstances: true });
    if (label.type !== 'TEXT') throw new Error('Missing Figma label in text toggle button');

    content += label.textContent;
  }

  return `<sl-toggle-button${pressed ? ' pressed' : ''}>${content}</sl-toggle-button>`;
}

function getExample() {
  const buttonInstances = instance
      .findLayers(node => node.type === 'INSTANCE' && node.name === 'Base Toggle Button')
      .filter((node): node is InstanceHandle => node.type === 'INSTANCE'),
    visibleButtons = [
      true,
      checkBooleanProperty(instance.getBoolean('button 2'), 'button 2'),
      checkBooleanProperty(instance.getBoolean('button 3'), 'button 3'),
      checkBooleanProperty(instance.getBoolean('button 4'), 'button 4')
    ],
    buttons = buttonInstances
      .filter((_, index) => visibleButtons[index])
      .map(getButtonExample)
      .join('\n');

  return figma.code`
    <sl-toggle-group
      ${shape !== 'rect' ? `shape="${shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${chips ? 'chips' : ''}
    >
      ${buttons}
    </sl-toggle-group>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
