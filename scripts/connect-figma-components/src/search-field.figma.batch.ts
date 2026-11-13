// source=packages/components/search-field/src/search-field.ts
// component=SearchField
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
    placeholder = checkStringProperty(instance.getString('placeholder'), 'placeholder');

  const formField = getFormFieldProperties(
    hasLabel ? (instance.findInstance('sl-base-label') as InstanceHandle) : undefined
  );

  const searchField = figma.code`
    <sl-search-field
      ${disabled ? ' disabled' : ''}
      ${placeholder ? ` placeholder="${placeholder}"` : ''}
      ${formField.required ? ' required' : ''}
    ></sl-search-field>
  `;

  if (hasLabel) {
    return renderFormField(formField, searchField);
  }

  return searchField;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
