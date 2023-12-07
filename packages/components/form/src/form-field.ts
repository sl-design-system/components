import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { UpdateValidityEvent } from './update-validity-event.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type FormControlInterface } from './form-control-mixin.js';
import styles from './form-field.scss.js';
import { Label } from './label.js';
import { Hint } from './hint.js';
import { Error } from './error.js';

// Workaround for missing type in polyfill
declare global {
  interface ShadowRoot {
    createElement(tagName: string): HTMLElement;
  }
}

let nextUniqueId = 0;

export class FormField extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-error': Error,
      'sl-hint': Hint,
      'sl-label': Label
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The error element. */
  #error?: Error;

  /** The form control element. */
  #formControl?: HTMLElement & FormControlInterface;

  /** The hint element. */
  #hint?: Hint;

  /** The label element. */
  #label?: Label;

  /**
   * An error that will be shown over any other validation messages.
   * You can also slot an `<sl-error>` element.
   */
  @property() error?: string;

  /**
   * A hint that will be shown when there are no validation messages.
   * You can also slot an `<sl-hint>` element.
   */
  @property() hint?: string;

  /** The text for the label. You can also slot an `<sl-label>` element. */
  @property() label?: string;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('error')) {
      if (this.error) {
        this.#error ??= this.shadowRoot?.createElement('sl-error') as Error;
        this.#error.innerText = this.error;

        if (!this.#error.parentElement) {
          this.append(this.#error);
        }
      } else {
        this.#error?.remove();
        this.#error = undefined;
        this.#formControl?.formControlElement.removeAttribute('aria-describedby');
      }
    }

    if (changes.has('hint')) {
      if (this.hint) {
        this.#hint ??= this.shadowRoot?.createElement('sl-hint') as Hint;
        this.#hint.innerText = this.hint;

        if (!this.#hint.parentElement) {
          this.append(this.#hint);
        }
      } else {
        this.#hint?.remove();
        this.#hint = undefined;
        this.#formControl?.formControlElement.removeAttribute('aria-describedby');
      }
    }

    if (changes.has('label')) {
      if (this.label) {
        this.#label ??= this.shadowRoot?.createElement('sl-label') as Label;
        this.#label.innerText = this.label;

        if (!this.#label.parentElement) {
          this.prepend(this.#label);
        }
      } else {
        this.#label?.remove();
        this.#label = undefined;
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="label" @slotchange=${this.#onLabelSlotchange}></slot>
      <div class="wrapper" part="wrapper">
        <slot @slotchange=${this.#onSlotchange} @sl-update-validity=${this.#onUpdateValidity}></slot>
        <slot name="error" @slotchange=${this.#onErrorSlotchange}></slot>
        ${this.#error ? nothing : html`<slot name="hint" @slotchange=${this.#onHintSlotchange}></slot>`}
      </div>
    `;
  }

  #onErrorSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      error = assignedElements.find((el): el is Error => el instanceof Error);

    if (error) {
      this.#error = error;
      this.#error.id ||= `sl-form-field-error-${nextUniqueId++}`;

      if (this.#formControl) {
        this.#formControl.formControlElement.setAttribute('aria-describedby', this.#error.id);
      }
    } else {
      this.#label = undefined;
    }

    // Trigger a re-render now that we've potentially added or removed the error message.
    this.requestUpdate();
  }

  #onHintSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      hint = assignedElements.find((el): el is Hint => el instanceof Hint);

    if (hint) {
      this.#hint = hint;
      this.#hint.id ||= `sl-form-field-hint-${nextUniqueId++}`;

      if (this.#formControl) {
        this.#formControl.formControlElement.setAttribute('aria-describedby', this.#hint.id);
      }
    } else {
      this.#label = undefined;
    }
  }

  #onLabelSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      label = assignedElements.find((el): el is Label => el instanceof Label);

    if (label) {
      this.#label = label;

      if (this.#formControl) {
        this.#label.for = this.#formControl.id;
      }
    } else {
      this.#label = undefined;
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      formControl = assignedElements.find(el => 'extendsFormControlMixin' in el.constructor);

    if (formControl) {
      this.#formControl = formControl as HTMLElement & FormControlInterface;
      this.#formControl.id ||= `sl-form-field-control-${nextUniqueId++}`;

      if (this.#hint) {
        this.#formControl.formControlElement.setAttribute('aria-describedby', this.#hint.id);
      }

      if (this.#label) {
        this.#label.for = this.#formControl.id;
      }
    } else {
      this.#formControl = undefined;

      if (this.#label) {
        this.#label.for = undefined;
      }
    }
  }

  #onUpdateValidity(event: UpdateValidityEvent): void {
    this.error = event.showValidity ? event.validationMessage : undefined;
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
