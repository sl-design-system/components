import type { TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export class Grid extends LitElement {
  @property() items = [];

  render(): TemplateResult {
    return html`Hello Grid`;
  }
}
