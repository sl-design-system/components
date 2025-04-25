/**
 * @fileoverview ESLint plugin for SLDS components
 * @author SLDS Team
 */

import { exampleRule } from './rules/example-rule.js';
import { buttonHasText } from './rules/button-has-text.js';

export default {
  rules: {
    'example-rule': exampleRule,
    'button-has-text': buttonHasText
  },
  configs: {
    recommended: {
      plugins: ['slds'],
      rules: {
        'slds/example-rule': 'warn',
        'slds/button-has-text': 'error'
      }
    }
  }
};
