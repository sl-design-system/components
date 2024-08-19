import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
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

export type SlFormFieldEvent = CustomEvent<{ unregister?(): void }> & { target: FormField };

let nextUniqueId = 0;

export class FormField extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-error': Error,
      'sl-hint': Hint,
      'sl-label': Label
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether a custom error has been slotted. */
  #customError?: boolean;

  /** The error element. */
  #error?: Error;

  /** The hint element. */
  #hint?: Hint;

  /** The label element. */
  #label?: Label;

  /** Callback returned by the parent form to call when this element is disconnected. */
  #unregister?: () => void;

  /** The form control element. */
  control?: HTMLElement & FormControl;

  /** @internal The message that will be displayed when the field is in an invalid state. */
  @state() error?: string;

  /** @internal A record of error messages for all controls. */
  @state() errors: Record<string, string | undefined> = {};

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

    const event = new CustomEvent('sl-form-field', { bubbles: true, composed: true, detail: {} }) as SlFormFieldEvent;
    this.formFieldEvent.emit(event);
    this.#unregister = event.detail.unregister;

    this.#customError = !!this.querySelector('sl-error');
  }

  override disconnectedCallback(): void {
    this.#unregister?.();
    this.#unregister = undefined;

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (!this.#customError && changes.has('errors')) {
      const errors = Object.values(this.errors).filter(Boolean) as string[];

      this.error = errors.at(0);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (!this.#customError) {
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
        <slot @slotchange=${this.#onHintSlotchange} name="hint"></slot>
        <slot @slotchange=${this.#onSlotchange} @sl-update-validity=${this.#onUpdateValidity}></slot>
        <slot @slotchange=${this.#onErrorSlotchange} name="error"></slot>
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
      formControls = assignedElements.filter(el => 'extendsFormControlMixin' in el.constructor);

    formControls.forEach(control => {
      control.id ||= `sl-form-field-control-${nextUniqueId++}`;
    });

    if (formControls.length) {
      // The first form control is considered the "primary" control
      this.control = formControls[0] as HTMLElement & FormControl;

      // Set the form control name as attribute for styling purposes
      if (this.control.name) {
        this.setAttribute('name', this.control.name);
      } else {
        this.removeAttribute('name');
      }

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

  #onUpdateValidity(event: SlUpdateValidityEvent): void {
    if (this.#error && !this.error) {
      // Do nothing if there is a custom error message slotted
      return;
    }

    // Since we can have multiple form controls slotted, we need to
    // separate the validation messages for each.
    this.errors = {
      ...this.errors,
      [event.target.id]: event.detail.showValidity ? event.detail.validationMessage : undefined
    };
  }
}
