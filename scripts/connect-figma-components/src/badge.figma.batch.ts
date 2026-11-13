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

  const badgeBase = instance.findInstance(`badge-base-${size}`) as InstanceHandle,
    badgeBaseVariant = badgeBase.getEnum('Variant', {
      'text only (2 or more char.)': 'textOnly',
      'round (icon or single char.)': 'round',
      'text & icon': 'textAndIcon'
    });

  let icon, badgeRoundContent, label;
  if (badgeBaseVariant === 'round') {
    const badgeRound = badgeBase.findInstance(`_badge-round-content-${size}`) as InstanceHandle;
    badgeRoundContent = badgeRound.getEnum('content', {
      icon: 'icon',
      'single char. label': 'text'
    });
    label = checkStringProperty(badgeRound.getString('Text'), 'Text');
  } else {
    label = checkStringProperty(badgeBase.getString('Text'), 'Text');
  }

  if (badgeBaseVariant !== 'textOnly' && badgeRoundContent !== 'text' && size !== 'sm') {
    const iconInstance = badgeBase.findInstance('sl-icon', { traverseInstances: true });
    icon = iconInstance ? iconInstance.executeTemplate().example : undefined;
  }

  return figma.code`
    <sl-badge
      ${color !== 'grey' ? ` color="${color}"` : ''}
      ${emphasis !== 'subtle' ? ` emphasis="${emphasis}"` : ''}
      ${size !== 'md' ? ` size="${size}"` : ''}
      ${typeof slot === 'string' ? ` slot="${slot}"` : ''}
    >
      ${icon ? icon : ''}
      ${badgeRoundContent !== 'icon' && size !== 'sm' ? label : ''}
    </sl-badge>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
