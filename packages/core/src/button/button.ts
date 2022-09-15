import type { TemplateResult } from 'lit';
import { LitElement, html } from 'lit';

export class Button extends LitElement {
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
