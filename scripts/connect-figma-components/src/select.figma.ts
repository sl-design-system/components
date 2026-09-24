// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1514-156507
import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const hasLabel = checkBooleanProperty(instance.getBoolean('Label'), 'Label');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = checkInstance(instance.findInstance('sl-base-label'), 'sl-base-label');

    label = checkStringProperty(labelBase.getString('Label'), 'Label');
    required = checkBooleanProperty(labelBase.getBoolean('Required'), 'Required');
  }

  const selectVariants = checkInstance(
    instance.findInstance('Select variations', { traverseInstances: true }),
    'Select variations'
  );

  const clearable = checkBooleanProperty(selectVariants.getBoolean('Clear button'), 'Clear button'),
    disabled = checkStringProperty(selectVariants.getString('Variant'), 'Variant') === 'Disabled',
    placeholder = selectVariants.getString('Placeholder text'),
    value = selectVariants.getString('Input value');

  const menuPanel = instance.findInstance('sl-menu-panel', { traverseInstances: true });

  let options: string | undefined;
  if (menuPanel.type !== 'ERROR') {
    options = menuPanel
      .findConnectedInstances(node => node.codeConnectId() === 'menu-item')
      .map(() => '<sl-option>label</sl-option>')
      .join('\n');
  }

  return figma.code`
    <sl-form-field${label ? ` label="${label}"` : ''}>
      <sl-select
        ${clearable ? ' clearable' : ''}
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      >
        ${options ?? '<!-- Insert options here -->'}
      </sl-select>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'select'
};
