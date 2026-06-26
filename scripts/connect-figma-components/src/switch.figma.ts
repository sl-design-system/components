// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=5127-320173
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const checked = instance.getBoolean('Status'),
    disabled = instance.getString('State') === 'Disabled',
    reverse = instance.getBoolean('Reverse'),
    showText = instance.getBoolean('Switch Text'),
    size = instance.getString('Size') ?? 'md',
    text = instance.getString('Text');

  return figma.code`
    <sl-switch
      ${checked ? 'checked' : ''}
      ${disabled ? 'disabled' : ''}
      ${reverse ? 'reverse' : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      ${showText ? text : ''}
    </sl-switch>
  `;
}

export default {
  example: getExample(),
  id: 'switch'
};
