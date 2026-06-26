import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const buttons = instance
    .findConnectedInstances(node => node.codeConnectId() === 'toggle-button')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return figma.code`
    <sl-toggle-group
      ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
    >
      ${buttons}
    </sl-toggle-group>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
