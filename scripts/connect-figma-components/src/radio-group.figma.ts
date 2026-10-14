// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=961-67272
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('state'), 'state') === 'Disabled';

  const labelBase = instance.findInstance('sl-base-label') as InstanceHandle;

  const hint = labelBase.getString('Hint'),
    label = checkStringProperty(labelBase.getString('label'), 'label'),
    required = checkBooleanProperty(labelBase.getBoolean('required'), 'required'),
    displayHint = checkBooleanProperty(labelBase.getBoolean('display-hint'), 'display-hint');

  const options = instance
    .findConnectedInstances(node => node.codeConnectId() === 'radio')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('');

  return figma.code`
    <sl-form-field
      ${displayHint && hint ? ` hint="${hint}"` : ''}
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
