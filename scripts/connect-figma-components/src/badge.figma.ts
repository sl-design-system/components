// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1870-150559
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const color = instance.getString('accent') ?? 'grey',
    emphasis = instance.getString('emphasis') ?? 'subtle',
    size = instance.getString('size') ?? 'md',
    slot = instance.getString('slot');

  const badgeBase = instance.findInstance(`badge-base-${size}`);
  if (badgeBase.type === 'ERROR') return null;

  const icon = badgeBase.findInstance('Base/Icon', { traverseInstances: true }),
    label = badgeBase.getString('Text');

  return figma.code`
    <sl-badge
      ${color !== 'grey' ? ` color="${color}"` : ''}
      ${emphasis !== 'subtle' ? ` emphasis="${emphasis}"` : ''}
      ${size !== 'md' ? ` size="${size}"` : ''}
      ${slot ? ` slot="${slot}"` : ''}
    >
      ${icon?.type !== 'ERROR' ? icon?.executeTemplate().example : ''}
      ${label}
    </sl-badge>
  `;
}

export default {
  example: getExample(),
  id: 'badge',
  imports: []
};
