import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Listbox, Option, OptionGroup } from '@sl-design-system/listbox';
import {
  type EventEmitter,
  EventsController,
  ObserveAttributesMixin,
  RovingTabindexController,
  anchor,
  event
} from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { SelectButton } from './select-button.js';
import styles from './select.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select': Select;
  }

  interface ShadowRoot {
    // Workaround for missing type in @open-wc/scoped-elements
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}

export type SelectSize = 'md' | 'lg';

/**
 * A form control that allows users to select one option from a list of options.
 *
 * @slot default - Place for `sl-option` and `sl-option-group` elements
 * @csspart listbox - Set `--sl-popover-max-block-size` and/or `--sl-popover-min-block-size` to control the minimum and maximum height of the dropdown (within the limits of the available screen real estate)
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Select<T = any> extends ObserveAttributesMixin(FormControlMixin(ScopedElementsMixin(LitElement)), [
  'aria-describedby',
  'aria-label',
  'aria-labelledby'
]) {
  /** @internal */
  static formAssociated = true;

  /** @internal The default offset of the listbox to the button. */
  static offset = 6;

  /** @internal */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-describedby', 'aria-label', 'aria-labelledby'];
  }

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-listbox': Listbox,
      'sl-select-button': SelectButton
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the tooltip and the viewport. */
  static viewportMargin = 8;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** The initial state when the form was associated with the select. Used to reset the select. */
  #initialState?: T;

  /** Since we can't use `popovertarget`, we need to monitor the closing state manually. */
  #popoverClosing = false;

  /** Manage keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<Option>(this, {
    direction: 'vertical',
    elements: () => this.options || [],
    focusInIndex: (elements: Option[]) => {
      const index = elements.findIndex(el => el.selected);

      return index !== -1 ? index : elements.findIndex(el => !el.disabled);
    },
    isFocusableElement: (el: Option) => !el.disabled
  });

  /** The button in the light DOM. */
  button!: SelectButton;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | undefined>>;

  /** Will display a clear button when an option is selected. */
  @property({ type: Boolean, reflect: true }) clearable?: boolean;

  /**
   * The current option in the listbox. This is the option that will become the
   * selected option if the user presses Enter/Space.
   * @internal
   */
  @state() currentOption?: Option<T>;

  /** Whether the select is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal */
  readonly internals = this.attachInternals();

  /** @internal The listbox element that is also the popover. */
  @query('sl-listbox') listbox?: Listbox;

  /** @internal */
  @queryAssignedElements({ selector: 'sl-option-group', flatten: true }) optionGroups?: OptionGroup[];

  /** @internal A flattened array of all options (even grouped ones). */
  get options(): Array<Option<T>> {
    const elements =
      this.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])')?.assignedElements({ flatten: true }) ?? [];

    return elements.flatMap(element => this.#getAllOptions(element));
  }

  /** The placeholder text to show when no option is chosen. */
  @property() placeholder?: string;

  /** Whether the select is a required field. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** @internal The selected option in the listbox. */
  @state() selectedOption?: Option<T>;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the select.
   * @default md
   */
  @property({ reflect: true }) size?: SelectSize;

  /**
   * The number of pixels from the top of the viewport the select should be hidden on scroll.
   * Use this when there is a sticky header you don't want dropdowns to fall on top of.
   */
  @property({ type: Number, attribute: 'hide-margin-top' }) rootMarginTop: number = 0;

  /** The value for the select, to be used in forms. */
  @property() override value?: T;

  override connectedCallback(): void {
    super.connectedCallback();

    // This is a workaround because ARIA reflection elements are not yet available
    // everywhere. This may have changed by autumn 2025.
    if (!this.button) {
      this.button = this.shadowRoot!.createElement('sl-select-button');
      this.button.addEventListener('click', () => this.#onButtonClick());
      this.button.addEventListener('keydown', (event: KeyboardEvent) => this.#onKeydown(event));
      this.button.addEventListener('sl-clear', () => this.#onClear());
      this.button.clearable = !!this.clearable;
      this.button.disabled = !!this.disabled;
      this.button.placeholder = this.placeholder;
      this.button.required = !!this.required;
      this.button.selected = this.selectedOption;
      this.button.showValid = !!this.showValid;
      this.button.showValidity = this.showValidity;
      this.button.size = this.size;
      this.button.tabIndex = this.disabled ? -1 : 0;
      this.button.setAttribute('aria-expanded', 'false');
      this.button.setAttribute('aria-haspopup', 'listbox');
      this.prepend(this.button);
    }

    this.setFormControlElement(this);
    this.setAttributesTarget(this.button);

    // Listen for i18n updates and update the validation message
    this.#events.listen(window, LOCALE_STATUS_EVENT, this.#updateValueAndValidity);
  }

  /** @ignore Stores the initial state of the select */
  formAssociatedCallback(): void {
    this.#initialState = this.value;
  }

  /** @ignore Resets the select to the initial state */
  formResetCallback(): void {
    this.value = this.#initialState;
    this.changeEvent.emit(this.value);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('clearable')) {
      this.button.clearable = this.clearable;
    }

    if (changes.has('disabled')) {
      this.button.disabled = this.disabled;
    }

    if (changes.has('placeholder')) {
      this.button.placeholder = this.placeholder;
    }

    if (changes.has('required')) {
      this.button.required = this.required;
      this.internals.ariaRequired = Boolean(this.required).toString();

      this.#updateValueAndValidity();
    }

    if (changes.has('showValid')) {
      this.button.showValid = this.showValid;
    }

    if (changes.has('showValidity')) {
      this.button.showValidity = this.showValidity;
    }

    if (changes.has('size')) {
      this.button.size = this.size;
    }

    if (changes.has('value')) {
      const selectedOption = this.options.find(option => option.value === this.value);

      if (selectedOption !== this.selectedOption) {
        this.#setSelectedOption(selectedOption, false);
      }
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    requestAnimationFrame(() => {
      if (this.internals.labels.length) {
        // Set the aria-label of the button to the concatenated text content of all labels
        // FIXME: This is a workaround because we do not yet have access to `referenceTarget`
        this.button.setAttribute(
          'aria-labelledby',
          Array.from(this.internals.labels)
            .map(label => (label as HTMLLabelElement).id)
            .join(' ')
        );
      }
    });
  }

  override render(): TemplateResult {
    return html`
      <slot name="button"></slot>
      <sl-listbox
        ${anchor({
          element: this.button,
          offset: Select.offset,
          position: 'bottom-start',
          rootMarginTop: this.rootMarginTop,
          viewportMargin: Select.viewportMargin
        })}
        @beforetoggle=${this.#onBeforetoggle}
        @click=${this.#onListboxClick}
        @keydown=${this.#onListboxKeydown}
        @toggle=${this.#onToggle}
        part="listbox"
        popover
      >
        <slot @slotchange=${this.#onSlotchange}></slot>
      </sl-listbox>
    `;
  }

  override focus(options?: FocusOptions): void {
    this.button?.focus(options);
  }

  #onBeforetoggle({ newState }: ToggleEvent): void {
    if (newState === 'open') {
      this.button.setAttribute('aria-expanded', 'true');
      this.listbox!.style.width = `${this.button.getBoundingClientRect().width}px`;

      this.currentOption = this.selectedOption ?? this.options[0];
    } else {
      this.#popoverClosing = true;
      this.button.setAttribute('aria-expanded', 'false');
    }
  }

  #onButtonClick(): void {
    if (!this.listbox?.matches(':popover-open') && !this.#popoverClosing) {
      this.listbox?.showPopover();
    }

    this.#popoverClosing = false;
  }

  #onClear(): void {
    this.#setSelectedOption(undefined, true);
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.button.focus();
    }
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(event: FocusEvent): void {
    const leavingComponent =
      !event.relatedTarget ||
      (event.relatedTarget !== this.button &&
        (!(event.relatedTarget instanceof Element) || event.relatedTarget?.closest('sl-select') !== this));

    if (leavingComponent) {
      if (this.listbox?.matches(':popover-open')) {
        this.listbox.hidePopover();

        this.#popoverClosing = true;
      }

      this.blurEvent.emit();
      this.updateState({ touched: true });
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !this.listbox?.matches(':popover-open')) {
      event.preventDefault();
      event.stopPropagation();

      this.listbox?.showPopover();
    }
  }

  #onListboxClick(event: Event & { target: HTMLElement }): void {
    const option = event.target?.closest<Option<T>>('sl-option');

    if (option) {
      this.#setSelectedOption(option);
      this.listbox?.hidePopover();
    }
  }

  #onListboxKeydown(event: KeyboardEvent): void {
    if (event.target instanceof Option && [' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      this.#setSelectedOption(event.target);
      this.listbox?.hidePopover();
    }
  }

  #onSlotchange(): void {
    this.options.forEach(option => option.setAttribute('aria-selected', 'false'));

    if (this.value !== undefined) {
      this.#setSelectedOption(
        this.options.find(option => option.value === this.value),
        false
      );
    } else {
      this.#setSelectedOption(undefined, false);
    }

    this.optionGroups?.forEach(group => {
      group.classList.remove('bottom-divider');

      if (group.nextElementSibling?.nodeName === 'SL-OPTION') {
        group.classList.add('bottom-divider');
      }
    });
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.#rovingTabindexController.focus();
    } else if (event.newState === 'closed') {
      const activeElement = (this.getRootNode() as Document | ShadowRoot).activeElement;
      if (activeElement?.closest('sl-select') === this) {
        this.button.focus();
      }

      this.#popoverClosing = false;
    }
  }

  /** Returns a flattened array of all options (also the options in groups). */
  #getAllOptions(root: Element): Array<Option<T>> | Option<T> {
    if (root instanceof Option) {
      return root as Option<T>;
    } else if (root instanceof OptionGroup) {
      return Array.from(root.children).flatMap(child => this.#getAllOptions(child));
    } else {
      return [];
    }
  }

  #setSelectedOption(option?: Option<T>, emitEvent = true): void {
    if (this.selectedOption) {
      this.selectedOption.selected = false;
      this.selectedOption.setAttribute('aria-selected', 'false');
    }

    this.selectedOption = option;

    if (this.selectedOption) {
      this.selectedOption.selected = true;
      this.selectedOption.setAttribute('aria-selected', 'true');
    }

    this.button.selected = this.selectedOption;
    this.value = this.selectedOption?.value;

    if (emitEvent) {
      this.changeEvent.emit(this.value);
      this.updateState({ dirty: true });
    }

    this.#updateValueAndValidity();
  }

  #updateValueAndValidity(): void {
    this.internals.setFormValue(this.nativeFormValue);
    this.internals.setValidity(
      { valueMissing: this.required && !this.selectedOption },
      msg('Please choose an option from the list.')
    );

    this.updateValidity();
  }
}
