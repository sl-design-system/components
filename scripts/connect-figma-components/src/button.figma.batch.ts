import figma, { type InstanceHandle } from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const slot = instance.getString('slot');

  const buttonVariants = instance.findInstance('button-variants') as InstanceHandle;

  // The default fill is "solid".
  const fill = checkEnum(
    buttonVariants.getEnum('fill', {
      outline: 'outline',
      ghost: 'ghost',
      link: 'link'
    }) || 'solid'
  );

  // The default variant is "secondary".
  const variant = checkEnum(
    buttonVariants.getEnum('variant', {
      primary: 'primary',
      secondary: 'secondary',
      success: 'success',
      info: 'info',
      warning: 'warning',
      danger: 'danger',
      inverted: 'inverted'
    }) || 'secondary'
  );

  const buttonBase = buttonVariants.findInstance('button-base') as InstanceHandle;

  const iconOnly = checkBooleanProperty(buttonBase.getBoolean('icon-only'), 'icon-only'),
    iconStart = checkBooleanProperty(
      buttonBase.getBoolean('display-icon-start'),
      'display-icon-start'
    ),
    iconEnd = checkBooleanProperty(buttonBase.getBoolean('display-icon-end'), 'display-icon-end'),
    text = checkStringProperty(buttonBase.getString('text'), 'text');

  // The default size is "md".
  const size = checkEnum(
    buttonBase.getEnum('size', {
      SM: 'sm',
      LG: 'lg'
    }) || 'md'
  );

  let icon;
  if (iconStart || iconEnd) {
    const iconInstance = buttonBase.findInstance('SL-icon Size', { traverseInstances: true });

    icon = iconInstance.executeTemplate().example;
  }

  return figma.code`
    <sl-button
      ${iconOnly ? `aria-label="${text}"` : ''}
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
      ${typeof slot === 'string' ? `slot="${slot}"` : ''}
      ${variant !== 'secondary' ? `variant="${variant}"` : ''}
    >
      ${iconStart ? icon : ''}
      ${!iconOnly ? text : ''}
      ${iconEnd ? icon : ''}
    </sl-button>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
