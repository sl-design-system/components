import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { FormControlMixin, type SlFormControlEvent } from '@sl-design-system/form';
import { type EventEmitter, EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './checkbox-group.scss.js';
import { type Checkbox, type CheckboxSize } from './checkbox.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox-group': CheckboxGroup;
  }
}

const OBSERVER_OPTIONS: MutationObserverInit = { attributeFilter: ['checked'], attributeOldValue: true, subtree: true };

/**
 * Checkbox group; treat a group of checkboxes as one form input with validation, hints and errors
 *
 * @slot default - A list of `sl-checkbox` elements.
 */
@localized()
export class CheckboxGroup<T = unknown> extends FormControlMixin(LitElement) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** Observe changes to the checkboxes. */
  #observer = new MutationObserver(() => {
    this.value = this.boxes?.map(box => box.formValue) ?? [];
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.#updateValidity();
  });

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<Checkbox>(this, {
    direction: 'vertical',
    focusInIndex: (elements: Checkbox[]) => elements.findIndex(el => !el.disabled),
    elements: () => this.boxes || [],
    isFocusableElement: (el: Checkbox) => !el.disabled
  });

  /** @internal */
  readonly internals = this.attachInternals();

  /** @internal The slotted checkboxes. */
  @queryAssignedElements() boxes?: Array<Checkbox<T>>;

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value of the group changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Array<T | null>>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** Whether the group is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** At least one checkbox in the group must be checked if true. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** The size of the checkboxes in the group. */
  @property() size?: CheckboxSize;

  /** The value of the group. */
  @property({ type: Array }) override value?: Array<T | null>;

  override get formValue(): T[] {
    return this.value?.filter((v): v is T => v !== null) ?? [];
  }

  /**
   * We need to override the setter as well, otherwise it won't work.
   * See https://github.com/sl-design-system/components/issues/1441
   */
  override set formValue(value: T[]) {
    super.formValue = value;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this, OBSERVER_OPTIONS);

    this.internals.role = 'group';
    this.setFormControlElement(this);

    // Listen for i18n updates and update the validation message
    this.#events.listen(window, LOCALE_STATUS_EVENT, this.#updateValidity);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues): void {
    super.willUpdate(changes);

    if (changes.has('disabled') && typeof this.disabled === 'boolean') {
      this.boxes?.forEach(box => (box.disabled = !!this.disabled));
    }

    if (changes.has('name')) {
      if (this.name) {
        this.boxes?.forEach(box => box.setAttribute('name', this.name!));
      } else {
        this.boxes?.forEach(box => box.removeAttribute('name'));
      }
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';

      this.#updateValidity();
    }

    if (changes.has('size')) {
      this.boxes?.forEach(box => (box.size = this.size || 'md'));
    }

    if (changes.has('value')) {
      this.#observer.disconnect();
      this.boxes?.forEach((box, index) => {
        if (box.value !== undefined) {
          box.checked = this.value?.includes(box.value) ?? false;
        } else {
          box.formValue = this.value?.at(index) ?? null;
        }
      });
      this.#observer.observe(this, OBSERVER_OPTIONS);
    }
  }

  override render(): TemplateResult {
    return html`
      <slot
        @slotchange=${this.#onSlotChange}
        @sl-blur=${this.#stopEvent}
        @sl-change=${this.#stopEvent}
        @sl-focus=${this.#stopEvent}
        @sl-form-control=${this.#onFormControl}
        @sl-validate=${this.#stopEvent}
      ></slot>
    `;
  }

  override focus(): void {
    this.#rovingTabindexController.focus();
  }

  override reportValidity(): boolean {
    this.boxes?.forEach(box => box.reportValidity());

    return super.reportValidity();
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.#rovingTabindexController.focus();
    }
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onFormControl(event: SlFormControlEvent): void {
    // Prevent the event from propagating any further because from the perspective of
    // sl-form, only this control should be considered, not the slotted sl-checkbox.
    event.preventDefault();
    event.stopPropagation();
  }

  #onSlotChange(): void {
    this.#rovingTabindexController.clearElementCache();

    this.#observer.disconnect();

    this.boxes?.forEach((box, index) => {
      box.name = this.name;

      if (this.value !== undefined) {
        if (box.value !== undefined) {
          box.checked = this.value?.includes(box.value) ?? false;
        } else {
          box.formValue = this.value?.at(index) ?? null;
        }
      }

      if (typeof this.disabled === 'boolean') {
        box.disabled = !!this.disabled;
      }

      if (this.size) {
        box.size = this.size;
      }
    });

    this.value = this.boxes?.map(box => box.formValue) ?? [];

    this.#observer.observe(this, OBSERVER_OPTIONS);
  }

  #stopEvent(event: Event): void {
    // Stop the sl-blur, sl-change, sl-focus and sl-validate events from propagating
    // any further because we want to emit those events from the group itself.
    event.preventDefault();
    event.stopPropagation();
  }

  #updateValidity(): void {
    this.internals.setValidity(
      { valueMissing: this.required && !this.boxes?.some(box => box.checked) },
      msg('Please check at least one option.')
    );

    this.updateValidity();
  }
}
