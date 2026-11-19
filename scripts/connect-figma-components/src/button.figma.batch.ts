// source=packages/components/button/src/button.ts
// component=Button
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getButton() {
  const slot = instance.getString('slot');

  const buttonVariants = instance.findInstance('button-variants');
  const variants =
    buttonVariants.type === 'INSTANCE' ? buttonVariants : instance.findInstance('Variant Button');
  if (variants.type !== 'INSTANCE') {
    throw new Error('Missing button variant instance');
  }

  // The default fill is "solid".
  const fill = checkEnum(
    variants.getEnum('fill', {
      outline: 'outline',
      ghost: 'ghost',
      link: 'link'
    }) || 'solid'
  );

  // The default variant is "secondary".
  const variant = checkEnum(
    variants.getEnum('variant', {
      primary: 'primary',
      secondary: 'secondary',
      success: 'success',
      info: 'info',
      warning: 'warning',
      danger: 'danger',
      inverted: 'inverted'
    }) || 'secondary'
  );

  const buttonBase = variants.findInstance('button-base') as InstanceHandle,
    disabled = checkBooleanProperty(variants.getBoolean('disabled'), 'disabled');

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
      sm: 'sm',
      lg: 'lg'
    }) || 'md'
  );

  let icon;
  if (iconStart || iconEnd) {
    const iconInstance = buttonBase.findInstance('SL-icon Size', { traverseInstances: true });

    icon = iconInstance.executeTemplate().example;
  }

  return {
    example: figma.code`
      <sl-button
        ${iconOnly ? `aria-label="${text}"` : ''}
        ${fill !== 'solid' ? `fill="${fill}"` : ''}
        ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
        ${size !== 'md' ? `size="${size}"` : ''}
        ${typeof slot === 'string' ? `slot="${slot}"` : ''}
        ${variant !== 'secondary' ? `variant="${variant}"` : ''}
        ${disabled ? `disabled` : ''}
      >
        ${iconStart ? icon : ''}
        ${!iconOnly ? text : ''}
        ${iconEnd ? icon : ''}
      </sl-button>
    `,
    metadata: {
      props: { text, fill, variant, disabled, iconOnly, iconStart, iconEnd, size }
    }
  };
}

const button = getButton();

export default {
  ...button,
  id: figma.batch.id
};
