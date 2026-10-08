// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=2924-285265
import figma, { type TextHandle } from 'figma';
import { checkBooleanProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const content = instance.getSlot('Slot'),
    closeButton = checkBooleanProperty(instance.getBoolean('Show Close'), 'Show Close');

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
  id: 'dialog'
};
