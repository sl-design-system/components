// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=892-255678
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const checked = instance.getBoolean('Checked'),
    disabled = instance.getString('State') === 'Disabled',
    indeterminate = instance.getBoolean('Intermediate'),
    hasLabel = instance.getBoolean('Label');

  const checkboxBase = instance.findInstance('checkbox-base');
  if (checkboxBase.type === 'ERROR') return null;

  // The default size is "md".
  const size =
    checkboxBase.getEnum('↕️ - Size', {
      SM: 'sm',
      LG: 'lg'
    }) || 'md';

  let label;
  if (hasLabel) {
    label = checkboxBase.getString('label text');
  }

  return figma.code`
    <sl-checkbox
      ${checked ? ' checked' : ''}
      ${disabled ? ' disabled' : ''}
      ${!checked && indeterminate ? ' indeterminate' : ''}
      ${size !== 'md' ? ` size="${size}"` : ''}
    >
      ${label}
    </sl-checkbox>
  `;
}

export default {
  example: getExample(),
  id: 'checkbox'
};
