import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { FieldButton, TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './time-field.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-time-field': TimeField;
  }
}

export class TimeField extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-field-button': FieldButton,
      'sl-icon': Icon,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`time-field`;
  }
}
