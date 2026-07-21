import { buttonHasLabel } from './rules/button-has-label.js';
import { multilineHtmlTemplate } from './rules/multiline-html-template.js';
import { singlelineHtmlTemplateTrimmed } from './rules/singleline-html-template-trimmed.js';
import { textFieldHasLabel } from './rules/text-field-has-label.js';

const rules = {
  'button-has-label': buttonHasLabel,
  'multiline-html-template': multilineHtmlTemplate,
  'singleline-html-template-trimmed': singlelineHtmlTemplateTrimmed,
  'text-field-has-label': textFieldHasLabel
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
        'slds/singleline-html-template-trimmed': 'error'
      }
    }
  }
};
