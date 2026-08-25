var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { localized, msg, str } from '@lit/localize';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './no-match.scss.js';
export let NoMatch = class extends LitElement {
  render() {
    return msg(str`No options starting with "${this.value}" have been found.`, {
      id: 'sl.combobox.noOptionsFound'
    });
  }
};
/** @internal */
NoMatch.styles = styles;
__decorateClass([property()], NoMatch.prototype, 'value', 2);
NoMatch = __decorateClass([localized()], NoMatch);
//# sourceMappingURL=no-match.js.map
