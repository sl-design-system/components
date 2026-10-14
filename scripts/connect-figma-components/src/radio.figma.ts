// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=935-17454
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const checked = checkBooleanProperty(instance.getBoolean('selected'), 'selected'),
    disabled = checkStringProperty(instance.getString('state'), 'state') === 'Disabled';

  const radiobuttonBase = instance.findInstance('radiobutton-base') as InstanceHandle;

  const label = checkStringProperty(radiobuttonBase.getString('label'), 'label');

  // The default size is "md".
  const size = checkEnum(
    radiobuttonBase.getEnum('size', {
      SM: 'sm',
      LG: 'lg'
    }) || 'md'
  );

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
