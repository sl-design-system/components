import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Listbox, Option, OptionGroup } from '@sl-design-system/listbox';
import {
  type EventEmitter,
  EventsController,
  type PathKeys,
  SelectionController,
  type SlSelectionChangeEvent,
  anchor,
  event,
  getStringByPath,
  getValueByPath
} from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { Tag, TagList } from '@sl-design-system/tag';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './combobox.scss.js';
import { CreateCustomOption } from './create-custom-option.js';
import { CustomOption } from './custom-option.js';
import { NoMatch } from './no-match.js';
import { SelectedGroup } from './selected-group.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox': Combobox;
  }
}

export type ComboboxOption = {
  id: string;
  element?: Option | HTMLOptionElement;
  content: string;
  current?: boolean;
  custom?: boolean;
  selected?: boolean;
  group?: string;
  value: unknown;
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Combobox<T = any, U = T> extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @internal The default offset of the popover to the input. */
  static offset = 6;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-combobox-create-custom-option': CreateCustomOption,
      'sl-combobox-custom-option': CustomOption,
      'sl-combobox-no-match': NoMatch,
      'sl-combobox-selected-group': SelectedGroup,
      'sl-icon': Icon,
      'sl-listbox': Listbox,
      'sl-option': Option,
      'sl-tag': Tag,
      'sl-tag-list': TagList,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the popover and the viewport. */
  static viewportMargin = 8;

  /** Event controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    'sl-selection-change': this.#onSelectionChange
  });

  /** Message element for when filtering results did not yield any results. */
  #noMatch?: NoMatch;

  /** Update the width of the popover while open. */
  #observer = new ResizeObserver(entries => {
    if (this.wrapper?.matches(':popover-open')) {
      this.wrapper.style.inlineSize = `${entries[0].contentRect.width}px`;
    }
  });

  /** The options to choose from. */
  #options: T[] = [];

  /** A map of options to DOM ids. */
  #optionElements: Map<T, string> = new Map();

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

  /** The group that contains all the selected options when `groupSelected` is set. */
  // #selectedGroup?: SelectedGroup;

  /** Manage the selected state of the options. */
  #selection = new SelectionController<T>(this);

  /** Flag to indicate when to use lit-virtualizer. */
  #useVirtualList = false;

  /** Will allow custom values not in the listbox when set. */
  @property({ type: Boolean, attribute: 'allow-custom-values' }) allowCustomValues?: boolean;

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
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<U | U[] | undefined>>;

  /** @internal The create custom option option (used when `allowCustomValues` is set). */
  @state() createCustomOption?: ComboboxOption;

  /** @internal The current highlighted option in the listbox. */
  @state() currentOption?: T;

  /** Whether the text field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** When set, will filter the results in the listbox based on user input. */
  @property({ type: Boolean, attribute: 'filter-results' }) filterResults?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** When set will group all the selected options at the top of the listbox. */
  @property({ type: Boolean, attribute: 'group-selected' }) groupSelected?: boolean;

  /** @internal The input element in the light DOM. */
  input!: HTMLInputElement;

  /** @internal The listbox containing the options. */
  @state() listbox?: Listbox<T>;

  /** Will allow the selection of multiple options if true. */
  @property({ type: Boolean }) multiple?: boolean;

  /** The path to use for the label of the option. */
  @property({ attribute: 'option-label-path' }) optionLabelPath?: PathKeys<T>;

  /** The path to use for the value of the option. */
  @property({ attribute: 'option-value-path' }) optionValuePath?: PathKeys<T>;

  get options(): T[] {
    return this.#options;
  }

  /**
   * There are 2 ways to provide options to the combobox:
   * 1. By using this `options` property to provide an array of options.
   * 2. By rendering a listbox element in the light DOM and populate it with `<sl-option>` elements.
   *
   * This options property is used to provide options when using the first method.
   */
  @property({ type: Array })
  set options(options: T[]) {
    this.#options = options;
    this.#useVirtualList = !!options;
  }

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /**
   * Whether the component is select only. This means you cannot type in the text field,
   * but you can still select options.
   */
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
  @property() override value?: U | U[];

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
    this.input.setAttribute('aria-autocomplete', this.autocomplete || 'both');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-haspopup', 'listbox');

    this.#events.listen(this.input, 'click', this.#onInputClick);
    this.#events.listen(this.input, 'focus', this.#onFocus);
    this.#events.listen(this.input, 'pointerdown', this.#onPointerDown);
    this.#events.listen(this.input, 'pointerup', this.#onPointerUp);

    this.#observer.observe(this);

    this.setFormControlElement(this.input);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('options') && this.options && this.#useVirtualList) {
      this.listbox ||= this.#renderListbox();
    }

    if (changes.has('optionLabelPath') && this.#useVirtualList) {
      this.listbox!.optionLabelPath = this.optionLabelPath;
    }

    if (changes.has('optionValuePath') && this.#useVirtualList) {
      this.listbox!.optionValuePath = this.optionValuePath;
    }

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

    if (changes.has('currentOption') || changes.has('groupSelected') || changes.has('listbox')) {
      // if (this.groupSelected && this.currentSelection.length) {
      //   if (!this.#selectedGroup) {
      //     this.#selectedGroup = this.shadowRoot!.createElement('sl-combobox-selected-group');
      //     this.#selectedGroup.addEventListener('click', this.#onOptionsClick);
      //   }
      //   this.#selectedGroup.currentOption = this.currentOption;
      //   this.#selectedGroup.hasGroups = !!this.listbox?.querySelector('sl-option-group');
      //   this.#selectedGroup.options = this.currentSelection;
      //   if (this.#selectedGroup.parentElement !== this.listbox) {
      //     this.listbox?.prepend(this.#selectedGroup);
      //   }
      // } else {
      //   this.#selectedGroup?.remove();
      //   this.#selectedGroup = undefined;
      // }
    }

    if (changes.has('disabled')) {
      this.input.disabled = !!this.disabled;
    }

    if (changes.has('multiple')) {
      this.#selection.multiple = !!this.multiple;
      this.#selection.selection.clear();

      if (this.multiple) {
        this.listbox?.setAttribute('aria-multiselectable', 'true');
      } else {
        this.listbox?.removeAttribute('aria-multiselectable');
      }
    }

    if (changes.has('required')) {
      this.input.required = !!this.required;

      this.updateValidity();
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
        @sl-form-control=${this.#onTextFieldFormControl}
        @sl-update-state=${this.#onTextFieldUpdateState}
        ?disabled=${this.disabled}
        ?readonly=${this.selectOnly}
        ?required=${this.required}
        placeholder=${ifDefined(this.multiple && this.#selection.selection.size ? undefined : this.placeholder)}
        size=${ifDefined(this.size)}
      >
        ${this.multiple && this.#selection.selection.size
          ? html`
              <sl-tag-list
                aria-label=${msg('Selected options')}
                size=${ifDefined(this.size)}
                slot="prefix"
                stacked
                .emphasis=${this.disabled ? 'bold' : 'subtle'}
              >
                ${repeat(
                  this.#selection.selection,
                  option => option,
                  option => html`
                    <sl-tag
                      @sl-remove=${() => this.#onRemove(option)}
                      ?disabled=${this.disabled}
                      ?removable=${!this.disabled}
                    >
                      ${option}
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

  override focus(options?: FocusOptions): void {
    this.input?.focus(options);
  }

  override getLocalizedValidationMessage(): string {
    if (this.validity.valueMissing) {
      return this.multiple ? msg('Please select at least one option.') : msg('Please select an option.');
    } else {
      return super.getLocalizedValidationMessage();
    }
  }

  #onBeforeToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.input.setAttribute('aria-expanded', 'true');
      this.wrapper!.style.inlineSize = `${this.getBoundingClientRect().width}px`;
    } else {
      this.input.setAttribute('aria-expanded', 'false');
      this.#popoverJustClosed = true;
    }
  }

  #onButtonClick(): void {
    // Prevents the popover from reopening immediately after it was just closed
    if (!this.#popoverJustClosed) {
      this.wrapper?.togglePopover();
    }
  }

  #onClick(event: Event): void {
    if (event.composedPath().find(el => el instanceof HTMLElement && el.matches('button[slot="suffix"]'))) {
      // If the user clicked the button, do nothing. The button click handler will handle it.
      return;
    }

    if (event.target === this) {
      this.input.focus();
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

    let currentOption: T | undefined = undefined;

    if (
      event.inputType !== 'deleteContentBackward' &&
      (this.autocomplete === 'inline' || this.autocomplete === 'both')
    ) {
      currentOption = this.options.find(option => {
        const label = getStringByPath(option, this.optionLabelPath!);

        return label.toString().toLowerCase().startsWith(value.toLowerCase());
      });

      if (currentOption) {
        const label = getStringByPath(currentOption, this.optionLabelPath!);

        this.input.value = label;
        this.input.setSelectionRange(value.length, label.length);
      }
    } else {
      currentOption = this.options.find(option => getValueByPath(option, this.optionValuePath!) === value);
    }

    // if (this.allowCustomValues && !currentOption) {
    //   if (value.length) {
    //     currentOption = {
    //       id: `sl-combobox-create-custom-option-${nextUniqueId++}`,
    //       content: value,
    //       current: false,
    //       selected: false,
    //       value
    //     };
    //   }

    //   this.#updateCreateCustomOption(currentOption);
    // }

    this.#updateCurrent(currentOption);
    this.#updateFilteredOptions(value);
    this.updateState({ dirty: true });
    this.updateValidity();
  }

  #onInputClick(): void {
    this.wrapper?.showPopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.allowCustomValues && this.currentOption === this.createCustomOption) {
      this.#addCustomOption(this.input.value);
    } else if (event.key === 'Enter' && this.currentOption) {
      this.#toggleSelected(this.currentOption);
      this.#updateFilteredOptions();
      this.#updateTextFieldValue();
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
        index = -1;

      // if (this.groupSelected && this.currentOption) {
      //   index = this.currentSelection.indexOf(this.currentOption);
      //   if (index === -1) {
      //     index = this.options.filter(o => !o.selected).indexOf(this.currentOption) + this.currentSelection.length;
      //   }
      // } else
      if (this.currentOption) {
        index = this.options.indexOf(this.currentOption);
      }

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

      const option = this.options[index];
      // if (this.groupSelected) {
      //   option =
      //     index < this.currentSelection.length
      //       ? this.currentSelection[index]
      //       : this.options.filter(o => !o.selected)[index - this.currentSelection.length];
      // }

      this.#updateCurrent(option);
    }
  }

  #onOptionsClick(event: Event): void {
    const optionElement = event.composedPath().find((el): el is Option => el instanceof Option);

    if (optionElement instanceof CreateCustomOption) {
      this.#addCustomOption(optionElement.value as string);
    } else if (optionElement instanceof CustomOption) {
      // this.#removeCustomOption(this.options.find(o => o.id === optionElement.id));
      this.#updateTextFieldValue();
    } else if (optionElement?.id) {
      const option = this.options.find(o => this.#isSameOption(o, optionElement));

      this.#toggleSelected(option);
      this.#updateFilteredOptions();
      this.#updateTextFieldValue();
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

  #onRemove(option: T): void {
    this.#toggleSelected(option, false);
    this.#updateValue();

    if (this.#popoverJustClosed) {
      this.wrapper?.showPopover();
    }
  }

  #onSelectionChange(event: SlSelectionChangeEvent<T>): void {
    const selection = event.detail.old;

    for (const option of selection) {
      if (!this.#selection.isSelected(option)) {
        this.#toggleSelected(option, false);
      }
    }

    if (!this.multiple) {
      this.#updateTextFieldValue();
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

  #onTextFieldFormControl(event: SlFormControlEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onTextFieldUpdateState(event: SlUpdateStateEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      if (!this.multiple && this.#selection.selection.size) {
        const option = Array.from(this.#selection.selection.values())[0],
          index = this.options.indexOf(option);

        this.listbox?.scrollToIndex(index, { block: 'nearest' });
      }
    } else {
      this.#popoverJustClosed = false;
    }
  }

  #addCustomOption(value: string): void {
    const element = this.shadowRoot!.createElement('sl-combobox-custom-option');
    element.id = `sl-combobox-custom-option-${nextUniqueId++}`;
    element.selected = true;
    element.textContent = value;
    element.value = value;
    this.listbox?.prepend(element);

    // const currentOption = {
    //   id: element.id,
    //   content: value,
    //   current: true,
    //   custom: true,
    //   element,
    //   selected: true,
    //   value
    // };

    this.#updateCreateCustomOption();
    // this.#updateCurrent(currentOption);
    this.#updateTextFieldValue();
    this.#updateValue();
  }

  // #removeCustomOption(option?: ComboboxOption): void {
  //   if (!option) {
  //     return;
  //   }

  //   option.element?.remove();
  // }

  #flattenOptions(el: Element): Array<Option<T>> {
    if (el instanceof Option) {
      return [el as Option<T>];
    } else if (el instanceof OptionGroup) {
      return Array.from(el.children).flatMap(child => this.#flattenOptions(child));
    } else if (el instanceof HTMLSlotElement) {
      return Array.from(el.assignedElements({ flatten: true })).flatMap(child => this.#flattenOptions(child));
    }

    return [];
  }

  #isSameOption(option: T, element?: Option<T>): boolean {
    if (!element) {
      return false;
    }

    const value = element.value ?? element.textContent.trim();

    return getValueByPath(option, this.optionValuePath!) === value;
  }

  #renderListbox(): Listbox<T> {
    const listbox = this.shadowRoot!.createElement('sl-listbox') as Listbox<T>;
    listbox.options = this.options;
    listbox.optionLabelPath = this.optionLabelPath;
    listbox.optionValuePath = this.optionValuePath;
    listbox.renderer = (option: T, index: number) => this.#renderOption(option, index) as unknown as TemplateResult;

    this.appendChild(listbox);

    return listbox;
  }

  #renderOption(option: T, index: number): HTMLElement {
    const element = this.shadowRoot!.createElement('sl-option'),
      itemString = typeof option === 'string' ? option : JSON.stringify(option);

    let id: string;
    if (this.#optionElements.has(option)) {
      id = this.#optionElements.get(option)!;
    } else {
      id = `sl-combobox-option-${nextUniqueId++}`;
      this.#optionElements.set(option, id);
    }

    element.id = id;
    element.selected = this.#selection.isSelected(option);
    element.setAttribute('aria-selected', element.selected.toString());
    element.setAttribute('index', index.toString());

    if (option === this.currentOption) {
      element.setAttribute('aria-current', 'true');
    }

    if (this.optionLabelPath) {
      const label = getValueByPath(option, this.optionLabelPath);

      element.textContent = typeof label === 'string' ? label : (label?.toString() ?? itemString);
      element.value = this.optionValuePath ? getValueByPath(option, this.optionValuePath) : option;
    } else {
      element.textContent = itemString;
      element.value = option;
    }

    return element;
  }

  #toggleSelected(option?: T, force?: boolean): void {
    if (!option) {
      return;
    }

    const selected = typeof force === 'boolean' ? force : !this.#selection.isSelected(option),
      element = this.querySelector(`#${this.#optionElements.get(option)}`) as Option<T>;

    if (selected) {
      this.#selection.select(option);
    } else {
      this.#selection.deselect(option);
    }

    if (element) {
      element.selected = selected;
      element.style.display = this.groupSelected && selected ? 'none' : '';
      element.setAttribute('aria-selected', Boolean(selected).toString());
    }
  }

  /** Updates the options to reflect the current one. */
  #updateCurrent(option?: T): void {
    if (this.currentOption) {
      this.input.removeAttribute('aria-activedescendant');
      this.listbox?.querySelector('[aria-current]')?.removeAttribute('aria-current');
    }

    this.currentOption = option;

    if (this.currentOption) {
      const index = this.options.indexOf(this.currentOption);

      this.listbox!.scrollToIndex(index, { block: 'nearest' });

      let element: Option | undefined;
      if (this.#useVirtualList) {
        element = this.listbox!.querySelector(`[index="${index}"]`) as Option;
      } else {
        element = this.listbox!.children.item(index) as Option;
      }

      if (element) {
        element.setAttribute('aria-current', 'true');

        this.input.setAttribute('aria-activedescendant', element.id);
      } else {
        this.input.setAttribute('aria-activedescendant', this.#optionElements.get(this.currentOption)!);
      }

      // Scroll to the selected group or the current option
      // if (this.groupSelected && this.currentSelection.includes(this.currentOption)) {
      //   this.#selectedGroup!.scrollIntoView({ block: 'nearest' });
      // } else {
      // this.currentOption.scrollIntoView({ block: 'nearest' });
      // }
    }
  }

  #updateCreateCustomOption(customOption?: ComboboxOption): void {
    if (this.createCustomOption && !customOption) {
      this.createCustomOption.element?.remove();
    } else if (this.createCustomOption && customOption) {
      customOption.element = this.createCustomOption.element;
    }

    this.createCustomOption = customOption;

    if (this.createCustomOption) {
      if (!this.createCustomOption?.element) {
        this.createCustomOption.element ||= this.shadowRoot!.createElement('sl-combobox-create-custom-option');
        this.listbox?.prepend(this.createCustomOption.element);
      }

      this.createCustomOption.element.value = this.createCustomOption?.value;
    }
  }

  #updateFilteredOptions(value?: string): void {
    let noMatch = true;

    this.options.forEach(option => {
      let match = !this.filterResults || !value;
      if (!match) {
        const label = getValueByPath(option, this.optionLabelPath!)?.toString() ?? '';

        match = label.toLowerCase().startsWith(value!.toLowerCase());
      }

      if (noMatch && match) {
        noMatch = false;
      }

      // if (option.element) {
      //   option.element.style.display = match ? '' : 'none';
      // }
    });

    if (noMatch && value) {
      this.#noMatch ||= this.shadowRoot!.createElement('sl-combobox-no-match');
      this.#noMatch.value = value;
      this.listbox?.prepend(this.#noMatch);
    } else {
      this.#noMatch?.remove();
      this.#noMatch = undefined;
    }
  }

  /** Updates the list of options and the listbox link with the text input. */
  #updateOptions(): void {
    this.listbox = this.wrapper?.assignedElements({ flatten: true }).find(el => el instanceof Listbox) as Listbox<T>;

    if (this.listbox) {
      this.listbox.id ||= `sl-combobox-listbox-${nextUniqueId++}`;
      this.input.setAttribute('aria-controls', this.listbox.id);

      if (this.multiple) {
        this.listbox.setAttribute('aria-multiselectable', 'true');
      } else {
        this.listbox.removeAttribute('aria-multiselectable');
      }

      if (!this.#useVirtualList) {
        this.#optionElements.clear();

        this.#options = Array.from(this.listbox.children)
          .flatMap(el => this.#flattenOptions(el))
          .filter(el => !(el instanceof CreateCustomOption))
          .map(el => {
            this.optionLabelPath ??= 'label' as PathKeys<T>;
            this.optionValuePath ??= 'value' as PathKeys<T>;

            const option = {
              [this.optionLabelPath || 'label']: el.textContent?.trim(),
              [this.optionValuePath || 'value']: el.value ?? el.textContent?.trim()
            } as T;

            el.id ||= `sl-combobox-option-${nextUniqueId++}`;
            this.#optionElements.set(option, el.id);

            // Ensure the option has an aria-selected attribute
            if (!el.hasAttribute('aria-selected')) {
              el.setAttribute('aria-selected', Boolean(el.selected).toString());
            }

            return option;
          });

        // Since we are internally updating the options array, request an update on it
        this.requestUpdate('options');
      }
    } else {
      this.#options = [];
      this.input.removeAttribute('aria-controls');
    }
  }

  /** Updates the selection based on the options & value. */
  #updateSelected(): void {
    if (!this.options) {
      return;
    }

    this.#selection.selection.clear();

    for (const option of this.options) {
      if (this.multiple && (this.value as U[])?.includes(getValueByPath(option, this.optionValuePath!) as U)) {
        this.#toggleSelected(option, true);
      } else if (getValueByPath(option, this.optionValuePath!) === this.value) {
        this.#toggleSelected(option, true);
      }
    }

    if (!this.multiple) {
      this.#updateTextFieldValue();
    }
  }

  /** Update the value in the text field. */
  #updateTextFieldValue(): void {
    if (this.multiple) {
      this.input.value = '';
    } else if (this.createCustomOption) {
      this.input.value = this.createCustomOption.content;
      this.input.setSelectionRange(-1, -1);
    } else if (this.#selection.selection.size) {
      const option = Array.from(this.#selection.selection.values())[0];

      this.input.value = getStringByPath(option, this.optionLabelPath!);
      this.input.setSelectionRange(-1, -1);
    } else {
      this.input.value = '';
    }
  }

  /** Updates the value based on the current selection. */
  #updateValue(): void {
    const values = Array.from(this.#selection.selection.values()).map(
      o => getValueByPath(o, this.optionValuePath!) as U
    );

    if (this.multiple) {
      this.value = values;
    } else {
      this.value = values.at(0);
    }

    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.updateValidity();
  }
}
