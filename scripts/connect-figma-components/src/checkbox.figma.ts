// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=892-255678
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const checked = checkBooleanProperty(instance.getBoolean('selected'), 'selected'),
    disabled = checkStringProperty(instance.getString('state'), 'state') === 'Disabled',
    indeterminate = checkBooleanProperty(instance.getBoolean('intermediate'), 'intermediate'),
    hasLabel = checkBooleanProperty(instance.getBoolean('label'), 'label');

  const checkboxBase = instance.findInstance('checkbox-base') as InstanceHandle;

  // The default size is "md".
  const size = checkEnum(
    checkboxBase.getEnum('size', {
      SM: 'sm',
      LG: 'lg'
    }) || 'md'
  );

  let label;
  if (hasLabel) {
    label = checkStringProperty(checkboxBase.getString('label'), 'label');
  }

  return figma.code`
    <sl-checkbox
      ${checked ? ' checked' : ''}
      ${disabled ? ' disabled' : ''}
      ${!checked && indeterminate ? ' indeterminate' : ''}
      ${size !== 'md' ? ` size="${size}"` : ''}
    >
      ${label}
    </sl-checkbox>
  `;
}

export default {
  example: getExample(),
  id: 'checkbox'
};
