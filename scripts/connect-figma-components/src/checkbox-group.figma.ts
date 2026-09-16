// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=961-66298
import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('State'), 'State') === 'Disabled';

  const labelBase = checkInstance(instance.findInstance('sl-base-label'), 'sl-base-label');

  const hint = labelBase.getString('Hint'),
    label = checkStringProperty(labelBase.getString('Label'), 'Label'),
    required = checkBooleanProperty(labelBase.getBoolean('Required'), 'Required'),
    showHint = checkBooleanProperty(labelBase.getBoolean('Show Hint'), 'Show Hint');

  const checkboxes = instance
    .findConnectedInstances(node => node.codeConnectId() === 'checkbox')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return figma.code`
    <sl-form-field
      ${showHint && hint ? ` hint="${hint}"` : ''}
      ${label ? ` label="${label}"` : ''}
    >
      <sl-checkbox-group
        ${disabled ? ' disabled' : ''}
        ${required ? ' required' : ''}
      >
        ${checkboxes}
      </sl-checkbox-group>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: 'checkbox-group'
};
