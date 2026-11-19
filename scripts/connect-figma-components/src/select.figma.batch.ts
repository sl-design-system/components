// source=packages/components/select/src/select.ts
// component=Select
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty
} from './_shared/figma-assertions.js';
import { getFormFieldProperties, renderFormField } from './_shared/figma-form-field.js';

const instance = figma.selectedInstance;

function getExample() {
  const hasLabel = checkBooleanProperty(instance.getBoolean('display-label'), 'display-label');

  const formField = getFormFieldProperties(
    hasLabel ? (instance.findInstance('sl-base-label') as InstanceHandle) : undefined
  );

  const selectVariants = instance.findInstance('Select variations', {
    traverseInstances: true
  }) as InstanceHandle;

  const clearable = checkBooleanProperty(selectVariants.getBoolean('clearable'), 'clearable'),
    disabled = checkBooleanProperty(selectVariants.getBoolean('disabled'), 'disabled'),
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

  return renderFormField(
    formField,
    figma.code`
  <sl-select
        ${clearable ? ' clearable' : ''}
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${formField.required ? ' required' : ''}
        ${value ? ` value="${value}"` : ''}
      >
        ${options ?? '<!-- Insert options here -->'}
      </sl-select>
  `
  );
}

export default {
  example: getExample(),
  id: figma.batch.id
};
