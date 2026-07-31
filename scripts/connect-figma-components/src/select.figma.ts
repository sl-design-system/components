// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=1514-156507
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const hasLabel = instance.getBoolean('Label');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = instance.findInstance('sl-base-label');
    if (labelBase.type === 'ERROR') return null;

    label = labelBase.getString('Label');
    required = labelBase.getBoolean('Required');
  }

  const selectVariants = instance.findInstance('Select variations', { traverseInstances: true });
  if (selectVariants.type === 'ERROR') return null;

  const clearable = selectVariants.getBoolean('Clear button'),
    disabled = selectVariants.getString('Variant') === 'Disabled',
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
