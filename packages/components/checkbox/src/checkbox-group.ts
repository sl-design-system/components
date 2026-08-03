import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { FormControlMixin, type SlFormControlEvent } from '@sl-design-system/form';
import { type EventEmitter, ForwardAriaMixin, event } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './checkbox-group.scss.js';
import { Checkbox, type CheckboxSize } from './checkbox.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox-group': CheckboxGroup;
  }
}

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributeFilter: ['checked'],
  attributeOldValue: true,
  subtree: true
};

/**
 * Checkbox group; treat a group of checkboxes as one form input with validation, hints and errors
 *
 * @customElement sl-checkbox-group
 *
 * @slot - Two or more `sl-checkbox` elements.
 *
 * @csspart wrapper - The wrapper around the slotted checkboxes.
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class CheckboxGroup<T = any> extends FormControlMixin(ForwardAriaMixin(LitElement)) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** Observe changes to the checkboxes. */
  #observer = new MutationObserver(() => {
    this.value = this.boxes?.map(box => box.formValue) ?? [];
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.#updateValidity();
  });

  /** @internal */
  readonly internals = this.attachInternals();

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal The slotted checkboxes. */
  @queryAssignedElements({ selector: 'sl-checkbox' }) boxes?: Array<Checkbox<T>>;

  /** @internal Emits when the value of the group changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Array<T | null>>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /**
   * Whether the group is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean }) override disabled?: boolean;

  /**
   * At least one checkbox in the group must be checked if true.
   *
   * @default false
   */
  @property({ type: Boolean }) override required?: boolean;

  /**
   * The size of the checkboxes in the group.
   *
   * @default 'md'
   */
  @property() size?: CheckboxSize;

  /** The value of the group. */
  @property({ type: Array }) override value?: Array<T | null>;

  override get formValue(): T[] {
    return this.value?.filter((v): v is T => v !== null) ?? [];
  }

  override set formValue(value: T[]) {
    super.formValue = value;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this, OBSERVER_OPTIONS);

    this.setFormControlElement(this);

    if (this.#eventController.signal.aborted) {
      this.#eventController = new AbortController();
    }

    const { signal } = this.#eventController;

    this.addEventListener('click', this.#onClick, { signal });
    this.addEventListener('focusin', this.#onFocusin, { signal });
    this.addEventListener('focusout', this.#onFocusout, { signal });
    window.addEventListener(LOCALE_STATUS_EVENT, this.#updateValidity, { signal });

    requestAnimationFrame(() =>
      this.setProxyTarget(this.renderRoot.querySelector('[part="wrapper"]')!)
    );
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.#eventController.abort();

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
      this.internals.ariaRequired = Boolean(this.required).toString();

      this.#updateValidity();
    }

    if (changes.has('size')) {
      this.boxes?.forEach(box => (box.size = this.size || 'md'));
    }

    if (changes.has('value')) {
      this.#observer.disconnect();

      this.boxes?.forEach((box, index) => {
        if (box.value != null) {
          box.checked = this.value?.includes(box.value) ?? false;
        } else {
          const newValue = this.value?.at(index) ?? null;
          // to prevent unnecessary updates
          if (box.formValue !== newValue) {
            box.formValue = newValue;
          }
        }
      });

      this.#observer.observe(this, OBSERVER_OPTIONS);
    }
  }

  override render(): TemplateResult {
    return html`
      <div focusgroup="toolbar block wrap" part="wrapper" role="group">
        <slot
          @slotchange=${this.#onSlotChange}
          @sl-blur=${this.#stopEvent}
          @sl-change=${this.#stopEvent}
          @sl-focus=${this.#stopEvent}
          @sl-form-control=${this.#onFormControl}
          @sl-validate=${this.#stopEvent}></slot>
      </div>
    `;
  }

  /**
   * The group itself is not focusable; focus goes to the first checkbox the user could reach with
   * the keyboard. Without this, `focus()` on the host silently does nothing, which would break
   * `autofocus` and the "jump to this field" links in `sl-form-validation-errors`.
   */
  override focus(options?: FocusOptions): void {
    this.#firstFocusableBox()?.focus(options);
  }

  override reportValidity(): boolean {
    this.boxes?.forEach(box => box.reportValidity());

    return super.reportValidity();
  }

  /**
   * Clicking an associated `<label>` element triggers a click on the host. When that happens, we
   * manually focus the first checkbox in the group.
   */
  #onClick = (event: Event): void => {
    if (event.target === this) {
      this.#firstFocusableBox()?.focus();
    }
  };

  #onFocusin = (): void => {
    this.focusEvent.emit();
  };

  #onFocusout = (): void => {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  };

  #onFormControl(event: SlFormControlEvent): void {
    // Prevent the event from propagating any further because from the perspective of
    // sl-form, only this control should be considered, not the slotted sl-checkbox.
    event.preventDefault();
    event.stopPropagation();
  }

  async #onSlotChange(): Promise<void> {
    this.#observer.disconnect();

    for (const box of this.boxes ?? []) {
      box.name = this.name;

      if (this.value !== undefined && box.value !== undefined) {
        box.checked = this.value?.some(v => v == box.value) ?? false;
      }

      if (typeof this.disabled === 'boolean') {
        box.disabled = this.disabled;
      }

      if (this.size) {
        box.size = this.size;
      }

      // Wait for the `<sl-checkbox>` to stabilize, otherwise we'll trigger the observer
      await box.updateComplete;
    }

    // The value can also be determined by which boxes are checked
    this.value = this.boxes?.map(box => box.formValue) ?? [];

    this.#observer.observe(this, OBSERVER_OPTIONS);
    this.#updateValidity();
  }

  /** The first checkbox that can actually take focus; a disabled one cannot. */
  #firstFocusableBox(): Checkbox<T> | undefined {
    return this.boxes?.find(box => !box.disabled);
  }

  #stopEvent(event: Event): void {
    // Stop the sl-blur, sl-change, sl-focus and sl-validate events from propagating
    // any further because we want to emit those events from the group itself.
    event.preventDefault();
    event.stopPropagation();
  }

  #updateValidity = (): void => {
    this.internals.setValidity(
      { valueMissing: this.required && !this.boxes?.some(box => box.checked) },
      msg('Please check at least one option.', {
        id: 'sl.checkbox.validation.valueMissingMultiple'
      })
    );

    this.updateValidity();
  };
}
