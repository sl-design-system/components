import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { type EventEmitter, EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './checkbox-group.scss.js';
import { type Checkbox, type CheckboxSize } from './checkbox.js';

const OBSERVER_OPTIONS: MutationObserverInit = { attributeFilter: ['checked'], attributeOldValue: true, subtree: true };

/**
 * Checkbox group; treat a group of checkboxes as one form input with validation, hints and errors
 *
 * @slot default - A list of `sl-checkbox` elements.
 */
@localized()
export class CheckboxGroup<T = unknown> extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** Observe changes to the checkboxes. */
  #observer = new MutationObserver(() => {
    this.value = this.boxes?.map(box => box.formValue).filter((v): v is T => v !== null) ?? [];
    this.changeEvent.emit(this.value);
    this.#updateValidity();
  });

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<Checkbox>(this, {
    focusInIndex: (elements: Checkbox[]) => elements.findIndex(el => !el.disabled),
    elements: () => this.boxes || [],
    isFocusableElement: (el: Checkbox) => !el.disabled
  });

  /** @private */
  readonly internals = this.attachInternals();

  /** @private The slotted checkboxes. */
  @queryAssignedElements() boxes?: Array<Checkbox<T>>;

  /** Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<void>;

  /** Emits when the value of the group changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<T[]>;

  /** Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<void>;

  /** Whether the group is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** At least one checkbox in the group must be checked if true. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** The size of the checkboxes in the group.
   * @type {'md' | 'lg'}
   */
  @property() size?: CheckboxSize;

  /** The value of the group. */
  @property({ type: Array }) override value?: T[];

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
  }

  override render(): TemplateResult {
    return html`
      <slot
        @slotchange=${this.#onSlotchange}
        @sl-blur=${this.#stopEvent}
        @sl-change=${this.#stopEvent}
        @sl-focus=${this.#stopEvent}
        @sl-validate=${this.#stopEvent}
      ></slot>
    `;
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
  }

  #onSlotchange(): void {
    this.#rovingTabindexController.clearElementCache();

    this.#observer.disconnect();

    this.boxes?.forEach(box => {
      box.name = this.name;
      box.checked = box.value !== undefined && this.value?.includes(box.value);

      if (typeof this.disabled === 'boolean') {
        box.disabled = !!this.disabled;
      }

      if (this.size) {
        box.size = this.size;
      }
    });

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
