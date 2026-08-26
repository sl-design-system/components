import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const alignTabs = instance.getEnum('Alignement', { Filled: 'stretch', Left: 'start' }) ?? 'start';

  const tabs = instance
    .findConnectedInstances(node => node.codeConnectId() === 'tab')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return figma.code`
    <sl-tab-group
      ${alignTabs !== 'start' ? `align-tabs="${alignTabs}"` : ''}
      ${figma.batch.vertical ? 'vertical' : ''}
    >
      ${tabs}
    </sl-tab-group>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
