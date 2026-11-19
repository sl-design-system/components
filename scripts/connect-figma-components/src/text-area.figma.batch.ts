// source=packages/components/text-area/src/text-area.ts
// component=TextArea
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty
} from './_shared/figma-assertions.js';
import { getFormFieldProperties, renderFormField } from './_shared/figma-form-field.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('state'), 'state') === 'Disabled',
    hasLabel = checkBooleanProperty(instance.getBoolean('display-label'), 'display-label'),
    placeholder = checkStringProperty(instance.getString('placeholder'), 'placeholder'),
    value = checkStringProperty(instance.getString('value'), 'value');

  const formField = getFormFieldProperties(
    hasLabel ? (instance.findInstance('sl-base-label') as InstanceHandle) : undefined
  );

  return renderFormField(
    formField,
    figma.code`
      <sl-text-area
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${formField.required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-text-area>
  `
  );
}

export default {
  example: getExample(),
  id: figma.batch.id
};
