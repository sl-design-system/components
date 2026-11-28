// source=packages/components/form/src/form-field.ts
// component=FormField
import figma from 'figma';
import { getFormFieldProperties, renderFormField } from './_shared/figma-form-field.js';

export default {
  example: renderFormField(getFormFieldProperties(figma.selectedInstance)),
  id: figma.batch.id
};
