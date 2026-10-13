// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=10106-702411
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
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
        ${required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-date-field>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'date-field'
};
