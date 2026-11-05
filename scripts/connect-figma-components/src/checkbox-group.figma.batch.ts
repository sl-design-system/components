// source=packages/components/checkbox/src/checkbox-group.ts
// component=CheckboxGroup
import figma from 'figma';
import { type InstanceHandle, checkStringProperty } from './_shared/figma-assertions.js';
import { getFormFieldProperties, renderFormField } from './_shared/figma-form-field.js';

const instance = figma.selectedInstance;

function getExample() {
  const disabled = checkStringProperty(instance.getString('state'), 'state') === 'Disabled';

  const labelBase = instance.findInstance('sl-base-label') as InstanceHandle;

  const formField = getFormFieldProperties(labelBase);

  const checkboxes = instance
    .findConnectedInstances(node => node.codeConnectId() === 'checkbox')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return renderFormField(
    formField,
    figma.code`
      <sl-checkbox-group
        ${disabled ? ' disabled' : ''}
        ${formField.required ? ' required' : ''}
      >
        ${checkboxes}
      </sl-checkbox-group>
  `
  );
}

export default {
  example: getExample(),
  id: figma.batch.id
};
