// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=6745-531516
import figma from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';
import { getMenuItems } from './_shared/figma-menu.js';

const instance = figma.selectedInstance;

const id = figma.batch.id as string;

function getExample() {
  const baseCombobox = checkInstance(
    instance.findInstance('sl-base-combobox', { traverseInstances: true }),
    'sl-base-combobox'
  );

  const hasTags = checkBooleanProperty(baseCombobox.getBoolean('Tags'), 'Tags'),
    inputText = checkStringProperty(baseCombobox.getString('Input Text'), 'Input Text'),
    hasPlaceholder = checkBooleanProperty(baseCombobox.getBoolean('Placeholder'), 'Placeholder'),
    placeholder = checkStringProperty(
      baseCombobox.getString('Placeholder Text'),
      'Placeholder Text'
    );

  const size = checkEnum(
    baseCombobox.getEnum('↕️ - Size', {
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
      ${hasTags ? 'multiple' : ''}
      ${hasPlaceholder && placeholder ? `placeholder="${placeholder}"` : ''}
      ${figma.batch.shape ? `shape="${figma.batch.shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
      ${inputText ? `value="${inputText}"` : ''}
    >
      ${options || '<!-- Insert options here -->'}
    </sl-combobox>
  `;
}

export default {
  example: getExample(),
  id
};
