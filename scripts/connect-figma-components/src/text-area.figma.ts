// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1631-139565
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = instance.getString('Variant') === 'Disabled',
    hasLabel = instance.getBoolean('Label'),
    placeholder = instance.getString('Placeholder text'),
    value = instance.getString('Text');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = instance.findInstance('sl-base-label');
    if (labelBase.type === 'ERROR') return null;

    label = labelBase.getString('Label');
    required = labelBase.getBoolean('Required');
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
