// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=17158-159747
import figma from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const hasDescription = checkBooleanProperty(instance.getBoolean('description'), 'description'),
    description = hasDescription
      ? checkStringProperty(instance.getString('description'), 'description')
      : '',
    displayInfotip = checkBooleanProperty(
      instance.getBoolean('display-infotip'),
      'display-infotip'
    ),
    label = checkStringProperty(instance.getString('label'), 'label'),
    size = checkEnum(instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' }) ?? 'md'),
    switchPosition = checkEnum(
      instance.getEnum('switch-position', { left: 'left', right: 'right' }) ?? 'right'
    );

  const infotip = displayInfotip
    ? instance
        .findConnectedInstances(node => node.codeConnectId() === 'infotip', {
          traverseInstances: true
        })
        .map(child => child.executeTemplate().example)
        .flatMap(results => results.filter(result => result.type === 'CODE'))
        .map(result => result.code)
        .join('\n')
    : '';

  return figma.code`
    <sl-switch
      ${switchPosition === 'left' ? 'reverse' : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      ${label}
      ${description ? `<span slot="description">${description}</span>` : ''}
      ${infotip}
    </sl-switch>
  `;
}

export default {
  example: getExample(),
  id: 'switch'
};
