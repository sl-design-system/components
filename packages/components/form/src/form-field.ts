import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { type EventEmitter, event } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { Error } from './error.js';
import { type FormControl, type SlUpdateValidityEvent } from './form-control-mixin.js';
import styles from './form-field.css' with { type: 'css' };
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
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}

export type SlFormFieldEvent = CustomEvent<{ unregister?(): void }> & { target: FormField };

let nextUniqueId = 0;

/**
 * A form field component that provides a label, hint, and error message for form controls. It can
 * be used with any form control that extends the `FormControl` mixin.
 *
 * @slot label - The `<sl-label>` element to use as the label for the form control.
 * @slot hint - The `<sl-hint>` element to use as a hint for the form control.
 * @slot error - The `<sl-error>` element to use as an error message for the form control.
 * @slot controls - The form control(s) to associate with this field.
 * @csspart wrapper - The container for the hint, controls, and error slots.
 * @csspart controls - The slot that contains the form control(s).
 */
export class FormField extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-error': Error,
      'sl-hint': Hint,
      'sl-label': Label
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Queued delayed validation announcements shared across all fields. */
  static #announcementQueue: Array<{
    control: HTMLElement & FormControl;
    error: string;
    field: FormField;
  }> = [];

  /** Whether the shared announcement queue is currently being processed. */
  static #announcementQueueRunning = false;

  /** Whether a custom error has been slotted. */
  #customError?: boolean;

  /** Pending delayed validation announcements per control. */
  #controlAnnouncementTimeouts = new Map<
    HTMLElement & FormControl,
    ReturnType<typeof setTimeout>
  >();

  /** Focus listeners per form control, used to restore descriptions when controls are focused. */
  #controlFocusListeners = new Map<HTMLElement & FormControl, EventListener>();

  /** The error element. */
  #error?: Error;

  /** A record of all error elements, with the form control id as key. */
  #errors: Record<string, Error> = {};

  /** The hint element. */
  #hint?: Hint;

  /** The infotip element. */
  #infotip?: Element & { contentId?: string };

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
   * A hint that will be shown when there are no validation messages. You can also slot an
   * `<sl-hint>` element.
   */
  @property() hint?: string;

  /** The text for the label. You can also slot an `<sl-label>` element. */
  @property() label?: string;

  /** @internal Whether validation messages are announced via the live-region announcer. */
  @property({ attribute: false }) announceErrors = true;

  /** How to mark this field depending if it is required or not. */
  @property() mark?: LabelMark;

  override connectedCallback(): void {
    super.connectedCallback();

    const event = new CustomEvent('sl-form-field', {
      bubbles: true,
      composed: true,
      detail: {}
    }) as SlFormFieldEvent;
    this.formFieldEvent.emit(event);
    this.#unregister = event.detail.unregister;

    this.#customError = !!this.querySelector('sl-error');
  }

  override disconnectedCallback(): void {
    this.#unregister?.();
    this.#unregister = undefined;
    this.#clearAnnouncementTimeouts();
    this.#removeControlFocusListeners();

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

    if (!this.#customError && changes.has('errors')) {
      const errors = Object.entries(this.errors).filter(
        (error): error is [string, string] => !!error[0] && !!error[1]
      );

      // Remove any errors that are no longer present
      Object.entries(this.#errors)
        .filter(([id]) => !errors.find(([errorId]) => errorId === id))
        .forEach(([id, error]) => {
          error.remove();
          delete this.#errors[id];
        });

      // Create or update error elements for each error
      errors.forEach(([id, message]) => {
        const error = (this.#errors[id] ??= this.shadowRoot!.createElement('sl-error'));
        error.for = id;
        error.innerText = message;
        // Hide from screen readers since the error message is announced via live region
        error.setAttribute('aria-hidden', 'true');

        if (!error.parentElement) {
          this.prepend(error);
        }
      });
    }

    if (changes.has('hint')) {
      if (this.hint) {
        this.#hint ??= this.shadowRoot?.createElement('sl-hint') as Hint;
        this.#hint.innerText = this.hint;

        if (!this.#hint.parentElement) {
          this.prepend(this.#hint);
        }
        // Add to aria-describedby for programmatic hints
        this.#updateAriaDescribedBy({ add: this.#hint?.id });
      } else {
        this.#updateAriaDescribedBy({ remove: this.#hint?.id });

        this.#hint?.remove();
        this.#hint = undefined;
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
      this.#label.mark ??= this.mark;
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="label" @slotchange=${this.#onLabelSlotchange}></slot>
      <div class="wrapper" part="wrapper">
        <slot @slotchange=${this.#onHintSlotchange} name="hint"></slot>
        <slot
          @slotchange=${this.#onSlotchange}
          @sl-update-validity=${this.#onUpdateValidity}
          part="controls"></slot>
        <slot @slotchange=${this.#onErrorSlotchange} name="error"></slot>
      </div>
    `;
  }

  #onErrorSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const errors = event.target
      .assignedElements({ flatten: true })
      .filter((el): el is Error => el instanceof Error);

    errors.forEach(error => {
      // Make sure every error has a unique ID
      error.id ||= `sl-form-field-error-${nextUniqueId++}`;
      // Hide from screen readers since the error message is announced via live region
      error.setAttribute('aria-hidden', 'true');

      const control = error.for
        ? this.querySelector<HTMLElement & FormControl>(`#${error.for}`)
        : this.control;
      if (control) {
        this.#updateAriaDescribedBy({ add: error.id, control });
      }
    });

    // Trigger a re-render now that we've potentially added or removed the error message.
    this.requestUpdate();
  }

  #onHintSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      hint = assignedElements.find((el): el is Hint => el instanceof Hint);

    if (hint) {
      this.#hint = hint;
      this.#hint.id ||= `sl-form-field-hint-${nextUniqueId++}`;
      this.#updateAriaDescribedBy({ add: this.#hint.id });
    } else {
      this.#updateAriaDescribedBy({ remove: this.#hint?.id });
      this.#hint = undefined;
    }
  }

  #onLabelSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }),
      label = assignedElements.find((el): el is Label => el instanceof Label),
      infotip = label?.querySelector<Element & { contentId?: string }>('sl-infotip');

    if (infotip) {
      this.#infotip = infotip;
      this.#updateAriaDescribedBy({ add: infotip?.contentId });
    } else {
      this.#updateAriaDescribedBy({ remove: this.#infotip?.contentId });
      this.#infotip = undefined;
    }

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
      formControls = assignedElements.filter(
        (el): el is HTMLElement & FormControl => 'extendsFormControlMixin' in el.constructor
      );

    formControls.forEach(control => {
      control.id ||= `sl-form-field-control-${nextUniqueId++}`;
    });

    this.#syncControlFocusListeners(formControls);

    if (formControls.length) {
      // The first form control is considered the "primary" control
      this.control = formControls[0];

      // Set the form control name as attribute for styling purposes
      if (this.control.name) {
        this.setAttribute('name', this.control.name);
      } else {
        this.removeAttribute('name');
      }

      if (this.control.showValidity) {
        this.error = this.control.getLocalizedValidationMessage();
      }

      // Always add hint to aria-describedby so it's read when focusing the field
      this.#updateAriaDescribedBy({ add: this.#hint?.id });
      this.#updateAriaDescribedBy({ add: this.#infotip?.contentId });

      if (this.#label) {
        this.#label.for = this.control.id;
        this.#label.mark ??= this.mark;
      }
    } else {
      this.control = undefined;

      if (this.#label) {
        this.#label.for = this.#label.mark = undefined;
      }
    }
  }

  #addControlFocusListener(control: HTMLElement & FormControl): void {
    this.#removeControlFocusListener(control);

    const onControlFocus: EventListener = () => this.#onControlFocus(control);

    control.formControlElement.addEventListener('focus', onControlFocus);
    this.#controlFocusListeners.set(control, onControlFocus);
  }

  #clearAnnouncementTimeout(control: HTMLElement & FormControl): void {
    const timeout = this.#controlAnnouncementTimeouts.get(control);

    if (timeout !== undefined) {
      clearTimeout(timeout);
      this.#controlAnnouncementTimeouts.delete(control);
    }
  }

  #clearAnnouncementTimeouts(controls = [...this.#controlAnnouncementTimeouts.keys()]): void {
    controls.forEach(control => this.#clearAnnouncementTimeout(control));
  }

  #enqueueAnnouncement(control: HTMLElement & FormControl, error: string): void {
    FormField.#announcementQueue.push({ field: this, control, error });
    void FormField.#processAnnouncementQueue();
  }

  #getGeneratedError(control: HTMLElement & FormControl): Error | undefined {
    return control.id ? this.#errors[control.id] : undefined;
  }

  #onControlFocus(control: HTMLElement & FormControl): void {
    // When a control is focused, restore the shared descriptions and only the generated error
    // that belongs to that control.
    if (this.#hint) {
      this.#updateAriaDescribedBy({ add: this.#hint.id, control });
    }

    this.#updateAriaDescribedBy({ add: this.#infotip?.contentId, control });

    Object.entries(this.#errors).forEach(([id, error]) => {
      if (!error.id) {
        return;
      }

      if (id === control.id) {
        this.#updateAriaDescribedBy({ add: error.id, control });
      } else {
        this.#updateAriaDescribedBy({ remove: error.id, control });
      }
    });
  }

  #removeControlFocusListener(control: HTMLElement & FormControl): void {
    const onControlFocus = this.#controlFocusListeners.get(control);

    if (onControlFocus) {
      control.formControlElement.removeEventListener('focus', onControlFocus);
      this.#controlFocusListeners.delete(control);
    }
  }

  #removeControlFocusListeners(controls = [...this.#controlFocusListeners.keys()]): void {
    controls.forEach(control => this.#removeControlFocusListener(control));
  }

  #syncControlFocusListeners(controls: Array<HTMLElement & FormControl>): void {
    const nextControls = new Set(controls);

    this.#controlFocusListeners.forEach((_, control) => {
      if (!nextControls.has(control)) {
        this.#clearAnnouncementTimeout(control);
        this.#removeControlFocusListener(control);
      }
    });

    controls.forEach(control => this.#addControlFocusListener(control));
  }

  #syncHintDescription(control: HTMLElement & FormControl, error?: string): void {
    if (!this.#hint?.id) {
      return;
    }

    if (error) {
      this.#updateAriaDescribedBy({ remove: this.#hint.id, control });
    } else {
      this.#updateAriaDescribedBy({ add: this.#hint.id, control });
    }
  }

  #syncGeneratedErrorDescription(control: HTMLElement & FormControl, error?: string): void {
    const generatedError = this.#getGeneratedError(control);

    if (generatedError?.id && !error) {
      this.#updateAriaDescribedBy({ remove: generatedError.id, control });
    }
  }

  #updateDescriptionsAfterValidityChange(
    control: HTMLElement & FormControl,
    nextError?: string
  ): void {
    this.#syncHintDescription(control, nextError);
    this.#syncGeneratedErrorDescription(control, nextError);
  }

  #onUpdateValidity(event: SlUpdateValidityEvent): void {
    if (!event.target.id || (this.#error && !this.error)) {
      // Do nothing without a DOM id, or if there is a custom error message slotted
      return;
    }

    const control = event.target,
      previousError = this.errors[control.id],
      nextError =
        event.detail.showValidity === 'invalid' ? event.detail.validationMessage : undefined;

    if (nextError !== previousError) {
      this.#clearAnnouncementTimeout(control);
      this.#updateDescriptionsAfterValidityChange(control, nextError);
    }

    if (this.announceErrors && nextError && nextError !== previousError) {
      // Add a 250ms delay before announcing to ensure focus has moved away from the invalid field
      // This improves compatibility with screen readers like VoiceOver and NVDA
      const timeout = setTimeout(() => {
        this.#controlAnnouncementTimeouts.delete(control);

        if (this.isConnected && this.announceErrors && this.errors[control.id] === nextError) {
          this.#enqueueAnnouncement(control, nextError);
        }
      }, 250);

      this.#controlAnnouncementTimeouts.set(control, timeout);
    }

    // Since we can have multiple form controls slotted, we need to
    // separate the validation messages for each.
    this.errors = {
      ...this.errors,
      [control.id]: nextError
    };
  }

  #updateAriaDescribedBy({
    add,
    remove,
    control
  }: {
    add?: string;
    remove?: string;
    control?: (HTMLElement & FormControl) | null;
  }): void {
    const target = control ?? this.control;
    if (!target) {
      return;
    }

    const element = target.formControlElement,
      describedby = element.getAttribute('aria-describedby'),
      ids = describedby ? describedby.split(' ') : [];

    if (add && !ids.includes(add)) {
      ids.push(add);
    }

    if (remove) {
      const index = ids.indexOf(remove);
      if (index !== -1) {
        ids.splice(index, 1);
      }
    }

    if (ids.length) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  }

  #getValidationAnnouncement(control: HTMLElement & FormControl, message: string): string {
    const fieldLabel = this.#normalizeText(this.label),
      associatedLabel = this.#normalizeText(control.labels?.[0]?.textContent),
      ariaLabel = this.#normalizeText(control.formControlElement.getAttribute('aria-label')),
      name = this.#normalizeText(control.name),
      context = fieldLabel || associatedLabel || ariaLabel || name;

    return context ? `${context}: ${message}` : message;
  }

  #normalizeText(value: string | null | undefined): string | undefined {
    const normalized = value?.replace(/\s+/g, ' ').trim();

    return normalized ? normalized : undefined;
  }

  static async #processAnnouncementQueue(): Promise<void> {
    if (this.#announcementQueueRunning) {
      return;
    }

    this.#announcementQueueRunning = true;

    try {
      while (this.#announcementQueue.length) {
        const { control, error, field } = this.#announcementQueue.shift()!;

        if (field.isConnected && field.announceErrors && field.errors[control.id] === error) {
          announce(field.#getValidationAnnouncement(control, error), 'polite', true);

          // Keep the processor alive for a cooldown so fields that become invalid together
          // are announced sequentially instead of back-to-back.
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      }
    } finally {
      this.#announcementQueueRunning = false;
    }
  }
}
