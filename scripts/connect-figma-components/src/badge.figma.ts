// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1870-150559
import figma from 'figma';
import { checkInstance, checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const color = instance.getString('accent') ?? 'grey',
    emphasis = instance.getString('emphasis') ?? 'subtle',
    size = instance.getString('size') ?? 'md',
    slot = instance.getString('slot');

  const badgeBase = checkInstance(
    instance.findInstance(`badge-base-${size}`),
    `badge-base-${size}`
  );

  const icon = badgeBase.findInstance('Base/Icon', { traverseInstances: true }),
    label = checkStringProperty(badgeBase.getString('Text'), 'Text');

  return figma.code`
    <sl-badge
      ${color !== 'grey' ? ` color="${color}"` : ''}
      ${emphasis !== 'subtle' ? ` emphasis="${emphasis}"` : ''}
      ${size !== 'md' ? ` size="${size}"` : ''}
      ${typeof slot === 'string' ? ` slot="${slot}"` : ''}
    >
      ${icon?.type !== 'ERROR' ? icon?.executeTemplate().example : ''}
      ${label}
    </sl-badge>
  `;
}

export default {
  example: getExample(),
  id: 'badge'
};
