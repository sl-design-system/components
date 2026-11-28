// source=packages/components/infotip/src/infotip.ts
// component=Infotip
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const button = instance.findInstance('sl-button-rectangular', {
      traverseInstances: true
    }),
    { props = {} } = button.executeTemplate().metadata ?? {},
    size = typeof props.size === 'string' ? props.size : 'md';

  return figma.code`
    <sl-infotip
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      Infotip content
    </sl-infotip>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
