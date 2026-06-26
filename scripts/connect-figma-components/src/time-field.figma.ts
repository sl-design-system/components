// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=9135-381361
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const timePicker = instance.findInstance('time_picker');
  if (timePicker.type === 'ERROR') return null;

  const disabled = timePicker.getString('Variant') === 'Disabled',
    hasLabel = timePicker.getBoolean('Label'),
    placeholder = timePicker.getString('Placeholder text'),
    value = timePicker.getString('Text');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = timePicker.findInstance('sl-base-label');
    if (labelBase.type === 'ERROR') return null;

    label = labelBase.getString('Label');
    required = labelBase.getBoolean('Required');
  }

  return figma.code`
    <sl-form-field ${label ? `label="${label}"` : ''}>
      <sl-time-field
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-time-field>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'time-field'
};
