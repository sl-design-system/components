// source=packages/components/message-dialog/src/message-dialog.ts
// component=MessageDialog
import figma from 'figma';
import { type TextHandle } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const heading = instance.findText('Heading') as TextHandle,
    content = instance.getInstanceSwap('Slot'),
    message = (() => {
      if (content?.type !== 'INSTANCE') return JSON.stringify('Message content');
      if (content.hasCodeConnect()) return figma.code`html\`${content.executeTemplate().example}\``;

      const text = content
        .findLayers(layer => layer.type === 'TEXT', { traverseInstances: true })
        .filter((layer): layer is TextHandle => layer.type === 'TEXT')
        .map(layer => layer.textContent)
        .join('');

      return JSON.stringify(text || 'Message content');
    })();

  const buttons = instance
    .findConnectedInstances(() => true, { path: ['Dialog', 'Footer'] })
    .filter(button => button.type !== 'ERROR')
    .map(button => {
      const { props = {} } = button.executeTemplate().metadata ?? {},
        text = typeof props.text === 'string' ? props.text : '',
        fill = typeof props.fill === 'string' ? props.fill : 'solid',
        variant = typeof props.variant === 'string' ? props.variant : 'secondary';

      return `{ text: ${JSON.stringify(text)}, fill: ${JSON.stringify(fill)}, variant: ${JSON.stringify(variant)} }`;
    })
    .join(',\n');

  return figma.code`
    await MessageDialog.show({
      title: ${JSON.stringify(heading.textContent)},
      message: ${message},
      buttons: [${buttons}]
    });
  `;
}

export default {
  example: getExample(),
  imports: [
    "import { MessageDialog } from '@sl-design-system/message-dialog';",
    "import '@sl-design-system/message-dialog/register.js';",
    "import { html } from 'lit';"
  ],
  id: figma.batch.id
};
