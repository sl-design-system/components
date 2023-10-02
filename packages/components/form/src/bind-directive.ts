import type { AttributePart, DirectiveResult, PartInfo } from 'lit/async-directive.js';
import type { AbstractControl } from './abstract-control';
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { noChange } from 'lit';

export class BindDirective extends AsyncDirective {
  control: AbstractControl | null = null;
  host: HTMLElement;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    this.host = (partInfo as AttributePart).element;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  override reconnected(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  override disconnected(): void {}

  render(control: AbstractControl | null, name?: string): DirectiveResult {
    if (control === null) {
      throw new Error(`Could not find a form control with name: ${name ? `"${name}"` : 'undefined'}`);
    }

    if (this.control !== control) {
      this.control = control;

      this.reconnected();
    }

    return noChange;
  }
}

export const bind = directive(BindDirective);
