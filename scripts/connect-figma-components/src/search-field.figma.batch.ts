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
    placeholder = checkStringProperty(instance.getString('placeholder'), 'placeholder');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = instance.findInstance('sl-base-label') as InstanceHandle;

    label = checkStringProperty(labelBase.getString('label'), 'label');
    required = checkBooleanProperty(labelBase.getBoolean('required'), 'required');
  }

  const searchField = figma.code`
    <sl-search-field
      ${disabled ? ' disabled' : ''}
      ${placeholder ? ` placeholder="${placeholder}"` : ''}
      ${required ? ' required' : ''}
    ></sl-search-field>
  `;

  if (hasLabel) {
    return figma.code`
      <sl-form-field ${label ? `label="${label}"` : ''}>
        ${searchField}
      </sl-form-field>
    `;
  }

  return searchField;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
