import { LitElement, type TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('doc-nav')
export class Nav extends LitElement {
  render(): TemplateResult {
    return html`Hello world`;
  }
}
