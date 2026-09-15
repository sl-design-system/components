// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=10106-702411
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const variants = instance.findInstance('sl-date_field-variants', { traverseInstances: true });
  if (variants.type === 'ERROR') throw new Error('Missing Figma instance: sl-date_field-variants');

  const disabled = variants.getString('Variant') === 'Disabled',
    hasLabel = variants.getBoolean('Label'),
    placeholder = variants.getString('Placeholder text'),
    value = variants.getString('Text');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = variants.findInstance('sl-base-label');
    if (labelBase.type === 'ERROR') throw new Error('Missing Figma instance: sl-base-label');

    label = labelBase.getString('Label');
    required = labelBase.getBoolean('Required');
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
