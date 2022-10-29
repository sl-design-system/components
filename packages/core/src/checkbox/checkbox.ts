import type { PropertyValues, TemplateResult } from 'lit';
import { FormControlMixin } from '@open-wc/form-control';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators';

export class Checkbox extends FormControlMixin(LitElement) {
  /** Whether the checkbox is checked. */
  @property({ type: Boolean }) checked = false;

  /** The value of the checkbox when checked. */
  @property() value = '';

  updated(changes: PropertyValues<this>): void {
    if (changes.has('checked') || changes.has('value')) {
      this.setValue(this.value);
    }
  }

  render(): TemplateResult {
    return html``;
  }

  shouldFormValueUpdate(): boolean {
    return this.checked;
  }
}
