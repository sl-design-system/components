// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=3494-119505
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = instance.getString('State') === 'Disabled';

  const fill =
    instance.getEnum('Type', {
      Outline: 'outline',
      Ghost: 'ghost',
      Link: 'link'
    }) || 'solid';

  const hasIcon = instance.getBoolean('Icon'),
    hasText = instance.getBoolean('Text');

  let icon = '';
  if (hasIcon) {
    const iconInstance = instance.findInstance('Base/Icon', { traverseInstances: true });
  }

  const icon = instance.findInstance('Base/Icon', { traverseInstances: true });
  if (icon.type === 'ERROR') return null;

  const name = icon.getString('𝐓 - FontAwesome'),
    variant = icon.getEnum('Variant', { Outline: 'far', Solid: 'fas' });

  const selected = instance.getBoolean('Selected');

  const size = instance.getEnum('↕️ - Size', { SM: 'sm', LG: 'lg' }) || 'md';

  return figma.code`
    <sl-toggle-button
      ${disabled ? 'disabled' : ''}
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${selected ? 'pressed' : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      <sl-icon name="${variant ? `${variant}-` : ''}${name}" slot="default"></sl-icon>
      ${instance.children.map(c => c.type).join(', ')}
    </sl-toggle-button>
  `;
}

export default {
  example: getExample(),
  id: 'toggle-button'
};
