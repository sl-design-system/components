// source=packages/components/accordion/src/accordion.ts
// component=Accordion
import figma from 'figma';
import { checkEnum } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const iconType = checkEnum(
    instance.getEnum('icon-type', { Chevron: 'chevron', Plus: 'plusminus' }) ?? 'plusminus'
  );

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
  id: figma.batch.id
};
