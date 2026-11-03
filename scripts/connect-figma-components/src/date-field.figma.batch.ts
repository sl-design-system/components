// source=packages/components/date-field/src/date-field.ts
// component=DateField
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

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

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = variants.findInstance('sl-base-label') as InstanceHandle;

    label = checkStringProperty(labelBase.getString('label'), 'label');
    required = checkBooleanProperty(labelBase.getBoolean('required'), 'required');
  }

  return figma.code`
    <sl-form-field ${label ? `label="${label}"` : ''}>
      <sl-date-field
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${shape !== 'rect' ? ` shape="${shape}"` : ''}
        ${required ? ' required' : ''}
        ${size !== 'md' ? ` size="${size}"` : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-date-field>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
