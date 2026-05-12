// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=935-17454
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const checked = instance.getBoolean('Checked'),
    disabled = instance.getString('State') === 'Disabled';

  const radiobuttonBase = instance.findInstance('radiobutton-base');
  if (radiobuttonBase.type === 'ERROR') return null;

  const label = radiobuttonBase.getString('label text');

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
