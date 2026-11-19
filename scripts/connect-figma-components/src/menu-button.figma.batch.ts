// source=packages/components/menu/src/menu-button.ts
// component=MenuButton
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';
import { getMenuItems } from './_shared/figma-menu.js';

const instance = figma.selectedInstance;

function getExample() {
  const type = instance.getEnum('type', {
    text: 'text',
    'ellipsis horizontal': 'ellipsis horizontal',
    'ellipsis vertical': 'ellipsis vertical'
  });

  const button = instance.findInstance(
    type === 'text' ? 'sl-menu-button-text' : 'sl-menu-button-elipsis',
    { traverseInstances: true }
  ) as InstanceHandle;

  const buttonVariants = button.findInstance('button-variants', {
      traverseInstances: true
    }) as InstanceHandle,
    buttonBase = button.findInstance('button-base', {
      traverseInstances: true
    }) as InstanceHandle;

  const fill = checkEnum(buttonVariants.getEnum('fill', { outline: 'outline' }) ?? 'outline'),
    variant = checkEnum(
      buttonVariants.getEnum('variant', {
        primary: 'primary',
        secondary: 'secondary'
      }) ?? 'secondary'
    ),
    disabled = checkEnum(buttonVariants.getEnum('disabled', { off: 'off' }) ?? 'off') !== 'off',
    iconOnly =
      checkEnum(buttonBase.getEnum('icon-only', { false: 'false', true: 'true' }) ?? 'false') ===
      'true',
    text = checkStringProperty(buttonBase.getString('text'), 'text'),
    size = checkEnum(buttonBase.getEnum('size', { md: 'md' }) ?? 'md'),
    position = checkEnum(
      button.getEnum('menu-position', {
        'bottom + right': 'bottom-end',
        'bottom + left': 'bottom-start',
        'top + right': 'top-end',
        'top + left': 'top-start'
      }) ?? 'bottom-end'
    );

  let iconName;
  if (iconOnly) {
    // const iconInstance = buttonBase.findInstance('SL-icon Size', {
    //   traverseInstances: true,
    //   path: ['start icon']
    // });
    // if (iconInstance.type !== 'INSTANCE') throw new Error('Missing Figma icon instance');

    const baseIcon = buttonBase.findInstance('Base/Icon', { traverseInstances: true });
    if (baseIcon.type !== 'INSTANCE') throw new Error('Missing Figma Base/Icon instance');

    const name = checkStringProperty(baseIcon.getString('icon-name'), 'icon-name'),
      iconVariant = checkEnum(
        baseIcon.getEnum('variant', {
          outline: 'far',
          solid: 'fas',
          'duotone - outline': 'fadr',
          'duotone - solid': 'fad',
          'custom SVG': 'custom SVG'
        }) ?? 'far'
      );

    iconName = iconVariant === 'custom SVG' ? name : `${iconVariant}-${name}`;
  }

  const menuPanel = instance.findInstance('sl-menu-panel', { traverseInstances: true });
  const items =
    menuPanel.type === 'INSTANCE'
      ? getMenuItems(menuPanel)
          .map(
            item => `
              <sl-menu-item ${item.selected ? 'selected' : ''}>
                ${item.label}
              </sl-menu-item>`
          )
          .join('\n')
      : '';

  return figma.code`
    <sl-menu-button
      ${iconOnly ? `aria-label="${text}"` : ''}
      ${fill !== 'outline' ? `fill="${fill}"` : ''}
      position="${position}"
      ${size !== 'md' ? `size="${size}"` : ''}
      ${variant !== 'secondary' ? `variant="${variant}"` : ''}
      ${disabled ? 'disabled' : ''}
    >
      ${!iconOnly ? figma.code`<span slot="button">${text}</span>` : figma.code`<sl-icon slot="button" name="${iconName}" size="${size}"></sl-icon>`}
      ${items}
    </sl-menu-button>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
