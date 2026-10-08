// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=3572-168559
import figma, { type InstanceHandle } from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const state = checkEnum(
      instance.getEnum('State', {
        Default: 'default',
        Positive: 'positive',
        Negative: 'negative',
        Caution: 'caution'
      }) || 'default'
    ),
    progress = checkEnum(
      instance.getEnum('Progress', {
        '0%': '0%',
        '25%': '25%',
        '50%': '50%',
        '75%': '75%',
        '100%': '100%',
        Indeterminate: 'indeterminate'
      }) || '0%'
    ),
    color = checkEnum(
      instance.getEnum('Color', {
        Default: 'default',
        Blue: 'blue',
        Green: 'green',
        Orange: 'orange',
        Purple: 'purple',
        Red: 'red',
        Teal: 'teal',
        Yellow: 'yellow'
      }) || 'default'
    );

  const optionalLabel = instance.findInstance('sl-base-label-optional') as InstanceHandle,
    showLabel = checkBooleanProperty(
      optionalLabel.getBoolean('Label', { true: true, false: false }),
      'Label'
    ),
    labelBase = optionalLabel.findInstance('sl-base-label', {
      traverseInstances: true
    }) as InstanceHandle,
    label = checkStringProperty(labelBase.getString('Label'), 'Label');

  let errorMessage = '';
  if (state === 'negative') {
    const validationMessage = instance.findInstance('sl-base-validation-message', {
      traverseInstances: true
    }) as InstanceHandle;
    errorMessage = checkStringProperty(validationMessage.getString('Message'), 'Message');
  }

  const value = progress === 'indeterminate' ? undefined : Number.parseInt(progress, 10),
    variant =
      state === 'positive'
        ? 'success'
        : state === 'negative'
          ? 'error'
          : state === 'caution'
            ? 'warning'
            : undefined;

  return figma.code`
		<sl-progress-bar
			${variant ? `variant="${variant}"` : ''}
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
  id: 'progress-bar'
};
