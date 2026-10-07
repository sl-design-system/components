// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=6013-90927
import figma from 'figma';
import { checkBooleanProperty, checkInstance } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const cardContent = checkInstance(
    instance.findInstance('Card Content', { traverseInstances: true }),
    'Card Content'
  );

  checkBooleanProperty(cardContent.getBoolean('Show more button'), 'Show more button');

  const cardHeader = checkInstance(
    cardContent.findInstance('card-header', { traverseInstances: true }),
    'card-header'
  );

  const cardTitle = checkInstance(cardHeader.findInstance('card-title'), 'card-title');

  const title = checkInstance(cardTitle.findText('Title'), 'Title');

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
