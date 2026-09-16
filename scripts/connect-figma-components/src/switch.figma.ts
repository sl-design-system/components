// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=5127-320173
import figma from 'figma';
import { checkBooleanProperty, checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const checked = checkBooleanProperty(instance.getBoolean('Status'), 'Status'),
    disabled = checkStringProperty(instance.getString('State'), 'State') === 'Disabled',
    reverse = checkBooleanProperty(instance.getBoolean('Reverse'), 'Reverse'),
    showText = checkBooleanProperty(instance.getBoolean('Switch Text'), 'Switch Text'),
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
