import figma from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const slot = instance.getString('slot');

  const buttonVariants = checkInstance(instance.findInstance('Button-Variants'), 'Button-Variants');

  const disabled = checkStringProperty(buttonVariants.getString('State'), 'State') === 'Disabled';

  // The default fill is "solid".
  const fill = checkEnum(
    buttonVariants.getEnum('Type', {
      Outline: 'outline',
      Ghost: 'ghost',
      Link: 'link'
    }) || 'solid'
  );

  // The default variant is "secondary".
  const variant = checkEnum(
    buttonVariants.getEnum('Variant', {
      Primary: 'primary',
      Positive: 'success',
      Info: 'info',
      Caution: 'warning',
      Negative: 'danger',
      Inverted: 'inverted'
    }) || 'secondary'
  );

  const buttonBase = checkInstance(buttonVariants.findInstance('Button-Base'), 'Button-Base');

  const iconOnly = checkBooleanProperty(buttonBase.getBoolean('Icon only'), 'Icon only'),
    iconStart = checkBooleanProperty(buttonBase.getBoolean('Icon Start'), 'Icon Start'),
    iconEnd = checkBooleanProperty(buttonBase.getBoolean('Icon End'), 'Icon End'),
    label = checkStringProperty(buttonBase.getString('𝐓 - Label'), '𝐓 - Label');

  // The default size is "md".
  const size = checkEnum(
    buttonBase.getEnum('↕️ - Size', {
      SM: 'sm',
      LG: 'lg'
    }) || 'md'
  );

  let icon;
  if (iconStart || iconEnd) {
    icon = buttonBase.findInstance('Base/Icon', { traverseInstances: true });
  }

  return figma.code`
    <sl-button
      ${iconOnly ? `aria-label="${label}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
      ${typeof slot === 'string' ? `slot="${slot}"` : ''}
      ${variant !== 'secondary' ? `variant="${variant}"` : ''}
    >
      ${iconStart ? icon?.executeTemplate().example : ''}
      ${!iconOnly ? label : ''}
      ${iconEnd ? icon?.executeTemplate().example : ''}
    </sl-button>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
