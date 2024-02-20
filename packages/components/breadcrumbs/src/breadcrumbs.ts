import { LitElement, type TemplateResult, html } from 'lit';

export class Breadcrumbs extends LitElement {
  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
