// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=6013-90927
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const cardContent = instance.findInstance('Card Content', { traverseInstances: true });
  if (cardContent.type === 'ERROR') return null;

  const showMoreButton = cardContent.getBoolean('Show more button');

  const cardHeader = cardContent.findInstance('card-header', { traverseInstances: true });
  if (cardHeader.type === 'ERROR') return null;

  const cardTitle = cardHeader.findInstance('card-title');
  if (cardTitle.type === 'ERROR') return null;

  const title = cardTitle.findText('Title');
  if (title.type === 'ERROR') return null;

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
