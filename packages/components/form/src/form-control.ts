import type { DirectiveResult } from 'lit/directive.js';
import { AbstractControl } from './abstract-control.js';
import { bind } from './bind-directive.js';

export class FormControl extends AbstractControl {
  override bind(): DirectiveResult {
    return bind(this);
  }
}
