import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const open = instance.getBoolean('Open');

  const header = instance.findInstance('Accordion Header/Plus');
  if (header.type === 'ERROR') return null;

  const title = header.findInstance('accordion-title', { traverseInstances: true });
  if (title.type === 'ERROR') return null;

  const summary = title.getString('Title');

  return figma.code`
    <sl-accordion-item
      ${open ? 'open' : ''}
      ${summary ? `summary="${summary}"` : ''}
    ></sl-accordion-item>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
