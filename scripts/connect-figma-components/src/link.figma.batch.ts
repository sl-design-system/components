import figma from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const variants = checkInstance(
    instance.findInstance('StandaloneLink-Variants'),
    'StandaloneLink-Variants'
  );

  const link = checkInstance(
    variants.findInstance('sl-link-base', { traverseInstances: true }),
    'sl-link-base'
  );

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
    size = checkEnum(link.getEnum('↕️ - Size', { SM: 'sm', MD: 'md' }) ?? 'md');

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
