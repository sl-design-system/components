// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=961-67272
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = instance.getString('State') === 'Disabled';

  const labelBase = instance.findInstance('sl-base-label');
  if (labelBase.type === 'ERROR') return null;

  const hint = labelBase.getString('Hint'),
    label = labelBase.getString('Label'),
    required = labelBase.getBoolean('Required'),
    showHint = labelBase.getBoolean('Show Hint');

  const options = instance
    .findConnectedInstances(node => node.codeConnectId() === 'radio')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('');

  return figma.code`
    <sl-form-field
      ${showHint && hint ? ` hint="${hint}"` : ''}
      ${label ? ` label="${label}"` : ''}
    >
      <sl-radio-group
        ${disabled ? ' disabled' : ''}
        ${required ? ' required' : ''}
      >
        ${options}
      </sl-radio-group>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'radio-group'
};
