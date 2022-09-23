import {html, LitElement, TemplateResult} from 'lit';

export class Input extends LitElement {
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
