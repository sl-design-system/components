// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=699-52205
/// <reference types="@figma/code-connect/figma-types" />
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
    <sl-toggle-group>
      ${buttons}
    </sl-toggle-group>
  `;
}

export default {
  example: getExample(),
  id: 'toggle-group'
};
