import type { AttributePart, DirectiveResult, PartInfo } from 'lit/async-directive.js';
import type { AbstractControl } from './abstract-control';
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { noChange } from 'lit';

export class BindDirective extends AsyncDirective {
  host: HTMLElement;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    this.host = (partInfo as AttributePart).element;
  }

  render(control: AbstractControl, name?: string): DirectiveResult {
    console.log('render', control, name, this.host);

    return noChange;
  }
}

export const bind = directive(BindDirective);
