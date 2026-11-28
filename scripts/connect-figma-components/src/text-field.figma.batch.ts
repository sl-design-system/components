// source=packages/components/text-field/src/text-field.ts
// component=TextField
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty,
  checkEnum
} from './_shared/figma-assertions.js';
import { getFormFieldProperties, renderFormField } from './_shared/figma-form-field.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('state'), 'state') === 'Disabled',
    hasLabel = checkBooleanProperty(instance.getBoolean('display-label'), 'display-label'),
    displayPlaceholder = checkBooleanProperty(
      instance.getBoolean('display-placeholder'),
      'display-placeholder'
    ),
    placeholder = checkStringProperty(instance.getString('placeholder'), 'placeholder'),
    value = checkStringProperty(instance.getString('value'), 'value'),
    size = checkEnum(instance.getEnum('size', { md: 'md', lg: 'lg' }) ?? 'md', 'size'),
    shape = checkEnum(instance.getEnum('shape', { rect: 'rect', pill: 'pill' }) ?? 'rect', 'shape');

  const formField = getFormFieldProperties(
    hasLabel ? (instance.findInstance('sl-base-label') as InstanceHandle) : undefined
  );

  return renderFormField(
    formField,
    figma.code`
      <sl-text-field
        ${disabled ? ' disabled' : ''}
        ${displayPlaceholder && placeholder ? ` placeholder="${placeholder}"` : ''}
        ${formField.required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
        ${size && size !== 'md' ? ` size="${size}"` : ''}
        ${shape && shape !== 'rect' ? ` shape="${shape}"` : ''}
      ></sl-text-field>
  `
  );
}

export default {
  example: getExample(),
  id: figma.batch.id
};
