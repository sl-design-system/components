// source=packages/components/button-bar/src/button-bar.ts
// component=ButtonBar
import figma from 'figma';
import { checkEnum } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const size = checkEnum(instance.getEnum('size', { sm: 'sm', lg: 'lg' }) || 'md');

  const fill = checkEnum(
    instance.getEnum('fill', {
      ghost: 'ghost',
      link: 'link',
      outline: 'outline'
    }) || 'solid'
  );

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
