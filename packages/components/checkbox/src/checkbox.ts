import { localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { type Infotip } from '@sl-design-system/infotip';
import { type EventEmitter, event } from '@sl-design-system/shared';
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
  html,
  svg
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './checkbox.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox': Checkbox;
  }
}

export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * A checkbox with 3 states; unchecked, checked and intermediate.
 *
 * The checkbox is a form associated custom element: it is the form control itself, rather than
 * wrapping an `<input>`. All state is exposed through `ElementInternals`, so there is no light DOM
 * `<input>` or `<label>` to keep in sync.
 *
 * @csspart outer - The outer container of the checkbox.
 * @csspart inner - The inner container of the checkbox.
 * @csspart label - The label of the checkbox.
 *
 * @slot default - Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot infotip - The slot for the infotip element
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Checkbox<T = any> extends FormControlMixin(LitElement) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** The checked state to restore when the form is reset. */
  #initialChecked = false;

  /**
   * The tabindex the author set on the host, if any. A checkbox that is not a tab stop of its own
   * (an sl-tree-node row, for example) can opt out with `tabindex="-1"`.
   */
  #authorTabIndex?: number;

  /** @internal Element internals. */
  readonly internals = this.attachInternals();

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /**
   * Whether the checkbox is checked.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /**
   * Whether the checkbox is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /**
   * Whether the checkbox has the indeterminate state.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate?: boolean;

  /** An optional infotip associated with this checkbox. */
  @state() infotip?: Infotip;

  /**
   * Whether the checkbox is required.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /**
   * When set will cause the control to show it is valid after reportValidity is called.
   *
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the checkbox.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: CheckboxSize;

  /**
   * The value of the checkbox when the checkbox is checked. See the formValue property for easy
   * access.
   */
  @property() override value?: T;

  override get formValue(): T | null {
    return this.checked ? ((this.value ?? true) as T) : null;
  }

  override set formValue(value: T | null) {
    this.checked = value === this.value || (this.value === undefined && value === true);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'checkbox';
    this.setFormControlElement(this);

    // Read this before the first `#updateTabIndex()` call overwrites the attribute.
    if (this.#authorTabIndex === undefined && this.hasAttribute('tabindex')) {
      this.#authorTabIndex = this.tabIndex;
    }

    this.#updateTabIndex();

    if (this.#eventController.signal.aborted) {
      this.#eventController = new AbortController();
    }

    const { signal } = this.#eventController;

    this.addEventListener('click', this.#onClick, { signal });
    this.addEventListener('focusin', this.#onFocusin, { signal });
    this.addEventListener('focusout', this.#onFocusout, { signal });
    this.addEventListener('keydown', this.#onKeydown, { signal });
  }

  override disconnectedCallback(): void {
    this.#eventController.abort();

    super.disconnectedCallback();
  }

  formAssociatedCallback(): void {
    this.#initialChecked = this.hasAttribute('checked');
  }

  formResetCallback(): void {
    this.checked = this.#initialChecked;
    this.indeterminate = false;

    this.changeEvent.emit(this.formValue);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    // Not guarded by `changes`: role=checkbox requires aria-checked, so it must also be set for a
    // checkbox that is never toggled.
    this.internals.ariaChecked = this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false';

    if (changes.has('checked')) {
      if (this.checked) {
        this.internals.states.add('checked');
      } else {
        this.internals.states.delete('checked');
      }
    }

    if (changes.has('disabled')) {
      this.internals.ariaDisabled = this.disabled ? 'true' : null;
      this.#updateTabIndex();
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
    }

    const props: Array<keyof Checkbox> = ['checked', 'disabled', 'required', 'value'];
    if (props.some(prop => changes.has(prop))) {
      this.#updateValueAndValidity();
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#updateValueAndValidity();

    // `slotchange` never fires for a slot that stays empty, so do the initial pass by hand.
    this.#onLabelSlotChange();

    // A parent sl-form-field associates its `<label>` after we render, so pick the labels up once
    // the surrounding DOM has settled.
    requestAnimationFrame(() => this.#updateAccessibleName());
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <div part="outer">
          <div part="inner">
            <svg
              aria-hidden="true"
              class=${classMap({ checked: !!this.checked, indeterminate: !!this.indeterminate })}
              part="svg"
              version="1.1"
              viewBox="0 0 24 24">
              ${this.indeterminate
                ? svg`<path d="M4.1,12 9,12 20.3,12"></path>`
                : svg`<path d="M4.1,12.7 9,17.6 20.3,6.3"></path>`}
            </svg>
          </div>
        </div>
        <span part="label">
          <slot @slotchange=${this.#onLabelSlotChange}></slot>
        </span>
      </div>
      <slot
        name="infotip"
        focusgroup=${ifDefined(this.disabled ? 'none' : undefined)}
        @slotchange=${this.#onInfotipSlotChange}></slot>
    `;
  }

  /**
   * Toggles the checked state, as if the user activated the checkbox: this emits an `sl-change`
   * event, marks the control dirty and updates its validity.
   */
  toggle(force?: boolean): void {
    // Changing `checked` schedules an update, and `willUpdate` syncs the form value and validity;
    // doing that here as well would emit `sl-validate` twice per toggle.
    this.checked = force ?? !this.checked;

    this.changeEvent.emit(this.formValue);
    this.updateState({ dirty: true });
  }

  override getLocalizedValidationMessage(): string {
    if (!this.validity.customError && this.validity.valueMissing) {
      return msg('Please check this box.', { id: 'sl.checkbox.validation.valueMissing' });
    }

    return super.getLocalizedValidationMessage();
  }

  #onClick = (event: Event): void => {
    if (this.disabled || (this.infotip && event.composedPath().includes(this.infotip))) {
      return;
    }

    event.stopPropagation();

    this.toggle();
  };

  #onFocusin = (): void => {
    this.focusEvent.emit();
  };

  #onFocusout = (): void => {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (this.disabled || !['Enter', ' '].includes(event.key)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.toggle();
  };

  #onLabelSlotChange = (): void => {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot:not([name])'),
      label = (slot?.assignedNodes({ flatten: true }) ?? [])
        .map(node => node.textContent?.trim() || '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    this.#updateAccessibleName();

    if (this.infotip && !this.infotip.describes) {
      this.infotip.describes = label;
    }

    if (label.length) {
      this.internals.states.delete('no-label');
    } else {
      this.internals.states.add('no-label');
    }
  };

  #onInfotipSlotChange = (): void => {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="infotip"]'),
      assignedElements = slot?.assignedElements({ flatten: true }) ?? [];

    this.infotip =
      assignedElements.find((el): el is Infotip => el.tagName === 'SL-INFOTIP') || undefined;

    if (this.infotip) {
      this.infotip.setAttribute('size', 'sm');

      // The infotip may be slotted after the label, so let the label handler describe it.
      this.#onLabelSlotChange();
    }
  };

  /**
   * Points the accessible name at the associated `<label>` elements (from an sl-form-field, for
   * example) followed by the checkbox's own label. Referencing the shadow DOM `[part="label"]`
   * resolves to the slotted text, so the name stays in sync without copying it.
   *
   * These are _default_ semantics: an `aria-label` or `aria-labelledby` on the host takes
   * precedence over them, which is how an sl-tooltip can label the checkbox instead.
   */
  #updateAccessibleName(): void {
    const ownLabel = this.renderRoot?.querySelector<HTMLElement>('[part="label"]'),
      elements = [...(this.internals.labels ?? []), ...(ownLabel ? [ownLabel] : [])];

    this.internals.ariaLabelledByElements = elements as HTMLElement[];
  }

  #updateTabIndex(): void {
    // A disabled checkbox is never focusable; otherwise the author's tabindex wins.
    this.tabIndex = this.disabled ? -1 : (this.#authorTabIndex ?? 0);
  }

  #updateValueAndValidity(): void {
    this.internals.setFormValue(this.nativeFormValue);
    this.internals.setValidity(
      { valueMissing: !!this.required && !this.checked },
      msg('Please check this box.', { id: 'sl.checkbox.validation.valueMissing' })
    );

    this.updateValidity();
  }
}
