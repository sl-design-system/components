// source=packages/components/accordion/src/accordion-item.ts
// component=AccordionItem
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const open = checkBooleanProperty(instance.getBoolean('Open'), 'Open');

  const header = instance.findInstance('Accordion Header/Plus') as InstanceHandle;

  const title = header.findInstance('accordion-summary', {
    traverseInstances: true
  }) as InstanceHandle;

  const summary = checkStringProperty(title.getString('summary'), 'summary');

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
