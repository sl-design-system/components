/**
 * @fileoverview ESLint plugin for SLDS components
 * @author SLDS Team
 */

import { exampleRule } from './rules/example-rule.js';

export default {
  rules: {
    'example-rule': exampleRule
  },
  configs: {
    recommended: {
      plugins: ['slds'],
      rules: {
        'slds/example-rule': 'warn'
      }
    }
  }
};
