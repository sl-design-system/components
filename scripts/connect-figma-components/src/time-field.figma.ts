// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=9135-381361
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const timePicker = instance.findInstance('time_picker') as InstanceHandle;

  const disabled = checkStringProperty(timePicker.getString('state'), 'state') === 'disabled',
    hasLabel = checkBooleanProperty(timePicker.getBoolean('display-label'), 'display-label'),
    placeholder = timePicker.getString('placeholder'),
    value = timePicker.getString('value');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = timePicker.findInstance('sl-base-label') as InstanceHandle;

    label = checkStringProperty(labelBase.getString('label'), 'label');
    required = checkBooleanProperty(labelBase.getBoolean('required'), 'required');
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
