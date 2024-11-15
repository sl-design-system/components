import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Listbox, Option, OptionGroup } from '@sl-design-system/listbox';
import {
  type EventEmitter,
  EventsController,
  type Path,
  type PathKeys,
  SelectionController,
  type SlSelectionChangeEvent,
  anchor,
  event,
  getStringByPath,
  getValueByPath,
  setValueByPath
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComboboxOption<T = any, U = T> = {
  id: string;
  element?: Option;
  option: T;
  current?: boolean;
  group?: string;
  label: string;
  tagName: 'sl-option' | 'sl-combobox-create-custom-option' | 'sl-combobox-custom-option';
  value: U;
  visible: boolean;
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
  #options: Array<ComboboxOption<T, U>> = [];

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
  #selectedGroup?: SelectedGroup;

  /** Manage the selected state of the options. */
  #selection = new SelectionController<ComboboxOption<T, U>>(this);

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
  @state() createCustomOption?: ComboboxOption<T, U>;

  /** @internal The currently highlighted option in the listbox. */
  @state() currentOption?: ComboboxOption<T, U>;

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
  @state() listbox?: Listbox<ComboboxOption<T, U>>;

  /** Will allow the selection of multiple options if true. */
  @property({ type: Boolean }) multiple?: boolean;

  /** The path to use for the label of the option. */
  @property({ attribute: 'option-label-path' }) optionLabelPath?: PathKeys<T>;

  /** The path to use for the value of the option. */
  @property({ attribute: 'option-value-path' }) optionValuePath?: PathKeys<T>;

  /**
   * There are 2 ways to provide options to the combobox:
   * 1. By using this `options` property to provide an array of options.
   * 2. By rendering a listbox element in the light DOM and populate it with `<sl-option>` elements.
   *
   * This options property is used to provide options when using the first method.
   */
  @property({ type: Array }) options?: T[];

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

    if (changes.has('options') || changes.has('optionLabelPath') || changes.has('optionValuePath')) {
      if (this.options) {
        this.#options = this.options.map(option => {
          const label = this.optionLabelPath
            ? getStringByPath(option, this.optionLabelPath)
            : (option as unknown as { toString(): string }).toString();

          return {
            id: `sl-combobox-option-${nextUniqueId++}`,
            label,
            option,
            tagName: 'sl-option',
            value: (this.optionValuePath ? getValueByPath(option, this.optionValuePath) : label) as U,
            visible: true
          };
        });

        this.listbox?.remove();
        this.listbox = this.#renderListbox();
        this.#useVirtualList = true;
      } else if (changes.get('options')) {
        this.#options = [];
        this.#useVirtualList = false;
      }
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

    if (changes.has('groupSelected')) {
      if (this.#selectedGroup) {
        this.#selectedGroup.remove();
        this.#selectedGroup = undefined;
      } else {
        this.#selectedGroup = this.shadowRoot!.createElement('sl-combobox-selected-group');
        this.#selectedGroup.addEventListener('click', this.#onOptionsClick);
        this.listbox?.prepend(this.#selectedGroup);
      }

      // if (this.groupSelected && this.currentSelection.length) {
      //   if (!this.#selectedGroup) {
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

    if (changes.has('filterResults') && changes.get('filterResults') && !this.filterResults && this.#useVirtualList) {
      this.#options = this.#options.map(o => ({ ...o, visible: true }));
      this.listbox!.options = this.#options;
    }

    if (changes.has('multiple')) {
      this.#selection.multiple = !!this.multiple;

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
                      ${option.label}
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
      this.input.focus();
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

    let option: ComboboxOption<T, U> | undefined = undefined;

    if (
      event.inputType !== 'deleteContentBackward' &&
      (this.autocomplete === 'inline' || this.autocomplete === 'both')
    ) {
      option = this.#options.find(option => option.label.toLowerCase().startsWith(value.toLowerCase()));

      if (option) {
        this.input.value = option.label;
        this.input.setSelectionRange(value.length, option.label.length);
      }
    } else {
      option = this.#options.find(option => option.value === value);
    }

    if (this.allowCustomValues && !option) {
      this.#updateCreateCustomOption(value);
      this.#updateCurrent(this.createCustomOption);
    } else {
      this.#updateCurrent(option);
    }

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
    } else if (event.key === 'Enter' && this.currentOption?.tagName === 'sl-combobox-custom-option') {
      this.#removeCustomOption(this.currentOption);
      this.#updateTextFieldValue();
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

      // Limit navigation to the visible options
      const options = this.#options.filter(o => o.visible);

      let delta = 0,
        index = -1;

      // if (this.groupSelected && this.currentOption) {
      //   index = this.currentSelection.indexOf(this.currentOption);
      //   if (index === -1) {
      //     index = this.options.filter(o => !o.selected).indexOf(this.currentOption) + this.currentSelection.length;
      //   }
      // } else
      if (this.currentOption) {
        index = options.indexOf(this.currentOption);
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
          index = options.length - 1;
          break;
      }

      index = (index + delta + options.length) % options.length;

      const option = options[index];

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
      this.#removeCustomOption(this.#options.find(o => o.id === optionElement.id));
      this.#updateTextFieldValue();
    } else if (optionElement?.id) {
      const option = this.#options.find(o => o.id === optionElement.id);

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

  #onRemove(option: ComboboxOption<T, U>): void {
    this.#toggleSelected(option, false);
    this.#updateValue();

    if (this.#popoverJustClosed) {
      this.wrapper?.showPopover();
    }
  }

  #onSelectionChange(event: SlSelectionChangeEvent<ComboboxOption<T, U>>): void {
    const selection = event.detail.old;

    for (const option of selection) {
      if (!this.#selection.isSelected(option)) {
        this.#toggleSelected(option, false);
      }
    }

    if (this.#selectedGroup) {
      this.#selectedGroup.options = Array.from(this.#selection.selection.values());
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
        const option = Array.from(this.#selection.selection.values())[0];

        this.listbox?.scrollToIndex(this.#options.indexOf(option), { block: 'nearest' });
      }
    } else {
      this.#popoverJustClosed = false;
    }
  }

  #addCustomOption(value: string): void {
    let model: T | undefined = undefined;
    if (this.optionLabelPath) {
      model = {} as T;
      setValueByPath(model, this.optionLabelPath, value as Path<T, PathKeys<T>>);

      if (this.optionValuePath) {
        setValueByPath(model, this.optionValuePath, value as Path<T, PathKeys<T>>);
      }
    } else {
      model = value as unknown as T;
    }

    const option: ComboboxOption<T, U> = {
      id: `sl-combobox-custom-option-${nextUniqueId++}`,
      label: value,
      option: model,
      tagName: 'sl-combobox-custom-option',
      value: value as U,
      visible: true
    };

    this.#selection.select(option);
    this.#options = [option, ...this.#options];

    if (this.#useVirtualList) {
      this.listbox!.options = this.#options;
    } else {
      option.element ||= this.shadowRoot!.createElement('sl-combobox-custom-option');
      option.element.id = option.id;
      option.element.selected = true;
      option.element.textContent = value;
      option.element.value = value;

      if (!option.element.parentElement) {
        this.listbox?.prepend(option.element);
      }
    }

    this.#updateCreateCustomOption();
    this.#updateCurrent(option);
    this.#updateTextFieldValue();
    this.#updateValue();
  }

  #removeCustomOption(option?: ComboboxOption): void {
    if (!option) {
      return;
    }

    this.#options = this.#options.filter(o => o !== option);
    this.#selection.deselect(option);

    if (this.#useVirtualList) {
      this.listbox!.options = this.#options;
    } else {
      option.element?.remove();
    }
  }

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

  #renderListbox(): Listbox<ComboboxOption<T, U>> {
    const listbox = this.shadowRoot!.createElement('sl-listbox') as Listbox<ComboboxOption<T, U>>;
    listbox.options = this.#options;
    listbox.renderer = (option: ComboboxOption<T, U>) => this.#renderOption(option) as unknown as TemplateResult;

    this.appendChild(listbox);

    return listbox;
  }

  #renderOption(option: ComboboxOption<T, U>): HTMLElement | typeof nothing {
    const element = this.shadowRoot!.createElement(option.tagName) as Option;
    element.id = option.id;
    element.selected = this.#selection.isSelected(option);
    element.textContent = option.label;
    element.value = option.value;
    element.setAttribute('aria-selected', element.selected.toString());

    if (option.current) {
      element.setAttribute('aria-current', 'true');
    }

    option.element = element;

    return element;
  }

  #toggleSelected(option?: ComboboxOption<T, U>, force?: boolean): void {
    if (!option) {
      return;
    }

    const selected = typeof force === 'boolean' ? force : !this.#selection.isSelected(option);

    if (selected) {
      this.#selection.select(option);
    } else {
      this.#selection.deselect(option);
    }

    if (option.element) {
      option.element.selected = selected;
      option.element.style.display = this.groupSelected && selected ? 'none' : '';
      option.element.setAttribute('aria-selected', Boolean(selected).toString());
    }
  }

  #updateCreateCustomOption(labelAndValue?: string): void {
    if (labelAndValue) {
      let option: T | undefined;
      if (this.optionLabelPath) {
        option = {} as T;

        setValueByPath(option, this.optionLabelPath, labelAndValue as Path<T, PathKeys<T>>);

        if (this.optionValuePath) {
          setValueByPath(option, this.optionValuePath, labelAndValue as Path<T, PathKeys<T>>);
        }
      } else {
        option = labelAndValue as unknown as T;
      }

      this.createCustomOption ||= {
        id: `sl-combobox-create-custom-option-${nextUniqueId++}`,
        label: labelAndValue,
        option,
        tagName: 'sl-combobox-create-custom-option',
        value: labelAndValue as U,
        visible: true
      };

      if (this.#options.at(0) !== this.createCustomOption) {
        this.#options = [this.createCustomOption, ...this.#options];
      }

      if (this.#useVirtualList) {
        this.listbox!.options = this.#options;
      } else {
        this.createCustomOption.element ||= this.shadowRoot!.createElement('sl-combobox-create-custom-option');
        this.createCustomOption.element.id = this.createCustomOption.id;

        if (!this.createCustomOption.element.parentElement) {
          this.listbox?.prepend(this.createCustomOption.element);
        }
      }

      // Set or update the textContent and value of the custom option
      if (this.createCustomOption.element) {
        this.createCustomOption.element.textContent = labelAndValue;
        this.createCustomOption.element.value = labelAndValue;
      }
    } else if (this.createCustomOption) {
      this.#options = this.#options.filter(o => o !== this.createCustomOption);

      if (this.#useVirtualList) {
        this.listbox!.options = this.#options;
      } else {
        this.createCustomOption.element?.remove();
      }

      this.createCustomOption = undefined;
    }
  }

  /** Updates the options to reflect the current one. */
  #updateCurrent(option?: ComboboxOption<T, U>): void {
    if (this.currentOption) {
      this.currentOption.current = false;
      this.input.removeAttribute('aria-activedescendant');
      this.listbox?.querySelector('[aria-current]')?.removeAttribute('aria-current');
    }

    this.currentOption = option;

    if (this.currentOption) {
      this.currentOption.current = true;

      this.input.setAttribute('aria-activedescendant', this.currentOption.id);

      if (this.currentOption.element) {
        this.currentOption.element.setAttribute('aria-current', 'true');
        this.currentOption.element.scrollIntoView({ block: 'nearest' });
      } else {
        this.listbox?.scrollToIndex(this.#options.indexOf(this.currentOption), { block: 'nearest' });
      }

      // Scroll to the selected group or the current option
      // if (this.groupSelected && this.currentSelection.includes(this.currentOption)) {
      //   this.#selectedGroup!.scrollIntoView({ block: 'nearest' });
      // } else {
      // this.currentOption.scrollIntoView({ block: 'nearest' });
      // }
    }
  }

  #updateFilteredOptions(value?: string): void {
    if (!this.filterResults) {
      return;
    }

    let noMatch = true;

    this.#options.forEach(option => {
      let match = !value;
      if (!match) {
        match = option.label.toLowerCase().startsWith(value!.toLowerCase());
      }

      if (noMatch && match) {
        noMatch = false;
      }

      option.visible = match;

      if (!this.#useVirtualList) {
        option.element!.style.display = match ? '' : 'none';
      }
    });

    if (this.#useVirtualList) {
      this.listbox!.options = this.#options.filter(o => o.visible);
    }

    // Scroll the first item into view. Workaround for https://github.com/lit/lit/issues/4833
    this.listbox?.scrollToIndex(0);

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
    this.listbox = this.wrapper?.assignedElements({ flatten: true }).find(el => el instanceof Listbox) as Listbox<
      ComboboxOption<T, U>
    >;

    if (this.listbox) {
      this.listbox.id ||= `sl-combobox-listbox-${nextUniqueId++}`;
      this.input.setAttribute('aria-controls', this.listbox.id);

      if (this.multiple) {
        this.listbox.setAttribute('aria-multiselectable', 'true');
      } else {
        this.listbox.removeAttribute('aria-multiselectable');
      }

      if (this.#useVirtualList) {
        this.listbox.options = this.#options;
      } else {
        let hasSelected = false;

        this.#selection.selection.clear();

        this.#options = Array.from(this.listbox.children)
          .flatMap(el => this.#flattenOptions(el))
          .filter(el => !(el instanceof CreateCustomOption))
          .map(el => {
            el.id ||= `sl-combobox-option-${nextUniqueId++}`;

            this.optionLabelPath ??= 'label' as PathKeys<T>;
            this.optionValuePath ??= 'value' as PathKeys<T>;

            const label = el.textContent?.trim(),
              value = (el.value ?? label) as U,
              group = el.closest('sl-option-group')?.label || undefined;

            const option: ComboboxOption<T, U> = {
              id: el.id,
              element: el,
              group,
              label,
              option: {
                [this.optionLabelPath || 'label']: label,
                [this.optionValuePath || 'value']: value
              } as T,
              tagName: 'sl-option',
              value,
              visible: true
            };

            if (el.selected) {
              hasSelected = true;
              this.#selection.select(option);
            }

            // Ensure the option has an aria-selected attribute
            if (!el.hasAttribute('aria-selected')) {
              el.setAttribute('aria-selected', Boolean(el.selected).toString());
            }

            return option;
          });

        // The selected option can be set either via:
        // - The `value` property -> call `#updateSelected`
        // - The `selected` attribute on the option -> call `#updateValue`
        if (hasSelected) {
          this.#updateValue();
        } else {
          this.#updateSelected();
        }

        if (this.#selectedGroup) {
          if (!this.#selectedGroup?.parentElement) {
            this.listbox?.prepend(this.#selectedGroup);
          }

          this.#selectedGroup.hasGroups = !!this.listbox.querySelector('sl-option-group');
          this.#selectedGroup.options = Array.from(this.#selection.selection.values());
        }
      }
    } else {
      this.#options = [];
      this.input.removeAttribute('aria-controls');
    }
  }

  /** Updates the selection based on the options & value. */
  #updateSelected(): void {
    this.#selection.selection.clear();

    for (const option of this.#options) {
      if (this.multiple && (this.value as U[])?.includes(option.value)) {
        this.#toggleSelected(option, true);
      } else if (option.value === this.value) {
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
      this.input.value = this.createCustomOption.value as string;
      this.input.setSelectionRange(-1, -1);
    } else if (this.#selection.selection.size) {
      const option = Array.from(this.#selection.selection.values())[0];

      this.input.value = option.label;
      this.input.setSelectionRange(-1, -1);
    } else {
      this.input.value = '';
    }
  }

  /** Updates the value based on the current selection. */
  #updateValue(): void {
    const values = Array.from(this.#selection.selection.values()).map(o => o.value);

    this.value = this.multiple ? values : values.at(0);
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.updateValidity();
  }
}
