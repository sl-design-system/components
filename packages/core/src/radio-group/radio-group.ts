import type { CSSResultGroup, TemplateResult } from 'lit';
import { FormControlMixin } from '@open-wc/form-control';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './radio-group.scss.js';

export class RadioGroup extends FormControlMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether all the radio's in the group are disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The orientation of the radio's in the group. */
  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'vertical';

  /** The value of the selected radio. */
  @property() value = '';

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
