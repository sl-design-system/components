// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=9016-82058
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = instance.getString('Variant') === 'Disabled';

  const baseNumberField = instance.findInstance('base number field');
  if (baseNumberField.type === 'ERROR') return null;

  const hasLabel = baseNumberField.getBoolean('Label'),
    placeholder = baseNumberField.getString('Placeholder'),
    stepButtons = baseNumberField.getEnum('Steppers', { Edges: 'edges', End: 'end' }),
    value = baseNumberField.getString('Input Text');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = baseNumberField.findInstance('sl-base-label');
    if (labelBase.type === 'ERROR') return null;

    label = labelBase.getString('Label');
    required = labelBase.getBoolean('Required');
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
