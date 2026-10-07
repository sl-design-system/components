// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=301-41090
// source=packages/components/icon/src/icon.ts
// component=Icon
import figma from 'figma';
import { checkEnum, checkInstance, checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const sizeSwap = instance.getInstanceSwap('size');
  if (!sizeSwap || sizeSwap.type !== 'INSTANCE')
    throw new Error('Missing Figma instance swap: size');

  const sizeInstance = sizeSwap,
    supportedSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const,
    requestedSize = sizeInstance.name.split('/').at(-1),
    size = checkEnum<(typeof supportedSizes)[number]>(
      supportedSizes.find(candidate => candidate === requestedSize) ?? 'md'
    ),
    baseIcon = checkInstance(
      sizeInstance.findInstance('Base/Icon', { traverseInstances: true }),
      'Base/Icon'
    ),
    name = checkStringProperty(baseIcon.getString('icon-name'), 'icon-name'),
    variant = checkEnum(
      baseIcon.getEnum('variant', {
        outline: 'far',
        solid: 'fas',
        'duotone - outline': 'fadr',
        'duotone - solid': 'fad',
        'custom SVG': 'custom SVG'
      }) ?? 'far'
    );

  if (variant === 'spinner') {
    return figma.code`<sl-spinner size="${size}"></sl-spinner>`;
  }

  const iconName = variant === 'custom SVG' ? name : `${variant}-${name}`;

  return figma.code`<sl-icon name="${iconName}" size="${size}"></sl-icon>`;
}

export default {
  example: getExample(),
  id: 'Icon',
  metadata: { nestable: true }
};
