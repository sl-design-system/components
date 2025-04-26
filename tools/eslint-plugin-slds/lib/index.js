import { buttonHasLabel } from './rules/button-has-label.js';
import { multilineHtmlTemplate } from './rules/multiline-html-template.js';

export default {
  configs: {
    recommended: {
      plugins: {
        slds: {
          rules: {
            'button-has-label': buttonHasLabel,
            'multiline-html-template': multilineHtmlTemplate
          }
        }
      },
      rules: {
        'slds/button-has-label': 'error',
        'slds/multiline-html-template': 'error'
      }
    }
  }
};
