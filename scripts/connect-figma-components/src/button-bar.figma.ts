// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=8244-315333
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
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return figma.code`
    <sl-button-bar
      ${fill !== 'solid' ? `fill="${fill}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
    >
      ${buttons}
    </sl-button-bar>
  `;
}

export default {
  example: getExample(),
  id: 'button-bar'
};
