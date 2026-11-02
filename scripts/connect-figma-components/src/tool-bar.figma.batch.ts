// source=packages/components/tool-bar/src/tool-bar.ts
// component=ToolBar
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';
import { getMenuItems } from './_shared/figma-menu.js';

const instance = figma.selectedInstance,
  fill = checkEnum(instance.getEnum('fill', { ghost: 'ghost', outline: 'outline' }) || 'outline'),
  inverted =
    checkEnum(instance.getEnum('inverted', { true: 'true', false: 'false' }) || 'false') === 'true',
  contained =
    checkEnum(instance.getEnum('contained', { true: 'true', false: 'false' }) || 'false') ===
    'true';

function getIconName(iconContainer: InstanceHandle): string {
  const icon = iconContainer.findInstance('Base/Icon', { traverseInstances: true });
  if (icon.type !== 'INSTANCE') throw new Error('Missing Figma Base/Icon instance');

  const name = checkStringProperty(icon.getString('icon-name'), 'icon-name'),
    variant = checkEnum(
      icon.getEnum('variant', {
        outline: 'far',
        solid: 'fas',
        'duotone - outline': 'fadr',
        'duotone - solid': 'fad',
        'custom SVG': 'custom SVG'
      }) || 'far'
    );

  return variant === 'custom SVG' ? name : `${variant}-${name}`;
}

function getButtonExample(item: InstanceHandle): string {
  const buttonVariants = item.findInstance('button-variants', {
      traverseInstances: true
    }) as InstanceHandle,
    buttonBase = buttonVariants.findInstance('button-base', {
      traverseInstances: true
    }) as InstanceHandle,
    disabled =
      checkEnum(buttonVariants.getEnum('disabled', { off: 'off', on: 'on' }) || 'off') !== 'off',
    iconOnly = checkBooleanProperty(buttonBase.getBoolean('icon-only'), 'icon-only'),
    iconStart = checkBooleanProperty(
      buttonBase.getBoolean('display-icon-start'),
      'display-icon-start'
    ),
    iconEnd = checkBooleanProperty(buttonBase.getBoolean('display-icon-end'), 'display-icon-end'),
    text = checkStringProperty(buttonBase.getString('text'), 'text'),
    size = checkEnum(buttonBase.getEnum('size', { sm: 'sm', lg: 'lg' }) || 'md');

  let icon;
  if (iconStart || iconEnd) {
    const iconContainer = buttonBase.findInstance('SL-icon Size', { traverseInstances: true });
    if (iconContainer.type !== 'INSTANCE') throw new Error('Missing Figma icon instance');

    icon = `<sl-icon name="${getIconName(iconContainer)}" size="${size}"></sl-icon>`;
  }

  return `
    <sl-button
      ${iconOnly ? `aria-label="${text}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
      ${disabled ? 'disabled' : ''}
    >
      ${iconStart ? icon : ''}
      ${!iconOnly ? text : ''}
      ${iconEnd ? icon : ''}
    </sl-button>
  `;
}

function getOverflowMenuExample(): string {
  const menu = instance.findInstance('Overflow Menu', { traverseInstances: true });
  if (menu.type !== 'INSTANCE') return '';

  const type = checkEnum(
      menu.getEnum('type', {
        text: 'text',
        'ellipsis horizontal': 'ellipsis horizontal',
        'ellipsis vertical': 'ellipsis vertical'
      }) || 'ellipsis horizontal'
    ),
    button = menu.findInstance(type === 'text' ? 'sl-menu-button-text' : 'sl-menu-button-elipsis', {
      traverseInstances: true
    }) as InstanceHandle,
    buttonBase = button.findInstance('button-base', { traverseInstances: true }) as InstanceHandle,
    iconOnly =
      checkEnum(buttonBase.getEnum('icon-only', { false: 'false', true: 'true' }) || 'false') ===
      'true',
    text = checkStringProperty(buttonBase.getString('text'), 'text'),
    size = checkEnum(buttonBase.getEnum('size', { md: 'md' }) || 'md'),
    position = checkEnum(
      button.getEnum('menu-position', {
        'bottom + right': 'bottom-end',
        'bottom + left': 'bottom-start',
        'top + right': 'top-end',
        'top + left': 'top-start'
      }) || 'bottom-end'
    );

  let iconName;
  if (iconOnly) {
    iconName = getIconName(buttonBase);
  }

  const menuPanel = menu.findInstance('sl-menu-panel', { traverseInstances: true }),
    items =
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

  return `
		<sl-menu-button
			${iconOnly ? `aria-label="${text}"` : ''}
			position="${position}"
			${size !== 'md' ? `size="${size}"` : ''}
		>
      ${!iconOnly ? `<span slot="button">${text}</span>` : `<sl-icon slot="button" name="${iconName}" size="${size}"></sl-icon>`}
			${items}
		</sl-menu-button>
	`;
}

function getExample() {
  const buttons = instance
      .findLayers(layer => layer.type === 'INSTANCE' && /^Item [1-5]$/.test(layer.name), {
        traverseInstances: true
      })
      .filter((item): item is InstanceHandle => item.type === 'INSTANCE')
      .sort((first, second) => Number(first.name.slice(5)) - Number(second.name.slice(5)))
      .map(getButtonExample)
      .join('\n'),
    overflowMenu = getOverflowMenuExample();

  return figma.code`
		<sl-tool-bar
			fill="${fill}"
			${inverted ? 'inverted' : ''}
			${contained ? 'contained' : ''}
		>
			${buttons}
			${overflowMenu}
		</sl-tool-bar>
	`;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
