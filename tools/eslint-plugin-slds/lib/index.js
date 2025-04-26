import { buttonHasLabel } from './rules/button-has-label.js';
import { multilineHtmlTemplate } from './rules/multiline-html-template.js';
import { singlelineHtmlTemplateTrimmed } from './rules/singleline-html-template-trimmed.js';

export default {
  configs: {
    recommended: {
      plugins: {
        slds: {
          rules: {
            'button-has-label': buttonHasLabel,
            'multiline-html-template': multilineHtmlTemplate,
            'singleline-html-template-trimmed': singlelineHtmlTemplateTrimmed
          }
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
