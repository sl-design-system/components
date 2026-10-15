// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1627-81163
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('state'), 'state') === 'Disabled',
    hasLabel = checkBooleanProperty(instance.getBoolean('display-label'), 'display-label'),
    placeholder = checkStringProperty(instance.getString('placeholder'), 'placeholder'),
    value = checkStringProperty(instance.getString('value'), 'value');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = instance.findInstance('sl-base-label') as InstanceHandle;

    label = checkStringProperty(labelBase.getString('label'), 'label');
    required = checkBooleanProperty(labelBase.getBoolean('required'), 'required');
  }

  return figma.code`
    <sl-form-field ${label ? `label="${label}"` : ''}>
      <sl-text-field
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-text-field>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'text-field'
};
