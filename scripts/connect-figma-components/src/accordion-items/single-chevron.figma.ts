// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7660-22269
/// <reference types="@figma/code-connect/figma-types" />
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
  id: 'accordion-item'
};
