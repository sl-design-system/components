// source=packages/components/segmented-control/src/segmented-control.ts
// component=SegmentedControl
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance,
  content = checkEnum(
    instance.getEnum('content', {
      'icon + text': 'icon + text',
      'text only': 'text only',
      'icon only': 'icon only'
    }),
    'content'
  ),
  emphasis = checkEnum(
    instance.getEnum('emphasis', { subtle: 'subtle', bold: 'bold' }) ?? 'subtle',
    'emphasis'
  ),
  fill = checkEnum(
    instance.getEnum('fill', { solid: 'solid', outline: 'outline' }) ?? 'solid',
    'fill'
  ),
  shape = checkEnum(instance.getEnum('shape', { rect: 'rect', pill: 'pill' }) ?? 'rect', 'shape'),
  size = checkEnum(instance.getEnum('size', { md: 'md', lg: 'lg' }) ?? 'md', 'size');

function getItem(button: InstanceHandle) {
  const buttonBase = button.findInstance('_segmented-control-button-base', {
      traverseInstances: true
    }) as InstanceHandle,
    label = checkStringProperty(buttonBase.getString('label'), 'label'),
    hasIcon = checkBooleanProperty(buttonBase.getBoolean('show icon'), 'show icon'),
    selected =
      checkEnum(button.getEnum('selected', { true: 'true', false: 'false' }), 'selected') ===
      'true',
    disabled =
      checkEnum(
        button.getEnum('state', {
          idle: 'idle',
          hover: 'hover',
          active: 'active',
          disabled: 'disabled'
        }),
        'state'
      ) === 'disabled';

  let icon;
  if (hasIcon) {
    const iconInstance = buttonBase.findInstance('sl-icon', { traverseInstances: true });
    if (iconInstance.type !== 'INSTANCE')
      throw new Error('Missing Figma icon instance in segmented control');

    const slot = selected ? 'selected-icon' : 'icon';
    icon = iconInstance
      .executeTemplate()
      .example.map(result =>
        result.type === 'CODE'
          ? { ...result, code: result.code.replace('<sl-icon ', `<sl-icon slot="${slot}" `) }
          : result
      );
  }

  return {
    example: figma.code`
      <sl-segmented-control-item
        value="${label}"
        ${disabled ? 'aria-disabled="true"' : ''}
      >
        ${icon}
        ${label}
      </sl-segmented-control-item>
    `,
    selected,
    value: label
  };
}

function getExample() {
  const buttonInstances = instance
      .findLayers(node => node.type === 'INSTANCE' && node.name === '_segmented-control-button')
      .filter((node): node is InstanceHandle => node.type === 'INSTANCE'),
    visibleButtons = [
      true,
      true,
      checkBooleanProperty(instance.getBoolean('control 3'), 'control 3'),
      checkBooleanProperty(instance.getBoolean('control 4'), 'control 4'),
      checkBooleanProperty(instance.getBoolean('control 5'), 'control 5')
    ],
    items = buttonInstances.filter((_, index) => visibleButtons[index]).map(getItem),
    selectedValue = items.find(item => item.selected)?.value;

  return figma.code`
    <sl-segmented-control
      ${content === 'icon only' ? 'icon-only' : ''}
      ${emphasis !== 'subtle' ? `emphasis="${emphasis}"` : ''}
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${selectedValue ? `value="${selectedValue}"` : ''}
      ${shape !== 'rect' ? `shape="${shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      ${items.map(item => item.example)}
    </sl-segmented-control>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
