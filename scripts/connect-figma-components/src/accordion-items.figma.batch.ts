import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const open = checkBooleanProperty(instance.getBoolean('Open'), 'Open');

  const header = checkInstance(
    instance.findInstance('Accordion Header/Plus'),
    'Accordion Header/Plus'
  );

  const title = checkInstance(
    header.findInstance('accordion-title', { traverseInstances: true }),
    'accordion-title'
  );

  const summary = checkStringProperty(title.getString('Title'), 'Title');

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
