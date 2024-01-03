import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { UpdateValidityEvent } from './update-validity-event.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import type { EventEmitter } from '@sl-design-system/shared';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { FormFieldEvent } from './form-field-event.js';
import { type FormControl } from './form-control-mixin.js';
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

  /** The hint element. */
  #hint?: Hint;

  /** The label element. */
  #label?: Label;

  /** The form control element. */
  formControl?: HTMLElement & FormControl;

  /**
   * The validation message that will be displayed when the field is in an invalid state.
   * @private
   */
  @state() error?: string;

  /** Emits when the field is added/removed to/from a form. */
  @event() formFieldEvent!: EventEmitter<FormFieldEvent>;

  /**
   * A hint that will be shown when there are no validation messages.
   * You can also slot an `<sl-hint>` element.
   */
  @property() hint?: string;

  /** The text for the label. You can also slot an `<sl-label>` element. */
  @property() label?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.formFieldEvent.emit(new FormFieldEvent('add'));
  }

  override disconnectedCallback(): void {
    this.formFieldEvent.emit(new FormFieldEvent('remove'));

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('error')) {
      if (this.error) {
        this.#error ??= this.shadowRoot?.createElement('sl-error') as Error;
        this.#error.innerText = this.error;
        this.#error.noIcon = !this.formControl?.showExternalValidityIcon;

        if (!this.#error.parentElement) {
          this.append(this.#error);
        }
      } else {
        this.#error?.remove();
        this.#error = undefined;
        this.formControl?.formControlElement.removeAttribute('aria-describedby');
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
        this.formControl?.formControlElement.removeAttribute('aria-describedby');
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
        <slot
          @slotchange=${this.#onErrorSlotchange}
          .noIcon=${!this.formControl?.showExternalValidityIcon}
          name="error"
        ></slot>
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
      this.#error.noIcon = !this.formControl?.showExternalValidityIcon;

      if (this.formControl) {
        this.formControl.formControlElement.setAttribute('aria-describedby', this.#error.id);
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

      if (this.formControl) {
        this.formControl.formControlElement.setAttribute('aria-describedby', this.#hint.id);
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

      if (this.formControl) {
        this.#label.for = this.formControl.id;
      }
    } else {
      this.#label = undefined;
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      formControl = assignedElements.find(el => 'extendsFormControlMixin' in el.constructor);

    if (formControl) {
      this.formControl = formControl as HTMLElement & FormControl;
      this.formControl.id ||= `sl-form-field-control-${nextUniqueId++}`;

      if (this.formControl.showValidity) {
        this.error = this.formControl.getLocalizedValidationMessage();
      }

      if (this.#hint) {
        this.formControl.formControlElement.setAttribute('aria-describedby', this.#hint.id);
      }

      if (this.#label) {
        this.#label.for = this.formControl.id;
      }
    } else {
      this.formControl = undefined;

      if (this.#label) {
        this.#label.for = undefined;
      }
    }
  }

  #onUpdateValidity(event: UpdateValidityEvent): void {
    if (this.#error && !this.error) {
      // Do nothing if there is a custom error message slotted
      return;
    }

    this.error = event.showValidity ? event.validationMessage : undefined;
  }
}
