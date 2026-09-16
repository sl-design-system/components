// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=935-17454
import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const checked = checkBooleanProperty(instance.getBoolean('Checked'), 'Checked'),
    disabled = checkStringProperty(instance.getString('State'), 'State') === 'Disabled';

  const radiobuttonBase = checkInstance(
    instance.findInstance('radiobutton-base'),
    'radiobutton-base'
  );

  const label = checkStringProperty(radiobuttonBase.getString('Label text'), 'Label text');

  // The default size is "md".
  const size =
    radiobuttonBase.getEnum('↕️ - Size', {
      SM: 'sm',
      LG: 'lg'
    }) || 'md';

  return figma.code`
    <sl-radio
      ${checked ? 'checked' : ''}
      ${disabled ? ' disabled' : ''}
      ${size !== 'md' ? ` size="${size}"` : ''}
    >
      ${label}
    </sl-radio>
  `;
}

export default {
  example: getExample(),
  id: 'radio'
};
