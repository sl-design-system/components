// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=10099-668293
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = instance.getString('Variant') === 'Disabled',
    placeholder = instance.getString('Placeholder text'),
    value = instance.getString('Text');

  return figma.code`
    <sl-search-field
      ${disabled ? ' disabled' : ''}
      ${placeholder ? ` placeholder="${placeholder}"` : ''}
      ${value ? ` value="${value}"` : ''}
    ></sl-search-field>
  `;
}

export default {
  example: getExample(),
  id: 'search-field'
};
