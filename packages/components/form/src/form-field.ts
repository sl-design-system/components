import type { CSSResultGroup, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormControlMixin } from './form-control-mixin.js';
import styles from './form-field.scss.js';
import { Hint } from './hint.js';
import { Error } from './error.js';

export class FormField extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-hint': Hint,
      'sl-error': Error
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Hint text for helping the user fill out the form field. */
  @property() hint?: string;

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange}></slot>
      <slot name="hint">
        <sl-hint>${this.hint}</sl-hint>
      </slot>
    `;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      formControl = assignedElements.find(el => el instanceof FormControlMixin);

    if (formControl) {
      console.log('formControl', formControl);
    }
  }
}
