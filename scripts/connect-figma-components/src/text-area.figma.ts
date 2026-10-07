// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1631-139565
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

  return figma.code`
    <sl-form-field${label ? ` label="${label}"` : ''}>
      <sl-text-area
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-text-area>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'text-area'
};
