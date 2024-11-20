import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Listbox, type ListboxItem, Option, OptionGroup, OptionGroupHeader } from '@sl-design-system/listbox';
import {
  type EventEmitter,
  EventsController,
  type Path,
  type PathKeys,
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
import { GroupedOption } from './grouped-option.js';
import { NoMatch } from './no-match.js';
import { SelectedGroup } from './selected-group.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox': Combobox;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComboboxItem<T = any, U = T> = ListboxItem<T, U> & {
  element?: Option | OptionGroupHeader;
  current?: boolean;
  custom?: boolean;
  group?: string;
  option?: T;
  selected?: boolean;
  type: 'option' | 'group';
  value?: U;
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
      'sl-combobox-grouped-option': GroupedOption,
      'sl-combobox-no-match': NoMatch,
      'sl-combobox-selected-group': SelectedGroup,
      'sl-icon': Icon,
      'sl-listbox': Listbox,
      'sl-option': Option,
      'sl-option-group-header': OptionGroupHeader,
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
  #events = new EventsController(this, { click: this.#onClick });

  /** Message element for when filtering results did not yield any results. */
  #noMatch?: NoMatch;

  /** Update the width of the popover while open. */
  #observer = new ResizeObserver(entries => {
    if (this.wrapper?.matches(':popover-open')) {
      this.wrapper.style.inlineSize = `${entries[0].contentRect.width}px`;
    }
  });

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
  @state() createCustomOption?: ComboboxItem<T, U>;

  /** @internal The currently highlighted option in the listbox. */
  @state() currentItem?: ComboboxItem<T, U>;

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

  /** @internal The items rendered dynamically rendered by the listbox. */
  @state() items: Array<ComboboxItem<T, U>> = [];

  /** @internal The listbox containing the options. */
  @state() listbox?: Listbox<ComboboxItem<T, U>>;

  /** Will allow the selection of multiple options if true. */
  @property({ type: Boolean }) multiple?: boolean;

  /** The path to use for grouping the options. */
  @property({ attribute: 'option-group-path' }) optionGroupPath?: PathKeys<T>;

  /** The path to use for the label of the option. */
  @property({ attribute: 'option-label-path' }) optionLabelPath?: PathKeys<T>;

  /** The path to use for the selected state of the option. */
  @property({ attribute: 'option-selected-path' }) optionSelectedPath?: PathKeys<T>;

  /** The path to use for the value of the option. */
  @property({ attribute: 'option-value-path' }) optionValuePath?: PathKeys<T>;

  /**
   * There are 2 ways to provide options to the combobox:
   * 1. By using this `options` property to provide an array of options.
   * 2. By rendering a listbox element in the light DOM and populate it with `<sl-option>` elements.
   *
   * This options property is used to provide options for the first method.
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

  /** @internal The selected items. */
  @state() selectedItems: Array<ComboboxItem<T, U>> = [];

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

    if (changes.has('multiple')) {
      if (this.multiple) {
        this.listbox?.setAttribute('aria-multiselectable', 'true');
      } else {
        this.listbox?.removeAttribute('aria-multiselectable');
      }

      this.#updateSelectedItems();
    }

    if (changes.has('groupSelected')) {
      if (this.groupSelected) {
        this.#addSelectedGroup();
      } else {
        this.#removeSelectedGroup();
      }
    }

    if (
      changes.has('options') ||
      changes.has('optionGroupPath') ||
      changes.has('optionLabelPath') ||
      changes.has('optionValuePath')
    ) {
      if (this.options) {
        this.items = this.#prepareOptions(this.options);

        this.listbox?.remove();
        this.listbox = this.shadowRoot!.createElement('sl-listbox');
        this.listbox.items = this.items;
        this.listbox.renderer = (item, index: number) =>
          this.#renderItem(item as ComboboxItem<T, U>, index) as unknown as TemplateResult;
        this.appendChild(this.listbox);
        this.#useVirtualList = true;
      } else if (changes.get('options')) {
        this.items = [];
        this.#useVirtualList = false;
      }
    }

    if ((changes.has('options') || changes.has('value')) && this.items.length) {
      this.#updateSelectedItems();
    }

    if (changes.has('selectedItems') && this.items.length) {
      this.#updateTextFieldValue();
      this.#updateValue();
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

    if (changes.has('filterResults') && changes.get('filterResults') && !this.filterResults && this.#useVirtualList) {
      this.items = this.items.map(o => ({ ...o, visible: true }));
      this.listbox!.items = this.items;
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
        placeholder=${ifDefined(this.multiple && this.selectedItems.length ? undefined : this.placeholder)}
        size=${ifDefined(this.size)}
      >
        ${this.multiple && this.selectedItems.length
          ? html`
              <sl-tag-list
                aria-label=${msg('Selected options')}
                size=${ifDefined(this.size)}
                slot="prefix"
                stacked
                .emphasis=${this.disabled ? 'bold' : 'subtle'}
              >
                ${repeat(
                  this.selectedItems,
                  item => item,
                  item => html`
                    <sl-tag
                      @sl-remove=${() => this.#onRemove(item)}
                      ?disabled=${this.disabled}
                      ?removable=${!this.disabled}
                    >
                      ${item.label}
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
        @click=${this.#onOptionClick}
        @slotchange=${() => this.#onSlotChange()}
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

    let item: ComboboxItem<T, U> | undefined = undefined;

    if (
      event.inputType !== 'deleteContentBackward' &&
      (this.autocomplete === 'inline' || this.autocomplete === 'both')
    ) {
      item = this.items.find(i => i.label.toLowerCase().startsWith(value.toLowerCase()));

      if (item) {
        this.input.value = item.label;
        this.input.setSelectionRange(value.length, item.label.length);
      }
    } else {
      item = this.items.find(option => option.value === value);
    }

    if (this.allowCustomValues && !item) {
      this.#updateCreateCustomOption(value);
      this.#updateCurrent(this.createCustomOption);
    } else {
      this.#updateCurrent(item);
    }

    this.#updateFilteredOptions(value);
    this.updateState({ dirty: true });
    this.updateValidity();
  }

  #onInputClick(): void {
    this.wrapper?.showPopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.allowCustomValues && this.currentItem === this.createCustomOption) {
      this.#addCustomOption(this.input.value);
    } else if (event.key === 'Enter' && this.currentItem?.custom && this.currentItem?.option) {
      this.#removeCustomOption(this.currentItem);
    } else if (event.key === 'Enter' && this.currentItem) {
      this.#toggleSelectedOption(this.currentItem);
      this.#updateFilteredOptions();

      if (!this.multiple) {
        this.wrapper?.hidePopover();
      }
    } else if (!this.wrapper?.matches(':popover-open') && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      this.wrapper?.showPopover();
    } else if (['ArrowDown', 'ArrowUp', 'End', 'Home'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      // Limit navigation to the visible options
      const items = this.items.filter(i => i.type === 'option' && i.visible);

      let delta = 0,
        index = -1;

      if (this.currentItem) {
        index = items.indexOf(this.currentItem);
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
          index = items.length - 1;
          break;
      }

      index = (index + delta + items.length) % items.length;

      this.#updateCurrent(items[index]);
    }
  }

  #onOptionClick(event: Event): void {
    const element = event.composedPath().find((el): el is Option => el instanceof Option);

    if (element instanceof CreateCustomOption) {
      this.#addCustomOption(element.value as string);
    } else if (element?.id) {
      const item = this.items.find(i => i.id === element.id && i.visible);

      this.#toggleSelectedOption(item);
      this.#updateCurrent();
      this.#updateFilteredOptions();

      if (this.multiple) {
        this.input.focus();
      } else {
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

  #onRemove(item: ComboboxItem<T, U>): void {
    this.#removeSelectedOption(item);

    if (this.#popoverJustClosed) {
      this.wrapper?.showPopover();
    }
  }

  /** Updates the list of options and the listbox link with the text input. */
  #onSlotChange(): void {
    this.listbox = this.wrapper?.assignedElements({ flatten: true }).find(el => el instanceof Listbox) as Listbox<
      ComboboxItem<T, U>
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
        this.listbox.items = this.items;
      } else {
        let hasSelected = false;

        this.selectedItems = [];

        this.items = Array.from(this.listbox.children)
          .flatMap(el => this.#flattenOptions(el))
          .filter(el => !(el instanceof CreateCustomOption))
          .map(el => {
            el.id ||= `sl-combobox-option-${nextUniqueId++}`;

            this.optionLabelPath ??= 'label' as PathKeys<T>;
            this.optionValuePath ??= 'value' as PathKeys<T>;

            const label = el.textContent?.trim(),
              value = (el.value ?? label) as U,
              group = el.closest('sl-option-group')?.label || undefined;

            const item: ComboboxItem<T, U> = {
              id: el.id,
              element: el,
              group,
              label,
              option: {
                [this.optionLabelPath || 'label']: label,
                [this.optionValuePath || 'value']: value
              } as T,
              selected: el.selected,
              type: 'option',
              value,
              visible: true
            };

            if (el.selected) {
              hasSelected = true;

              this.selectedItems = [...this.selectedItems, item];
            }

            // Ensure the option has an aria-selected attribute
            if (!el.hasAttribute('aria-selected')) {
              el.setAttribute('aria-selected', Boolean(el.selected).toString());
            }

            return item;
          });

        // The selected option can be set either via:
        // - The `selected` attribute on the option -> call `#updateValue`
        // - The `value` property -> call `#updateSelectedItems`
        if (hasSelected) {
          this.#updateValue();
        } else {
          this.#updateSelectedItems();
        }
      }
    } else {
      this.input.removeAttribute('aria-controls');
      this.items = [];
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
      if (!this.multiple) {
        const index = this.items.findIndex(i => i.selected);

        if (index !== -1) {
          this.listbox?.scrollToIndex(index, { block: 'nearest' });
        }
      }
    } else {
      this.#popoverJustClosed = false;
    }
  }

  #addCustomOption(value: string): void {
    let option: T | undefined = undefined;
    if (this.optionLabelPath) {
      option = {} as T;
      setValueByPath(option, this.optionLabelPath, value as Path<T, PathKeys<T>>);

      if (this.optionValuePath) {
        setValueByPath(option, this.optionValuePath, value as Path<T, PathKeys<T>>);
      }
    } else {
      option = value as unknown as T;
    }

    const item: ComboboxItem<T, U> = {
      id: `sl-combobox-custom-option-${nextUniqueId++}`,
      custom: true,
      label: value,
      option,
      selected: true,
      type: 'option',
      value: value as U,
      visible: true
    };

    this.items = [item, ...this.items];

    if (this.#useVirtualList) {
      this.listbox!.items = this.items;
    } else {
      const el = (item.element ||= this.shadowRoot!.createElement('sl-combobox-custom-option')) as CustomOption;
      el.id = item.id;
      el.innerText = value;
      el.selected = true;
      el.value = value;
      el.setAttribute('aria-selected', 'true');

      if (!el.parentElement) {
        this.listbox?.prepend(el);
      }
    }

    this.#addSelectedOption(item);
    this.#updateCreateCustomOption();
    this.#updateCurrent(item);
  }

  #removeCustomOption(item?: ComboboxItem<T, U>): void {
    if (!item) {
      return;
    }

    this.items = this.items.filter(i => i !== item);
    this.selectedItems = this.selectedItems.filter(i => i !== item);

    if (this.#useVirtualList) {
      this.listbox!.items = this.items;
    } else {
      item.element?.remove();
    }
  }

  #addGroupedOption(item: ComboboxItem<T, U>): void {
    this.#addSelectedGroup();

    const groupedItem = { ...item, selected: true, visible: true };

    this.items = [this.items[0], groupedItem, ...this.items.slice(1)];
    this.selectedItems = [...this.selectedItems, groupedItem];

    if (this.#useVirtualList) {
      this.listbox!.items = this.items.filter(i => i.visible);
    } else {
      const el = (groupedItem.element = this.shadowRoot!.createElement('sl-combobox-grouped-option'));
      el.group = groupedItem.group;
      el.id = groupedItem.id;
      el.innerText = groupedItem.label;
      el.selected = true;

      if (!el.parentElement) {
        this.#selectedGroup?.append(el);
      }
    }
  }

  #removeGroupedOption(item: ComboboxItem<T, U>): void {
    const originalItem = this.items.find(i => i.id === item.id && !i.visible);
    if (originalItem) {
      originalItem.selected = false;
      originalItem.visible = true;

      if (originalItem.element instanceof Option) {
        originalItem.element.selected = false;
        originalItem.element.style.display = '';
        originalItem.element.setAttribute('aria-selected', 'false');
      }
    }

    this.items = this.items.filter(i => i !== item);
    this.selectedItems = this.selectedItems.filter(i => i !== item);

    if (this.#useVirtualList) {
      this.listbox!.items = this.items.filter(i => i.visible);
    } else {
      item.element?.remove();
      item.element = undefined;
    }

    if (this.selectedItems.length === 0) {
      this.#removeSelectedGroup();
    }
  }

  #addSelectedGroup(): void {
    if (this.#useVirtualList) {
      if (this.items[0].label === msg('Selected') && this.items[0].type === 'group') {
        return;
      }

      const selectedHeader: ComboboxItem = {
        id: `sl-combobox-option-group-${nextUniqueId++}`,
        label: msg('Selected'),
        type: 'group',
        visible: true
      };

      if (this.optionGroupPath) {
        this.items = [selectedHeader, ...this.items];
      } else {
        const allOptionsHeader: ComboboxItem = {
          id: `sl-combobox-option-group-${nextUniqueId++}`,
          label: msg('All options'),
          type: 'group',
          visible: true
        };

        this.items = [selectedHeader, allOptionsHeader, ...this.items];
      }
    } else {
      this.#selectedGroup ||= this.shadowRoot!.createElement('sl-combobox-selected-group');
      this.#selectedGroup.hasGroups = !!this.listbox?.querySelector('sl-option-group');

      if (!this.#selectedGroup.parentElement) {
        this.listbox?.prepend(this.#selectedGroup);
      }
    }
  }

  #removeSelectedGroup(): void {
    if (this.#useVirtualList) {
      if (this.items[0].label === msg('Selected') && this.items[0].type === 'group') {
        this.items = this.items.slice(1);
      } else {
        return;
      }

      while (this.items[0].type !== 'group') {
        this.#removeGroupedOption(this.items[0]);
      }

      if (this.items[0].label === msg('All options') && this.items[0].type === 'group') {
        this.items = this.items.slice(1);
      }

      this.listbox!.items = this.items;
    } else {
      this.#selectedGroup?.remove();
      this.#selectedGroup = undefined;
    }
  }

  #addSelectedOption(item: ComboboxItem<T, U>): void {
    if (this.multiple) {
      if (this.groupSelected) {
        item.visible = false;

        this.#addGroupedOption(item);
      } else {
        item.selected = true;

        this.selectedItems = [...this.selectedItems, item];
      }
    } else {
      item.selected = true;

      this.selectedItems.forEach(item => this.#removeSelectedOption(item));
      this.selectedItems = [item];
    }

    if (item.element instanceof Option) {
      item.element.selected = item.selected;
      item.element.style.display = item.visible ? '' : 'none';
      item.element.setAttribute('aria-selected', Boolean(item.selected).toString());
    }
  }

  #removeSelectedOption(item: ComboboxItem<T, U>): void {
    if (this.groupSelected) {
      this.#removeGroupedOption(item);
    } else {
      item.selected = false;

      this.selectedItems = this.selectedItems.filter(i => i !== item);

      if (item.custom) {
        this.#removeCustomOption(item);
      } else if (item.element instanceof Option) {
        item.element.selected = false;
        item.element.setAttribute('aria-selected', 'false');
      }
    }
  }

  #toggleSelectedOption(item?: ComboboxItem<T, U>, force?: boolean): void {
    if (!item) {
      return;
    }

    const selected = typeof force === 'boolean' ? force : !item.selected;

    if (selected) {
      this.#addSelectedOption(item);
    } else {
      this.#removeSelectedOption(item);
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

  #prepareOptions(options: T[]): Array<ComboboxItem<T, U>> {
    if (this.optionGroupPath) {
      const groups = Object.groupBy(options, option => getStringByPath(option, this.optionGroupPath!));

      return Object.keys(groups).reduce(
        (acc, group) => {
          return [
            ...acc,
            {
              id: `sl-combobox-option-group-${nextUniqueId++}`,
              label: group,
              type: 'group',
              visible: true
            },
            ...groups[group]!.map(option => this.#prepareOption(option, group))
          ];
        },
        [] as Array<ComboboxItem<T, U>>
      );
    } else {
      return options.map(option => this.#prepareOption(option));
    }
  }

  #prepareOption(option: T, group?: string): ComboboxItem<T, U> {
    const label = this.optionLabelPath
      ? getStringByPath(option, this.optionLabelPath)
      : (option as unknown as { toString(): string }).toString();

    return {
      group,
      id: `sl-combobox-option-${nextUniqueId++}`,
      label,
      option,
      selected: this.optionSelectedPath ? !!getValueByPath(option, this.optionSelectedPath) : false,
      type: 'option',
      value: (this.optionValuePath ? getValueByPath(option, this.optionValuePath) : option) as U,
      visible: true
    };
  }

  #renderItem(item: ComboboxItem<T, U>, index: number): Element {
    if ('option' in item) {
      let tagName: 'sl-option' | 'sl-combobox-custom-option' | 'sl-combobox-grouped-option' = 'sl-option';
      if (item.custom) {
        tagName = 'sl-combobox-custom-option';
      } else if (this.groupSelected && item.selected) {
        tagName = 'sl-combobox-grouped-option';
      }

      const el = (item.element = this.shadowRoot!.createElement(tagName));
      el.id = item.id;
      el.innerText = item.label;
      el.selected = !!item.selected;
      el.value = item.value;
      el.setAttribute('aria-selected', item.selected ? 'true' : 'false');

      if (el instanceof GroupedOption) {
        el.group = item.group;
      }

      if (item.current) {
        el.setAttribute('aria-current', 'true');
      }

      return el;
    } else if (item.custom) {
      const el = (item.element = this.shadowRoot!.createElement('sl-combobox-create-custom-option'));
      el.id = item.id;
      el.value = item.label;

      if (item.current) {
        el.setAttribute('aria-current', 'true');
      }

      return el;
    } else {
      const el = (item.element = this.shadowRoot!.createElement('sl-option-group-header'));
      el.divider = index !== 0;
      el.innerText = item.label;

      return el;
    }
  }

  #updateCreateCustomOption(labelAndValue?: string): void {
    if (labelAndValue) {
      if (this.createCustomOption) {
        this.createCustomOption.label = labelAndValue;
        this.createCustomOption.value = labelAndValue as U;
      } else {
        this.createCustomOption = {
          custom: true,
          id: `sl-combobox-create-custom-option-${nextUniqueId++}`,
          label: labelAndValue,
          type: 'option',
          value: labelAndValue as U,
          visible: true
        };

        this.items = [this.createCustomOption, ...this.items];
      }

      if (this.#useVirtualList) {
        this.listbox!.items = this.items;
      } else {
        this.createCustomOption.element ||= this.shadowRoot!.createElement('sl-combobox-create-custom-option');
        this.createCustomOption.element.id = this.createCustomOption.id;

        if (!this.createCustomOption.element.parentElement) {
          this.listbox?.prepend(this.createCustomOption.element);
        }
      }

      // Set or update the textContent and value of the custom option
      if (this.createCustomOption.element) {
        (this.createCustomOption.element as Option).value = labelAndValue;
      }
    } else if (this.createCustomOption) {
      this.items = this.items.filter(i => i !== this.createCustomOption);

      if (this.#useVirtualList) {
        this.listbox!.items = this.items;
      } else {
        this.createCustomOption.element?.remove();
      }

      this.createCustomOption = undefined;
    }
  }

  /** Updates the options to reflect the current one. */
  #updateCurrent(option?: ComboboxItem<T, U>): void {
    if (this.currentItem) {
      this.currentItem.current = false;
      this.input.removeAttribute('aria-activedescendant');
      this.listbox?.querySelector('[aria-current]')?.removeAttribute('aria-current');
    }

    this.currentItem = option;

    if (this.currentItem) {
      this.currentItem.current = true;

      this.input.setAttribute('aria-activedescendant', this.currentItem.id);

      if (this.currentItem.element) {
        this.currentItem.element.setAttribute('aria-current', 'true');
        this.currentItem.element.scrollIntoView({ block: 'nearest' });
      } else {
        this.listbox?.scrollToIndex(this.items.indexOf(this.currentItem), { block: 'nearest' });
      }
    }
  }

  #updateFilteredOptions(value?: string): void {
    if (!this.filterResults) {
      return;
    }

    let noMatch = true;

    this.items.forEach(item => {
      let match = !value;
      if (!match) {
        match = item.label.toLowerCase().startsWith(value!.toLowerCase());
      }

      if (noMatch && match) {
        noMatch = false;
      }

      item.visible = match;

      if (!this.#useVirtualList) {
        item.element!.style.display = match ? '' : 'none';
      }
    });

    if (this.#useVirtualList) {
      this.listbox!.items = this.items.filter(o => o.visible);
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

  /** Updates the selection based on the options & value. */
  #updateSelectedItems(): void {
    this.selectedItems.forEach(item => this.#removeSelectedOption(item));
    this.selectedItems = [];

    this.items.forEach(item => {
      if (this.multiple && (this.value as U[])?.includes(item.value!)) {
        this.#addSelectedOption(item);
      } else if (item.value === this.value) {
        this.#addSelectedOption(item);
      }
    });
  }

  /** Update the value in the text field. */
  #updateTextFieldValue(): void {
    if (this.multiple) {
      this.input.value = '';
    } else if (this.createCustomOption) {
      this.input.value = this.createCustomOption.value as string;
      this.input.setSelectionRange(-1, -1);
    } else {
      const item = this.selectedItems.at(0);

      if (item) {
        this.input.value = item.label;
        this.input.setSelectionRange(-1, -1);
      } else {
        this.input.value = '';
      }
    }
  }

  /** Updates the value based on the current selection. */
  #updateValue(): void {
    const values = this.selectedItems.map(i => i.value!);

    // Do nothing if the value hasn't changed
    if (
      this.multiple &&
      Array.isArray(this.value) &&
      this.value.length === values.length &&
      values.every(v => (this.value as U[]).includes(v))
    ) {
      return;
    } else if (this.value === values[0]) {
      return;
    }

    this.value = this.multiple ? values : values[0];
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.updateValidity();
  }
}
