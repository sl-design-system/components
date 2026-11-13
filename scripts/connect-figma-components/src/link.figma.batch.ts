// source=packages/components/link/src/link.ts
// component=Link
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const variants = instance.findInstance('StandaloneLink-Variants') as InstanceHandle;

  const link = variants.findInstance('sl-link-base', { traverseInstances: true }) as InstanceHandle;

  const fill = checkEnum(variants.getEnum('fill', { outline: 'outline' }) ?? 'solid'),
    variant = checkEnum(variants.getEnum('variant', { primary: 'primary' }) ?? 'secondary'),
    label = checkStringProperty(link.getString('linkText'), 'linkText'),
    arrowStart = checkBooleanProperty(
      link.getBoolean('Internal arrow (start)'),
      'Internal arrow (start)'
    ),
    arrowEnd = checkBooleanProperty(
      link.getBoolean('Internal arrow (end)'),
      'Internal arrow (end)'
    ),
    size = checkEnum(link.getEnum('size', { SM: 'sm', MD: 'md' }) ?? 'md');

  return figma.code`
		<sl-link
			${fill !== 'solid' ? `fill="${fill}"` : ''}
			${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
			${size !== 'md' ? `size="${size}"` : ''}
			${variant !== 'secondary' ? `variant="${variant}"` : ''}
			${arrowStart ? 'icon-position="start"' : ''}
			${!arrowStart && !arrowEnd ? 'no-icon' : ''}
		>
			<a href="#">${label}</a>
		</sl-link>
	`;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
