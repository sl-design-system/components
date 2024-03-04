import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import type { EventEmitter } from '@sl-design-system/shared';
import { EventsController, anchor, event, isPopoverOpen } from '@sl-design-system/shared';
import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { LitElement, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { SelectOption } from './select-option.js';
import { SelectOptionGroup } from './select-option-group.js';
import styles from './select.scss.js';
import { SelectButton } from './select-button.js';

export type SelectSize = 'md' | 'lg';

/**
 * @slot default - Place for `sl-select-option` elements
 * */
@localized()
export class Select<T = unknown> extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** The default offset of the listbox to the button. */
  static offset = 6;

  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-select-button': SelectButton
    };
  }

  /** @private */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The default margin between the tooltip and the viewport. */
  static viewportMargin = 8;

  /** Events controller. */
  #events = new EventsController(this, {
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** The initial state when the form was associated with the select. Used to reset the select. */
  #initialState?: T;

  /** Since we can't use `popovertarget`, we need to monitor the closing state manually. */
  #popoverClosing = false;

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** The button in the light DOM. */
  button!: SelectButton;

  /** Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<void>;

  /** Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<T | undefined>;

  /** Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<void>;

  /** @private */
  @queryAssignedElements({ selector: 'sl-select-option-group', flatten: false }) optionGroups?: SelectOptionGroup[];

  /** @private A flattened array of all options (even grouped ones). */
  get options(): Array<SelectOption<T>> {
    const elements =
      this.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])')?.assignedElements({ flatten: true }) ?? [];

    return elements.flatMap(element => this.#getAllOptions(element));
  }

  /**
   * The current option in the listbox. This is the option that will become the
   * selected option if the user presses Enter/Space.
   * @private
   */
  @state() currentOption?: SelectOption<T>;

  /** Whether the select is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** The listbox element. */
  @query('[popover]') listbox!: HTMLElement;

  /** The placeholder text to show when no option is chosen. */
  @property() placeholder?: string;

  /** Whether the select is a required field. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** @private The selected option in the listbox. */
  @state() selectedOption?: SelectOption<T>;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /** The size of the select. */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** The value for the select, to be used in forms. */
  @property() override value?: T;

  override connectedCallback(): void {
    super.connectedCallback();

    // This is a workaround because `ariaActiveDescendantElement` is only supported in
    // Safari at the time of writing. By putting the button in the light DOM, we can use
    // the aria-activedescendant attribute on the button itself.
    if (!this.button) {
      this.button = this.shadowRoot?.createElement('sl-select-button') as SelectButton;
      this.button.addEventListener('click', () => this.#onButtonClick());
      this.button.addEventListener('keydown', (event: KeyboardEvent) => this.#onKeydown(event));
      this.button.disabled = !!this.disabled;
      this.button.placeholder = this.placeholder;
      this.button.size = this.size;
      this.append(this.button);

      // This is a workaround because `::slotted` does not allow you to select children
      // of the slotted elements. For example grouped options.
      const style = document.createElement('style');
      style.innerHTML = `
        sl-select:has(sl-select-button:focus-visible) .sl-current {
          background-color: var(--sl-color-select-item-hover-background);
        }
      `;
      this.append(style);
    }

    this.setFormControlElement(this);

    // Listen for i18n updates and update the validation message
    this.#events.listen(window, LOCALE_STATUS_EVENT, this.#updateValueAndValidity);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
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

    if (changes.has('currentOption')) {
      this.options.forEach(option => option.classList.toggle('sl-current', option === this.currentOption));
      this.currentOption?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

      if (this.currentOption) {
        this.button.setAttribute('aria-activedescendant', this.currentOption.id);
      } else {
        this.button.removeAttribute('aria-activedescendant');
      }
    }

    if (changes.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
      this.button.disabled = this.disabled;
    }

    if (changes.has('placeholder')) {
      this.button.placeholder = this.placeholder;
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';

      this.#updateValueAndValidity();
    }

    if (changes.has('showValidity')) {
      this.button.showValidity = this.showValidity;
    }

    if (changes.has('size')) {
      this.button.size = this.size;
      this.options?.forEach(option => (option.size = this.size));
      this.optionGroups?.forEach(group => (group.size = this.size));
    }

    if (changes.has('value')) {
      this.options.forEach(option => (option.selected = option.value === this.value));
      this.button.selected = this.options.find(option => option.selected);
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="button"></slot>
      <div
        ${anchor({
          element: this.button,
          offset: Select.offset,
          position: 'bottom-start',
          viewportMargin: Select.viewportMargin
        })}
        @beforetoggle=${this.#onBeforetoggle}
        @click=${this.#onListboxClick}
        @toggle=${this.#onToggle}
        part="listbox"
        popover
        role="listbox"
      >
        <slot @slotchange=${this.#onSlotchange}></slot>
      </div>
    `;
  }

  #onBeforetoggle({ newState }: ToggleEvent): void {
    if (newState === 'open') {
      this.button.setAttribute('aria-expanded', 'true');
      this.listbox.style.width = `${this.button.getBoundingClientRect().width}px`;

      this.currentOption = this.selectedOption ?? this.options[0];
    } else {
      this.#popoverClosing = true;
      this.button.removeAttribute('aria-expanded');
    }
  }

  #onButtonClick(): void {
    if (!isPopoverOpen(this.listbox) && !this.#popoverClosing) {
      this.listbox.showPopover();
    }

    this.#popoverClosing = false;
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
  }

  #onKeydown(event: KeyboardEvent): void {
    const options = this.options.filter(o => !o.disabled),
      size = options.length;

    let delta = 0,
      index = options.indexOf(this.currentOption ?? this.selectedOption ?? this.options[0]);

    switch (event.key) {
      case 'ArrowDown':
        if (isPopoverOpen(this.listbox)) {
          delta = 1;
        } else {
          this.listbox.showPopover();
        }
        break;
      case 'ArrowUp':
        delta = -1;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = size - 1;
        break;
      case ' ':
      case 'Enter':
        if (isPopoverOpen(this.listbox)) {
          this.#setSelectedOption(this.currentOption);
          this.listbox.hidePopover();
        } else {
          this.listbox.showPopover();
        }

        return;
      default:
        return;
    }

    index = (index + delta + size) % size;
    this.currentOption = options[index];

    event.preventDefault();
    event.stopPropagation();
  }

  #onListboxClick(event: Event & { target: HTMLElement }): void {
    const option = event.target?.closest<SelectOption<T>>('sl-select-option');

    if (option) {
      this.#setSelectedOption(option);
      this.listbox.hidePopover();
    }
  }

  #onSlotchange(): void {
    this.#setSelectedOption(this.options.find(option => option.value === this.value));

    this.optionGroups?.forEach(group => {
      group.size = this.size;
      group.classList.remove('bottom-divider');

      if (group.nextElementSibling?.nodeName === 'SL-SELECT-OPTION') {
        group.classList.add('bottom-divider');
      }
    });

    this.options?.forEach(option => (option.size = this.size));
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverClosing = false;
    }
  }

  /** Returns a flattened array of all options (also the options in groups). */
  #getAllOptions(root: Element): Array<SelectOption<T>> {
    if (root instanceof SelectOption) {
      return [root];
    } else if (root instanceof SelectOptionGroup) {
      return Array.from(root.children).flatMap(child => this.#getAllOptions(child));
    } else {
      return [];
    }
  }

  #setSelectedOption(option?: SelectOption<T>, emitEvent = true): void {
    if (this.selectedOption) {
      this.selectedOption.selected = false;
    }

    this.selectedOption = option;
    if (this.selectedOption) {
      this.selectedOption.selected = true;
    }

    this.button.selected = this.selectedOption;
    this.value = this.selectedOption?.value;

    if (emitEvent) {
      this.changeEvent.emit(this.value);
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

    // NOTE: for some reason setting `showValidity` to `undefined` in the
    // `updateValidity()` method doesn't trigger a `willUpdate` call. So we
    // work around that by updating it here.
    this.button.showValidity = this.showValidity;
  }
}
