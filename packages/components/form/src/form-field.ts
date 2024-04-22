import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Error } from './error.js';
import { type FormControl, type SlUpdateValidityEvent } from './form-control-mixin.js';
import styles from './form-field.scss.js';
import { Hint } from './hint.js';
import { Label, type LabelMark } from './label.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-form-field': SlFormFieldEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-form-field': FormField;
  }

  interface ShadowRoot {
    // Workaround for missing type in @open-wc/scoped-elements
    createElement(tagName: string): HTMLElement;
  }
}

export type SlFormFieldEvent = CustomEvent<void> & { target: FormField };

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

  /** Whether a custom error has been slotted. */
  #customError?: boolean;

  /** The error element. */
  #error?: Error;

  /** The hint element. */
  #hint?: Hint;

  /** The label element. */
  #label?: Label;

  /** The form control element. */
  control?: HTMLElement & FormControl;

  /**
   * The validation message that will be displayed when the field is in an invalid state.
   * @private
   */
  @state() error?: string;

  /** @internal Emits when the field is added to a form. */
  @event({ name: 'sl-form-field' }) formFieldEvent!: EventEmitter<SlFormFieldEvent>;

  /**
   * A hint that will be shown when there are no validation messages.
   * You can also slot an `<sl-hint>` element.
   */
  @property() hint?: string;

  /** The text for the label. You can also slot an `<sl-label>` element. */
  @property() label?: string;

  /** How to mark this field depending if it is required or not. */
  @property() mark?: LabelMark;

  override connectedCallback(): void {
    super.connectedCallback();

    this.formFieldEvent.emit();

    this.#customError = !!this.querySelector('sl-error');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (!this.#customError) {
      if (changes.has('error')) {
        if (this.error) {
          this.#error ??= this.shadowRoot?.createElement('sl-error') as Error;
          this.#error.innerText = this.error;
          this.#error.noIcon = !this.control?.showExternalValidityIcon;

          if (!this.#error.parentElement) {
            this.append(this.#error);
          }
        } else {
          this.#error?.remove();
          this.#error = undefined;
          this.control?.formControlElement.removeAttribute('aria-describedby');
        }
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
        this.control?.formControlElement.removeAttribute('aria-describedby');
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

    if (changes.has('mark') && this.#label) {
      this.#label.mark = this.mark;
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="label" @slotchange=${this.#onLabelSlotchange}></slot>
      <div class="wrapper" part="wrapper">
        <slot @slotchange=${this.#onSlotchange} @sl-update-validity=${this.#onUpdateValidity}></slot>
        <slot @slotchange=${this.#onErrorSlotchange} name="error"></slot>
        ${this.#customError || this.#error
          ? nothing
          : html`<slot name="hint" @slotchange=${this.#onHintSlotchange}></slot>`}
      </div>
    `;
  }

  #onErrorSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      error = assignedElements.find((el): el is Error => el instanceof Error);

    if (error && !this.error) {
      this.#customError = true;
    } else if (error) {
      this.#error = error;
      this.#error.id ||= `sl-form-field-error-${nextUniqueId++}`;
      this.#error.noIcon = !this.control?.showExternalValidityIcon;

      if (this.control) {
        this.control.formControlElement.setAttribute('aria-describedby', this.#error.id);
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

      if (this.control) {
        this.control.formControlElement.setAttribute('aria-describedby', this.#hint.id);
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

      if (this.control) {
        this.#label.for = this.control.id;
      }
    } else {
      this.#label = undefined;
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      formControl = assignedElements.find(el => 'extendsFormControlMixin' in el.constructor);

    if (formControl) {
      this.control = formControl as HTMLElement & FormControl;
      this.control.id ||= `sl-form-field-control-${nextUniqueId++}`;

      if (this.control.showValidity) {
        this.error = this.control.getLocalizedValidationMessage();
      }

      if (this.#hint) {
        this.control.formControlElement.setAttribute('aria-describedby', this.#hint.id);
      }

      if (this.#label) {
        this.#label.for = this.control.id;
        this.#label.mark = this.mark;
      }
    } else {
      this.control = undefined;

      if (this.#label) {
        this.#label.for = this.#label.mark = undefined;
      }
    }
  }

  #onUpdateValidity({ detail: { showValidity, validationMessage } }: SlUpdateValidityEvent): void {
    if (this.#error && !this.error) {
      // Do nothing if there is a custom error message slotted
      return;
    }

    this.error = showValidity ? validationMessage : undefined;
  }
}
