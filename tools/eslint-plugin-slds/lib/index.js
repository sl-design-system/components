/**
 * @fileoverview ESLint plugin for SLDS components
 * @author SLDS Team
 */

import { exampleRule } from './rules/example-rule.js';
import { buttonHasLabel } from './rules/button-has-label.js';

export default {
  configs: {
    recommended: {
      plugins: {
        slds: {
          rules: {
            'button-has-label': buttonHasLabel
          }
        }
      },
      rules: {
        'slds/button-has-label': 'error'
      }
    }
  }
};
