// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=9016-82058
import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('Variant'), 'Variant') === 'Disabled';

  const baseNumberField = checkInstance(
    instance.findInstance('base number field'),
    'base number field'
  );

  const hasLabel = checkBooleanProperty(baseNumberField.getBoolean('Label'), 'Label'),
    placeholder = baseNumberField.getString('Placeholder'),
    stepButtons = baseNumberField.getEnum('Steppers', { Edges: 'edges', End: 'end' }),
    value = baseNumberField.getString('Input Text');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = checkInstance(baseNumberField.findInstance('sl-base-label'), 'sl-base-label');

    label = checkStringProperty(labelBase.getString('Label'), 'Label');
    required = checkBooleanProperty(labelBase.getBoolean('Required'), 'Required');
  }

  return figma.code`
    <sl-form-field ${label ? `label="${label}"` : ''}>
      <sl-number-field
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${required ? ' required' : ''}
        ${stepButtons ? ` step-buttons="${stepButtons}"` : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-number-field>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'number-field'
};
