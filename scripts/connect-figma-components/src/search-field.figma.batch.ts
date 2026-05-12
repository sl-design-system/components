/// <reference types="@figma/code-connect/figma-types" />
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
