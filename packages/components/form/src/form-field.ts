import type { CSSResultGroup, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type FormControlInterface } from './form-control-mixin.js';
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

  /** The form control element. */
  #formControl?: HTMLElement & FormControlInterface;

  /** An error text that will be shown over any other validation messages. */
  @property({ attribute: 'error-text' }) errorText?: string;

  /** A hint text that will be shown when there are no validation messages. */
  @property({ attribute: 'hint-text' }) hintText?: string;

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange}></slot>
      <slot name="error">${this.errorText ? html`<sl-error>${this.errorText}</sl-error>` : nothing}</slot>
      <slot name="hint">${this.hintText ? html`<sl-hint>${this.hintText}</sl-hint>` : nothing}</slot>
    `;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      formControl = assignedElements.find(el => 'extendsFormControlMixin' in el.constructor);

    if (formControl) {
      this.#formControl = formControl as HTMLElement & FormControlInterface;
    } else {
      this.#formControl = undefined;
    }
  }

  // #setErrorText(text: string = ''): void {
  //   if (!text && !this.#errorElement) {
  //     return;
  //   }

  //   this.#errorElement ??= document.createElement('div');
  //   this.#errorElement.id ||= `sl-error-${nextUniqueId++}`;
  //   this.#errorElement.innerText = text;
  //   this.#errorElement.slot ||= 'error-text';

  //   const ids = this.formControlElement.getAttribute('aria-describedby')?.split(' ') ?? [];
  //   if (!ids.includes(this.#errorElement.id)) {
  //     this.formControlElement.setAttribute('aria-describedby', [...ids, this.#errorElement.id].join(' '));
  //   }

  //   // The error is added to the light DOM so that it can be linked to by the aria-describedby
  //   // attribute. This is necessary for accessibility.
  //   if (!this.#errorElement.parentElement) {
  //     this.append(this.#errorElement);
  //   }
  // }

  // #setHintText(text: string = ''): void {
  //   if (!text && !this.#hintElement) {
  //     return;
  //   }

  //   this.#hintElement ??= document.createElement('div');
  //   this.#hintElement.id ||= `sl-hint-${nextUniqueId++}`;
  //   this.#hintElement.innerText = text;
  //   this.#hintElement.slot ||= 'hint-text';

  //   const ids = this.formControlElement.getAttribute('aria-describedby')?.split(' ') ?? [];
  //   if (!ids.includes(this.#hintElement.id)) {
  //     this.formControlElement.setAttribute('aria-describedby', [...ids, this.#hintElement.id].join(' '));
  //   }

  //   // The hint is added to the light DOM so that it can be linked to by the aria-describedby
  //   // attribute. This is necessary for accessibility.
  //   if (!this.#hintElement.parentElement) {
  //     this.append(this.#hintElement);
  //   }
  // }
}
