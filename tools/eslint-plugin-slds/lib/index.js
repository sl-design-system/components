import { buttonHasLabel } from './rules/button-has-label.js';
import { multilineHtmlTemplate } from './rules/multiline-html-template.js';
import { singlelineHtmlTemplateTrimmed } from './rules/singleline-html-template-trimmed.js';
import { textAreaHasLabel } from './rules/text-area-has-label.js';
import { textFieldHasLabel } from './rules/text-field-has-label.js';
import { timeFieldHasLabel } from './rules/time-field-has-label.js';

const rules = {
  'button-has-label': buttonHasLabel,
  'multiline-html-template': multilineHtmlTemplate,
  'singleline-html-template-trimmed': singlelineHtmlTemplateTrimmed,
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
        'slds/multiline-html-template': 'error',
        'slds/singleline-html-template-trimmed': 'error',
        'slds/text-area-has-label': 'error',
        'slds/text-field-has-label': 'error',
        'slds/time-field-has-label': 'error'
      }
    }
  }
};
