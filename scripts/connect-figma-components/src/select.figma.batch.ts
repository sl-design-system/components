// source=packages/components/select/src/select.ts
// component=Select
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const hasLabel = checkBooleanProperty(instance.getBoolean('display-label'), 'display-label');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = instance.findInstance('sl-base-label') as InstanceHandle;

    label = checkStringProperty(labelBase.getString('label'), 'label');
    required = checkBooleanProperty(labelBase.getBoolean('required'), 'required');
  }

  const selectVariants = instance.findInstance('Select variations', {
    traverseInstances: true
  }) as InstanceHandle;

  const clearable = checkBooleanProperty(selectVariants.getBoolean('clearable'), 'clearable'),
    disabled = checkStringProperty(selectVariants.getString('state'), 'state') === 'Disabled',
    placeholder = checkStringProperty(selectVariants.getString('placeholder'), 'placeholder'),
    value = checkStringProperty(selectVariants.getString('value'), 'value');

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
  id: figma.batch.id
};
