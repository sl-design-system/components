// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7689-21467
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const iconType =
    instance.getEnum('Type', { Chevron: 'chevron', Plus: 'plusminus' }) ?? 'plusminus';

  const items = instance
    .findConnectedInstances(node => node.codeConnectId() === 'accordion-item', {
      traverseInstances: true
    })
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return figma.code`
    <sl-accordion
      ${iconType !== 'plusminus' ? `icon-type="${iconType}"` : ''}
    >
      ${items}
    </sl-accordion>
  `;
}

export default {
  example: getExample(),
  id: 'accordion'
};
