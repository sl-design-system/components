// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=2702-35398
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const selected = instance.getString('State') === 'selected';

  const tabBase = instance.findInstance('tab-base', { traverseInstances: true });
  if (tabBase.type === 'ERROR') return null;

  const title = tabBase.getString('𝑻 - Title');

  return figma.code`
    <sl-tab ${selected ? 'selected' : ''}>${title}</sl-tab>
  `;
}

export default {
  example: getExample(),
  id: 'tab'
};
