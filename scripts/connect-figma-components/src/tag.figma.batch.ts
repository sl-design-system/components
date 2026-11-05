// source=packages/components/tag/src/tag.ts
// component=Tag
import figma from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const label = checkStringProperty(instance.getString('label'), 'label'),
    removable = checkBooleanProperty(instance.getBoolean('removable'), 'removable'),
    size = checkEnum(instance.getEnum('size', { md: 'md', lg: 'lg' }), 'size'),
    variant = checkEnum(
      instance.getEnum('variant', { neutral: 'neutral', info: 'info' }),
      'variant'
    ),
    state = checkEnum(
      instance.getEnum('state', {
        idle: 'idle',
        hover: 'hover',
        active: 'active',
        disabled: 'disabled'
      }),
      'state'
    ),
    disabled = state === 'disabled';

  return figma.code`
		<sl-tag
			${disabled ? 'disabled' : ''}
			${removable ? 'removable' : ''}
			${size !== 'md' ? `size="${size}"` : ''}
			${variant !== 'neutral' ? `variant="${variant}"` : ''}
		>
			${label}
		</sl-tag>
	`;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
