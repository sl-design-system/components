// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=6013-90927
import figma, { type InstanceHandle, type TextHandle } from 'figma';
import { checkBooleanProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const cardContent = instance.findInstance('Card Content', {
    traverseInstances: true
  }) as InstanceHandle;

  checkBooleanProperty(cardContent.getBoolean('Show more button'), 'Show more button');

  const cardHeader = cardContent.findInstance('card-header', {
    traverseInstances: true
  }) as InstanceHandle;

  const cardTitle = cardHeader.findInstance('card-title') as InstanceHandle;

  const title = cardTitle.findText('Title') as TextHandle;

  const cardSlotHeader = cardHeader.findInstance('card-slot-header');

  let headerSlot;
  if (cardSlotHeader.type !== 'ERROR') {
    headerSlot = cardSlotHeader
      .findConnectedInstances(() => true, { traverseInstances: true })
      .filter(child => child.type !== 'ERROR')
      .map(child => {
        child.properties.slot = { value: 'header' };

        return child;
      })
      .map(child => child.executeTemplate().example)
      .flatMap(results => results.find(r => r.type === 'CODE'))
      .map(result => result?.code)
      .join('\n');
  }

  return figma.code`
    <sl-card>
      ${title ? `<h1>${title.textContent}</h1>` : ''}
      ${headerSlot}
    </sl-card>
  `;
}

export default {
  example: getExample(),
  id: 'card'
};
