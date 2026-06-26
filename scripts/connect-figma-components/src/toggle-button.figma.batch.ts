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
