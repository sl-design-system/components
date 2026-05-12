/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const size = instance.getEnum('Size', { SM: 'sm', LG: 'lg' }) || 'md';

  const fill =
    instance.getEnum('Variant', {
      Ghost: 'ghost',
      Link: 'link',
      Outline: 'outline'
    }) || 'solid';

  const buttons = instance
    .findConnectedInstances(node => node.codeConnectId() === 'button')
    .filter(instance => instance.type !== 'ERROR')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return figma.code`
    <sl-button-bar
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      ${buttons}
    </sl-button-bar>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
