import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('Variant'), 'Variant') === 'Disabled',
    hasLabel = checkBooleanProperty(instance.getBoolean('Label'), 'Label'),
    placeholder = instance.getString('Placeholder text'),
    value = instance.getString('Text');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = checkInstance(instance.findInstance('sl-base-label'), 'sl-base-label');

    label = checkStringProperty(labelBase.getString('Label'), 'Label');
    required = checkBooleanProperty(labelBase.getBoolean('Required'), 'Required');
  }

  const searchField = figma.code`
    <sl-search-field
      ${disabled ? ' disabled' : ''}
      ${placeholder ? ` placeholder="${placeholder}"` : ''}
      ${required ? ' required' : ''}
      ${value ? ` value="${value}"` : ''}
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
