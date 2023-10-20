import type { DirectiveResult, ElementPart, PartInfo } from 'lit/async-directive.js';
import type { AbstractControl } from './abstract-control';
import { AsyncDirective, PartType, directive } from 'lit/async-directive.js';
import { noChange } from 'lit';

export class BindDirective extends AsyncDirective {
  control: AbstractControl | null = null;
  host: Element;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `anchor` directive must be used on the element itself');
    }

    this.host = (partInfo as ElementPart).element;
  }

  override reconnected(): void {
    this.control?.setBoundElement(this.host);
  }

  override disconnected(): void {
    this.control?.setBoundElement(null);
    this.control = null;
  }

  render(control: AbstractControl | null, name?: string): DirectiveResult {
    if (control === null) {
      throw new Error(`Could not find a form control with name: ${name ? `"${name}"` : 'undefined'}`);
    }

    if (this.control !== control) {
      this.disconnected();
      this.control = control;
      this.reconnected();
    }

    return noChange;
  }
}

export const bind = directive(BindDirective);
