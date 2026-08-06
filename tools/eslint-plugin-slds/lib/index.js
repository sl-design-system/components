import { buttonHasLabel } from './rules/button-has-label.js';
import { checkboxGroupHasLabel } from './rules/checkbox-group-has-label.js';
import { checkboxHasLabel } from './rules/checkbox-has-label.js';
import { comboboxHasLabel } from './rules/combobox-has-label.js';
import { dateFieldHasLabel } from './rules/date-field-has-label.js';
import { multilineHtmlTemplate } from './rules/multiline-html-template.js';
import { numberFieldHasLabel } from './rules/number-field-has-label.js';
import { radioHasLabel } from './rules/radio-has-label.js';
import { radioGroupHasLabel } from './rules/radio-group-has-label.js';
import { selectHasLabel } from './rules/select-has-label.js';
import { singlelineHtmlTemplateTrimmed } from './rules/singleline-html-template-trimmed.js';
import { switchHasLabel } from './rules/switch-has-label.js';
import { textAreaHasLabel } from './rules/text-area-has-label.js';
import { textFieldHasLabel } from './rules/text-field-has-label.js';
import { timeFieldHasLabel } from './rules/time-field-has-label.js';

const rules = {
  'button-has-label': buttonHasLabel,
  'checkbox-group-has-label': checkboxGroupHasLabel,
  'checkbox-has-label': checkboxHasLabel,
  'combobox-has-label': comboboxHasLabel,
  'date-field-has-label': dateFieldHasLabel,
  'multiline-html-template': multilineHtmlTemplate,
  'number-field-has-label': numberFieldHasLabel,
  'radio-has-label': radioHasLabel,
  'radio-group-has-label': radioGroupHasLabel,
  'select-has-label': selectHasLabel,
  'singleline-html-template-trimmed': singlelineHtmlTemplateTrimmed,
  'switch-has-label': switchHasLabel,
  'text-area-has-label': textAreaHasLabel,
  'text-field-has-label': textFieldHasLabel,
  'time-field-has-label': timeFieldHasLabel
};

export default {
  rules,
  configs: {
    recommended: {
      plugins: {
        slds: {
          rules
        }
      },
      rules: {
        'slds/button-has-label': 'error',
        'slds/checkbox-group-has-label': 'error',
        'slds/checkbox-has-label': 'error',
        'slds/combobox-has-label': 'error',
        'slds/date-field-has-label': 'error',
        'slds/multiline-html-template': 'error',
        'slds/number-field-has-label': 'error',
        'slds/radio-has-label': 'error',
        'slds/radio-group-has-label': 'error',
        'slds/select-has-label': 'error',
        'slds/singleline-html-template-trimmed': 'error',
        'slds/switch-has-label': 'error',
        'slds/text-area-has-label': 'error',
        'slds/text-field-has-label': 'error',
        'slds/time-field-has-label': 'error'
      }
    }
  }
};
