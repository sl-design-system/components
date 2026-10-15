// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=6745-531516
// source=packages/components/combobox/src/combobox.ts
// component=Combobox
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';
import { getMenuItems } from './_shared/figma-menu.js';

const instance = figma.selectedInstance;

const id = figma.batch.id as string;

function getExample() {
  const baseCombobox = instance.findInstance('sl-base-combobox', {
    traverseInstances: true
  }) as InstanceHandle;

  const multiple = checkBooleanProperty(baseCombobox.getBoolean('multiple'), 'multiple'),
    value = checkStringProperty(baseCombobox.getString('value'), 'value'),
    hasPlaceholder = checkBooleanProperty(
      baseCombobox.getBoolean('display-placeholder'),
      'display-placeholder'
    ),
    placeholder = checkStringProperty(baseCombobox.getString('placeholder'), 'placeholder');

  const size = checkEnum(
    baseCombobox.getEnum('size', {
      MD: 'md',
      LG: 'lg'
    }) ?? 'md'
  );

  const menuPanel = instance.findInstance('sl-menu-panel', { traverseInstances: true });

  let options: string | undefined;
  if (menuPanel.type !== 'ERROR') {
    options = getMenuItems(menuPanel)
      .map(item => `<sl-option value="${item.label}">${item.label}</sl-option>`)
      .join('\n');
  }

  return figma.code`
    <sl-combobox
      aria-label="Choose an option"
      ${multiple ? 'multiple' : ''}
      ${hasPlaceholder && placeholder ? `placeholder="${placeholder}"` : ''}
      ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
      ${value ? `value="${value}"` : ''}
    >
      ${options || '<!-- Insert options here -->'}
    </sl-combobox>
  `;
}

export default {
  example: getExample(),
  id
};
