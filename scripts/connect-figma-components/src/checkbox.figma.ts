// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=892-255678
import figma from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const checked = checkBooleanProperty(instance.getBoolean('Checked'), 'Checked'),
    disabled = checkStringProperty(instance.getString('State'), 'State') === 'Disabled',
    indeterminate = checkBooleanProperty(instance.getBoolean('Intermediate'), 'Intermediate'),
    hasLabel = checkBooleanProperty(instance.getBoolean('Label'), 'Label');

  const checkboxBase = checkInstance(instance.findInstance('checkbox-base'), 'checkbox-base');

  // The default size is "md".
  const size = checkEnum(
    checkboxBase.getEnum('↕️ - Size', {
      SM: 'sm',
      LG: 'lg'
    }) || 'md'
  );

  let label;
  if (hasLabel) {
    label = checkStringProperty(checkboxBase.getString('Label text'), 'Label text');
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
