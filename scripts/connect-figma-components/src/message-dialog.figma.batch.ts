// source=packages/components/message-dialog/src/message-dialog.ts
// component=MessageDialog
import figma from 'figma';
import {
  type InstanceHandle,
  type TextHandle,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const heading = instance.findText('Heading') as TextHandle,
    content = instance.getInstanceSwap('Slot'),
    message =
      content?.type === 'INSTANCE' && content.hasCodeConnect()
        ? figma.code`html\`${content.executeTemplate().example}\``
        : JSON.stringify('Message content');

  const buttons = instance
    .findConnectedInstances(() => true, { path: ['Dialog', 'Footer'] })
    .filter(button => button.type !== 'ERROR')
    .map(button => {
      const base = button.findInstance('button-base', {
          traverseInstances: true
        }) as InstanceHandle,
        variants = button.findInstance('button-variants', {
          traverseInstances: true
        }) as InstanceHandle;
      const text = checkStringProperty(base.getString('text'), 'text'),
        fill = checkEnum(
          variants.getEnum('fill', {
            solid: 'solid',
            outline: 'outline',
            ghost: 'ghost',
            link: 'link'
          }),
          'fill'
        ),
        variant = checkEnum(
          variants.getEnum('variant', {
            primary: 'primary',
            secondary: 'secondary',
            success: 'success',
            info: 'info',
            warning: 'warning',
            danger: 'danger',
            inverted: 'inverted'
          }),
          'variant'
        );

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
