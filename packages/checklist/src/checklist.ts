import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './checklist.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'slds-checklist': Checklist;
  }
}

export class Checklist extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<h1>Hello world</h1>`;
  }
}
