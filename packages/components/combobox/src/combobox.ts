import { LOCALE_STATUS_EVENT, localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { type EventEmitter, EventsController, anchor, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { Tag, TagList } from '@sl-design-system/tag';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './combobox.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox': Combobox;
  }
}

export type ComboboxOption = {
  id: string;
  element: Option;
  content: string;
  current: boolean;
  selected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export type ComboboxSize = 'md' | 'lg';

let nextUniqueId = 0;

/**
 * Component for selecting one or more options from a list, similar to a native `<select>` element
 * but with the ability to search and filter options.
 *
 * @slot default - The input field
 * @slot options - Contains the listbox with options
 */
@localized()
export class Combobox<T = unknown> extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static formAssociated = true;

  /** @internal The default offset of the popover to the input. */
  static offset = 6;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-tag': Tag,
      'sl-tag-list': TagList,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the popover and the viewport. */
  static viewportMargin = 8;

  /** Event controller. */
  #events = new EventsController(this);

  /** Monitor the DOM for new options. */
  #observer = new MutationObserver(() => this.#updateOptions());

  /**
   * Flag indicating whether pointerdown event has happened. We need to know this so
   * we know if we need to show the popover when the input receives focus. If pointerdown
   * has happened, we know that the input is being focused as a result of a click, and we
   * will show the popover in the click event handler, not the focus event handler.
   */
  #pointerDown = false;

  /**
   * Flag indicating whether the popover was just closed. We need to know this so we can
   * properly handle button clicks that close the popover. If the popover was just closed,
   * we don't want to show it again when the button click event fires.
   */
  #popoverJustClosed = false;

  /**
   * The behavior of the combobox when it comes to suggesting options based on user input.
   * - 'off': Suggest is off
   * - 'inline': Only suggest options inside the input
   * - 'list': Filter options in the list based on user input
   * - 'both': Use both inline and list suggestions
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-autocomplete
   */
  @property() autocomplete?: 'off' | 'inline' | 'list' | 'both' = 'both';

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | T[] | undefined>>;

  /** @internal The current highlighted option in the listbox. */
  currentOption?: ComboboxOption;

  /** @internal The current selected options. */
  @state() currentSelection: ComboboxOption[] = [];

  /** Whether the text field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** When set, will filter the results in the listbox based on user input. */
  @property({ type: Boolean, attribute: 'filter-results' }) filterResults?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal The input element in the light DOM. */
  input!: HTMLInputElement;

  /** @internal Element internals. */
  readonly internals = this.attachInternals();

  /** @internal The listbox containing the options. */
  @state() listbox?: Element;

  /** Will allow the selection of multiple options if true. */
  @property({ type: Boolean }) multiple?: boolean;

  /** @internal The options to choose from. */
  @state() options: ComboboxOption[] = [];

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether you can interact with the input or if it is just a static, readonly display. */
  @property({ type: Boolean, reflect: true, attribute: 'select-only' }) selectOnly?: boolean;

  /** Whether the text field is a required field. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /** The size of the combobox. */
  @property({ reflect: true }) size?: ComboboxSize;

  /**
   * The value of the combobox. If `multiple` selection is enabled, then this
   * will be an array of values. Otherwise, it will be a single value.
   */
  @property() override value?: T | T[];

  /** @internal The wrapper element that is also the popover. */
  @query('[part="wrapper"]') wrapper?: HTMLSlotElement;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.autocomplete = 'off';
      this.input.slot = 'input';

      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }

    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-autocomplete', 'both');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-haspopup', 'listbox');

    this.#events.listen(this.input, 'click', this.#onInputClick);
    this.#events.listen(this.input, 'focus', this.#onFocus);
    this.#events.listen(this.input, 'pointerdown', this.#onPointerDown);
    this.#events.listen(this.input, 'pointerup', this.#onPointerUp);

    this.#observer.observe(this, { childList: true, subtree: true });

    this.setFormControlElement(this);

    // Listen for i18n updates and update the validation message
    this.#events.listen(window, LOCALE_STATUS_EVENT, this.#updateValidity);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('options') || changes.has('value')) {
      this.#updateSelected();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('autocomplete')) {
      this.input.setAttribute('aria-autocomplete', this.autocomplete || 'both');
    }

    if (changes.has('autocomplete') || changes.has('selectOnly')) {
      this.input.readOnly = this.selectOnly ?? this.autocomplete === 'off';
    }

    if (changes.has('disabled')) {
      this.input.disabled = !!this.disabled;
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';

      this.#updateValidity();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-text-field
        @input=${this.#onInput}
        @keydown=${this.#onKeydown}
        @sl-blur=${this.#onTextFieldBlur}
        @sl-change=${this.#onTextFieldChange}
        @sl-focus=${this.#onTextFieldFocus}
        @sl-update-state=${this.#onTextFieldUpdateState}
        ?disabled=${this.disabled}
        ?readonly=${this.selectOnly}
        ?required=${this.required}
        placeholder=${ifDefined(this.placeholder)}
        size=${ifDefined(this.size)}
      >
        ${this.multiple && this.currentSelection.length
          ? html`
              <sl-tag-list
                size=${ifDefined(this.size)}
                slot="prefix"
                stacked
                .emphasis=${this.disabled ? 'bold' : 'subtle'}
              >
                ${this.currentSelection.map(
                  option => html`
                    <sl-tag
                      @sl-remove=${() => this.#onRemove(option)}
                      ?disabled=${this.disabled}
                      ?removable=${!this.disabled}
                    >
                      ${option.content}
                    </sl-tag>
                  `
                )}
              </sl-tag-list>
            `
          : nothing}
        <slot name="input" slot="input"></slot>
        <button
          @click=${this.#onButtonClick}
          ?disabled=${this.disabled}
          aria-label=${msg(str`${this.listbox?.matches(':popover-open') ? 'Hide' : 'Show'} the options`)}
          slot="suffix"
          tabindex="-1"
        >
          <sl-icon name="chevron-down"></sl-icon>
        </button>
      </sl-text-field>

      <slot
        ${anchor({
          element: this,
          offset: Combobox.offset,
          position: 'bottom-start',
          viewportMargin: Combobox.viewportMargin
        })}
        @beforetoggle=${this.#onBeforeToggle}
        @click=${this.#onOptionsClick}
        @slotchange=${() => this.#updateOptions()}
        @toggle=${this.#onToggle}
        part="wrapper"
        popover
        tabindex="-1"
      ></slot>
    `;
  }

  #onBeforeToggle(event: ToggleEvent): void {
    this.input.setAttribute('aria-expanded', event.newState === 'open' ? 'true' : 'false');

    if (event.newState === 'open') {
      this.wrapper!.style.inlineSize = `${this.getBoundingClientRect().width}px`;
    } else {
      this.#popoverJustClosed = true;
    }
  }

  #onButtonClick(): void {
    if (!this.#popoverJustClosed) {
      this.wrapper?.showPopover();
    }
  }

  #onFocus(): void {
    if (!this.#pointerDown) {
      this.wrapper?.showPopover();
    }
  }

  #onInput(event: InputEvent): void {
    const value = this.input.value;

    this.wrapper?.showPopover();

    let currentOption: ComboboxOption | undefined = undefined;
    if (
      event.inputType !== 'deleteContentBackward' &&
      (this.autocomplete === 'inline' || this.autocomplete === 'both')
    ) {
      currentOption = this.options.find(option => option.content.toLowerCase().startsWith(value.toLowerCase()));

      if (currentOption) {
        this.input.value = currentOption.content;
        this.input.setSelectionRange(value.length, currentOption.content.length);
      }
    } else {
      currentOption = this.options.find(option => value === option.value);
    }

    this.#updateCurrent(currentOption);
    this.#updateFilteredOptions(value);

    this.updateState({ dirty: true });
    this.updateValidity();
  }

  #onInputClick(): void {
    this.wrapper?.showPopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.currentOption) {
      this.#toggleSelected(this.currentOption);
      this.#updateSelection(this.currentOption);
      this.#updateFilteredOptions();
      this.#updateValue();

      if (!this.multiple) {
        this.wrapper?.hidePopover();
      }
    } else if (!this.wrapper?.matches(':popover-open') && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      this.wrapper?.showPopover();
    } else if (['ArrowDown', 'ArrowUp', 'End', 'Home'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      let delta = 0,
        index = this.currentOption ? this.options.indexOf(this.currentOption) : -1;
      switch (event.key) {
        case 'ArrowDown':
          delta = 1;
          break;
        case 'ArrowUp':
          delta = -1;
          break;
        case 'Home':
          index = 0;
          break;
        case 'End':
          index = this.options.length - 1;
          break;
      }

      index = (index + delta + this.options.length) % this.options.length;
      this.#updateCurrent(this.options[index]);
    }
  }

  #onOptionsClick(event: Event): void {
    const optionElement = event.composedPath().find((el): el is Option => el instanceof Option);

    if (optionElement?.id) {
      const option = this.options.find(o => o.id === optionElement.id);

      this.#toggleSelected(option);
      this.#updateSelection(option);
      this.#updateFilteredOptions();
      this.#updateValue();

      if (!this.multiple) {
        this.wrapper?.hidePopover();
      }
    }
  }

  #onPointerDown(): void {
    this.#pointerDown = true;
  }

  #onPointerUp(): void {
    this.#pointerDown = false;
  }

  #onRemove(option: ComboboxOption): void {
    this.#toggleSelected(option, false);
    this.#updateSelection(option);
    this.#updateValue();

    if (this.#popoverJustClosed) {
      this.wrapper?.showPopover();
    }
  }

  #onTextFieldBlur(event: SlBlurEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onTextFieldChange(event: SlChangeEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onTextFieldFocus(event: SlFocusEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.focusEvent.emit();
  }

  #onTextFieldUpdateState(event: SlUpdateStateEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverJustClosed = false;
    }
  }

  #toggleSelected(option?: ComboboxOption, force?: boolean): void {
    if (!option) {
      return;
    }

    const selected = typeof force === 'boolean' ? force : !option.selected;

    option.selected = selected;
    option.element.selected = selected;

    if (selected) {
      option.element.setAttribute('aria-selected', 'true');
    } else {
      option.element.removeAttribute('aria-selected');
    }
  }

  /** Updates the options to reflect the current one. */
  #updateCurrent(option?: ComboboxOption): void {
    if (this.currentOption) {
      this.currentOption.current = false;
      this.currentOption.element.removeAttribute('aria-current');

      this.input.removeAttribute('aria-activedescendant');
    }

    this.currentOption = option;

    if (this.currentOption) {
      this.currentOption.current = true;
      this.currentOption.element.setAttribute('aria-current', 'true');
      this.currentOption.element.scrollIntoView({ block: 'nearest' });

      this.input.setAttribute('aria-activedescendant', this.currentOption.id);
    }
  }

  #updateFilteredOptions(value?: string): void {
    this.options.forEach(option => {
      let match = !this.filterResults || !value;
      if (!match) {
        match = option.content.toLowerCase().startsWith(value!.toLowerCase());
      }

      option.element.style.display = match ? '' : 'none';
    });
  }

  /** Updates the list of options and the listbox link with the text input. */
  #updateOptions(): void {
    this.listbox = this.wrapper?.assignedElements({ flatten: true })?.at(0);

    if (this.listbox) {
      this.listbox.id ||= `sl-combobox-listbox-${nextUniqueId++}`;
      this.listbox.setAttribute('role', 'listbox');

      this.input.setAttribute('aria-controls', this.listbox.id);

      this.options = Array.from(this.listbox.children)
        .filter((el): el is Option => el instanceof Option)
        .map(el => {
          el.id ||= `sl-combobox-option-${nextUniqueId++}`;

          return {
            id: el.id,
            element: el,
            content: el.textContent?.trim() || '',
            current: el.getAttribute('aria-current') === 'true',
            selected: el.getAttribute('aria-selected') === 'true',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value: el.value || el.textContent?.trim() || ''
          };
        });
    } else {
      this.input.removeAttribute('aria-controls');
      this.options = [];
    }
  }

  /** Updates the state of the options to reflect the current value. */
  #updateSelected(): void {
    // Clear all selected options
    this.options.filter(o => o.selected).forEach(o => this.#toggleSelected(o, false));

    if (this.multiple) {
      const values = Array.isArray(this.value) ? this.value : [this.value];

      this.options.filter(o => values.includes(o.value as T)).forEach(o => this.#toggleSelected(o, true));

      this.#updateSelection();
    } else {
      const option = this.options.find(o => o.value === this.value);
      if (option) {
        this.#toggleSelected(option, true);

        this.#updateCurrent(option);
        this.#updateSelection(option);
        this.#updateTextFieldValue();
      }
    }
  }

  /** Updates the selection based on the `selected` property of the options. */
  #updateSelection(option?: ComboboxOption): void {
    let selection: ComboboxOption[] = [];
    if (this.multiple) {
      selection = this.options.filter(o => o.selected);
    } else {
      selection = option?.selected ? [option] : [];
    }

    this.currentSelection.filter(o => !selection.includes(o)).forEach(o => this.#toggleSelected(o, false));
    this.currentSelection = selection;
    this.currentSelection.forEach(o => this.#toggleSelected(o, true));
  }

  /** Update the value in the text field. */
  #updateTextFieldValue(): void {
    if (this.multiple) {
      this.input.value = '';
    } else {
      this.input.value = this.currentSelection.at(0)?.content || '';
      this.input.setSelectionRange(-1, -1);
    }
  }

  #updateValidity(): void {
    if (this.multiple) {
      this.internals.setValidity(
        { valueMissing: this.required && !!(this.value as T[]).length },
        msg('Please select at least one option.')
      );
    } else {
      this.internals.setValidity({ valueMissing: this.required && !this.value }, msg('Please select an option.'));
    }

    this.updateValidity();
  }

  /** Updates the value based on the current selection. */
  #updateValue(): void {
    if (this.multiple) {
      this.value = this.currentSelection.map(o => o.value as T) as unknown as T;
    } else {
      this.value = this.currentSelection.at(0)?.value as T;
    }

    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.#updateValidity();
  }
}
