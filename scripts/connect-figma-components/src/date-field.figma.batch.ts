// source=packages/components/date-field/src/date-field.ts
// component=DateField
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';
import { getFormFieldProperties, renderFormField } from './_shared/figma-form-field.js';

const instance = figma.selectedInstance;

function getExample() {
  const variants = instance.findInstance('sl-date_field-variants', {
    traverseInstances: true
  }) as InstanceHandle;

  const disabled = checkStringProperty(variants.getString('state'), 'state') === 'Disabled',
    hasLabel = checkBooleanProperty(variants.getBoolean('display-label'), 'display-label'),
    placeholder = checkStringProperty(variants.getString('placeholder'), 'placeholder'),
    size = checkEnum(variants.getEnum('size', { md: 'md', lg: 'lg' }) ?? 'md'),
    shape = checkEnum(variants.getEnum('shape', { pill: 'pill', rect: 'rect' }) ?? 'rect'),
    value = checkStringProperty(variants.getString('value'), 'value');

  const formField = getFormFieldProperties(
    hasLabel ? (variants.findInstance('sl-base-label') as InstanceHandle) : undefined
  );

  return renderFormField(
    formField,
    figma.code`
      <sl-date-field
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${shape !== 'rect' ? ` shape="${shape}"` : ''}
        ${formField.required ? ' required' : ''}
        ${size !== 'md' ? ` size="${size}"` : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-date-field>
  `
  );
}

export default {
  example: getExample(),
  id: figma.batch.id
};
