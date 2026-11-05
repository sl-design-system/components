// source=packages/components/dialog/src/dialog.ts
// component=Dialog
import figma from 'figma';
import { type TextHandle, checkBooleanProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const content = instance.getSlot('Slot'),
    closeButton = checkBooleanProperty(instance.getBoolean('close-button'), 'close-button');

  const heading = instance.findText('Heading') as TextHandle;

  const footer = instance
    .findConnectedInstances(() => true, { path: ['Dialog', 'Footer'] })
    .filter(instance => instance.type !== 'ERROR')
    .map(instance => {
      instance.properties.slot = { value: 'footer' };

      return instance.executeTemplate().example;
    })
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return figma.code`
    <sl-dialog
      ${closeButton ? 'close-button' : ''}
    >
      ${heading.textContent ? `<h1 slot="title">${heading.textContent}</h1>` : ''}
      ${content}
      ${footer}
    </sl-dialog>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
