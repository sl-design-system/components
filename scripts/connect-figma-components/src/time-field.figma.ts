// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=9135-381361
import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const timePicker = checkInstance(instance.findInstance('time_picker'), 'time_picker');

  const disabled = checkStringProperty(timePicker.getString('Variant'), 'Variant') === 'Disabled',
    hasLabel = checkBooleanProperty(timePicker.getBoolean('Label'), 'Label'),
    placeholder = timePicker.getString('Placeholder text'),
    value = timePicker.getString('Text');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = checkInstance(timePicker.findInstance('sl-base-label'), 'sl-base-label');

    label = checkStringProperty(labelBase.getString('Label'), 'Label');
    required = checkBooleanProperty(labelBase.getBoolean('Required'), 'Required');
  }

  return figma.code`
    <sl-form-field ${label ? `label="${label}"` : ''}>
      <sl-time-field
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-time-field>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'time-field'
};
