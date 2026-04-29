// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=301-54346
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const buttonVariants = instance.findInstance('Button-Variants');
  if (buttonVariants.type === 'ERROR') return null;

  const disabled = buttonVariants.getString('State') === 'Disabled';

  // The default fill is "solid".
  const fill =
    buttonVariants.getEnum('Type', {
      Outline: 'outline',
      Ghost: 'ghost',
      Link: 'link'
    }) || 'solid';

  // The default variant is "secondary".
  const variant =
    buttonVariants.getEnum('Variant', {
      Primary: 'primary',
      Positive: 'success',
      Info: 'info',
      Caution: 'warning',
      Negative: 'danger',
      Inverted: 'inverted'
    }) || 'secondary';

  const buttonBase = buttonVariants.findInstance('Button-Base');
  if (buttonBase.type === 'ERROR') return null;

  const iconStart = buttonBase.getBoolean('Icon Start'),
    iconEnd = buttonBase.getBoolean('Icon End'),
    label = buttonBase.getString('𝐓 - Label');

  // The default size is "md".
  const size =
    buttonBase.getEnum('↕️ - Size', {
      SM: 'sm',
      LG: 'lg'
    }) || 'md';

  let icon;
  if (iconStart || iconEnd) {
    icon = buttonBase.findInstance('Base/Icon', { traverseInstances: true });
  }

  return figma.code`
    <sl-button
      ${disabled ? ' disabled' : ''}
      ${fill !== 'solid' ? ` fill="${fill}"` : ''}
      shape="pill"
      ${size !== 'md' ? ` size="${size}"` : ''}
      ${variant !== 'secondary' ? ` variant="${variant}"` : ''}
    >
      ${iconStart ? icon?.executeTemplate().example : ''}
      ${label}
      ${iconEnd ? icon?.executeTemplate().example : ''}
    </sl-button>
  `;
}

export default {
  example: getExample(),
  id: 'button',
  imports: []
};
