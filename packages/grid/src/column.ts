import type { TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export class GridColumn extends LitElement {
  @property() path?: string;

  render(): TemplateResult {
    return html``;
  }
}
