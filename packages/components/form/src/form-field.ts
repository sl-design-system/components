import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import styles from './form-field.scss.js';

export class FormField extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
