// source=packages/components/radio-group/src/radio-group.ts
// component=RadioGroup
import figma from 'figma';
import { type InstanceHandle, checkStringProperty } from './_shared/figma-assertions.js';
import { getFormFieldProperties, renderFormField } from './_shared/figma-form-field.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('state'), 'state') === 'Disabled';

  const labelBase = instance.findInstance('sl-base-label') as InstanceHandle;

  const formField = getFormFieldProperties(labelBase);

  const options = instance
    .findConnectedInstances(node => node.codeConnectId() === 'radio')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('');

  return renderFormField(
    formField,
    figma.code`
      <sl-radio-group
        ${disabled ? ' disabled' : ''}
        ${formField.required ? ' required' : ''}
      >
        ${options}
      </sl-radio-group>
  `
  );
}

export default {
  example: getExample(),
  id: figma.batch.id
};
