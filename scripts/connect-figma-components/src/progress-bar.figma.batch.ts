// source=packages/components/progress-bar/src/progress-bar.ts
// component=ProgressBar
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const variant = checkEnum(
      instance.getEnum('variant', {
        undefined: 'default',
        success: 'positive',
        error: 'negative',
        warning: 'caution'
      }) || 'default'
    ),
    progress = checkEnum(
      instance.getEnum('progress', {
        '0%': '0%',
        '25%': '25%',
        '50%': '50%',
        '75%': '75%',
        '100%': '100%',
        Indeterminate: 'indeterminate'
      }) || '0%'
    ),
    color = checkEnum(
      instance.getEnum('color', {
        default: 'default',
        blue: 'blue',
        green: 'green',
        orange: 'orange',
        purple: 'purple',
        red: 'red',
        teal: 'teal',
        yellow: 'yellow'
      }) || 'default'
    );

  const optionalLabel = instance.findInstance('sl-base-label-optional') as InstanceHandle,
    showLabel = checkBooleanProperty(
      optionalLabel.getBoolean('display-label', { true: true, false: false }),
      'display-label'
    ),
    labelBase = optionalLabel.findInstance('sl-base-label', {
      traverseInstances: true
    }) as InstanceHandle,
    label = checkStringProperty(labelBase.getString('label'), 'label');

  let errorMessage = '';
  if (variant === 'negative') {
    const validationMessage = instance.findInstance('sl-base-validation-message', {
      traverseInstances: true
    }) as InstanceHandle;
    errorMessage = checkStringProperty(validationMessage.getString('Message'), 'Message');
  }

  const value = progress === 'indeterminate' ? undefined : Number.parseInt(progress, 10);

  return figma.code`
		<sl-progress-bar
			${variant && variant !== 'default' ? `variant="${variant}"` : ''}
			${color !== 'default' ? `color="${color}"` : ''}
			${value !== undefined ? `value="${value}"` : 'indeterminate'}
			${showLabel ? `label="${label}"` : ''}
		>
			${errorMessage ? `<span slot="error">${errorMessage}</span>` : ''}
		</sl-progress-bar>
	`;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
