// source=packages/components/number-field/src/number-field.ts
// component=NumberField
import figma from 'figma';
import {
  type InstanceHandle,
  checkBooleanProperty,
  checkStringProperty,
  checkEnum
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('state'), 'state') === 'disabled';

  const hasLabel = checkBooleanProperty(instance.getBoolean('display-label'), 'display-label'),
    placeholder = checkStringProperty(instance.getString('placeholder'), 'placeholder'),
    stepButtons = checkEnum(
      instance.getEnum('step-buttons', { edges: 'edges', end: 'end', none: '' }) ?? 'end'
    ),
    value = checkStringProperty(instance.getString('value'), 'value');

  let label = undefined,
    required = false;
  if (hasLabel) {
    const labelBase = instance.findInstance('sl-base-label') as InstanceHandle;

    label = checkStringProperty(labelBase.getString('label'), 'label');
    required =
      checkEnum(labelBase.getEnum('required', { true: 'true', false: 'false' }) ?? 'false') ===
      'true';
  }

  return figma.code`
    <sl-form-field ${label ? `label="${label}"` : ''}>
      <sl-number-field
        ${disabled ? ' disabled' : ''}
        ${placeholder ? ` placeholder="${placeholder}"` : ''}
        ${required ? ' required' : ''}
        ${stepButtons ? ` step-buttons="${stepButtons}"` : ''}
        ${value ? ` value="${value}"` : ''}
      ></sl-number-field>
    </sl-form-field>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
