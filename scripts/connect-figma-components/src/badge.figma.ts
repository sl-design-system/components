// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1870-150559
// source=packages/components/badge/src/badge.ts
// component=Badge
import figma from 'figma';
import { type InstanceHandle, checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const color = checkStringProperty(instance.getString('color'), 'color') ?? 'grey',
    emphasis = checkStringProperty(instance.getString('emphasis'), 'emphasis') ?? 'subtle',
    size = checkStringProperty(instance.getString('size'), 'size') ?? 'md',
    slot = instance.getString('slot');

  const badgeBase = instance.findInstance(`badge-base-${size}`) as InstanceHandle;

  const iconInstance = badgeBase.findInstance('sl-icon', { traverseInstances: true }),
    icon = iconInstance.executeTemplate().example;

  const label = checkStringProperty(badgeBase.getString('Text'), 'Text');

  return figma.code`
    <sl-badge
      ${color !== 'grey' ? ` color="${color}"` : ''}
      ${emphasis !== 'subtle' ? ` emphasis="${emphasis}"` : ''}
      ${size !== 'md' ? ` size="${size}"` : ''}
      ${typeof slot === 'string' ? ` slot="${slot}"` : ''}
    >
      ${icon ?? ''}
      ${label}
    </sl-badge>
  `;
}

export default {
  example: getExample(),
  id: 'Badge'
};
