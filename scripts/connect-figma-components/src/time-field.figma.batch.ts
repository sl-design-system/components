// source=packages/components/time-field/src/time-field.ts
// component=TimeField
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty
} from './_shared/figma-assertions.js';
import { getFormFieldProperties, renderFormField } from './_shared/figma-form-field.js';

const instance = figma.selectedInstance;

function getExample() {
  const timePicker = instance.findInstance('time_picker') as InstanceHandle;

  const disabled = checkStringProperty(timePicker.getString('state'), 'state') === 'disabled',
    hasLabel = checkBooleanProperty(timePicker.getBoolean('display-label'), 'display-label'),
    placeholder = checkStringProperty(timePicker.getString('placeholder'), 'placeholder'),
    value = checkStringProperty(timePicker.getString('value'), 'value');

  const formField = getFormFieldProperties(
    hasLabel ? (timePicker.findInstance('sl-base-label') as InstanceHandle) : undefined
  );

  return renderFormField(
    formField,
    figma.code`
      <sl-time-field
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${formField.required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-time-field>
  `
  );
}

export default {
  example: getExample(),
  id: figma.batch.id
};
