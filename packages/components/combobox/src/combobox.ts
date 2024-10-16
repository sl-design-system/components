import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option, OptionGroup } from '@sl-design-system/listbox';
import { type EventEmitter, EventsController, anchor, event } from '@sl-design-system/shared';
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
  element?: Option;
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
export class Combobox<T = unknown> extends FormControlMixin(ScopedElementsMixin(LitElement)) {
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
  #events = new EventsController(this, { click: this.#onClick });

  /** Message element for when filtering results did not yield any results. */
  #noMatch?: NoMatch;

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

  /** The group that contains all the selected options when `groupSelected` is set. */
  #selectedGroup?: SelectedGroup;

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
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | T[] | undefined>>;

  /** @internal The create custom option option (used when `allowCustomValues` is set). */
  @state() createCustomOption?: ComboboxOption;

  /** @internal The current highlighted option in the listbox. */
  @state() currentOption?: ComboboxOption;

  /** @internal The current selected options. */
  @state() currentSelection: ComboboxOption[] = [];

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
  @state() listbox?: Element;

  /** Will allow the selection of multiple options if true. */
  @property({ type: Boolean }) multiple?: boolean;

  /** @internal The options to choose from. */
  @state() options: ComboboxOption[] = [];

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

    this.setFormControlElement(this.input);
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

    if (
      changes.has('currentOption') ||
      changes.has('currentSelection') ||
      changes.has('groupSelected') ||
      changes.has('listbox')
    ) {
      if (this.groupSelected && this.currentSelection.length) {
        if (!this.#selectedGroup) {
          this.#selectedGroup = this.shadowRoot!.createElement('sl-combobox-selected-group') as SelectedGroup;
          this.#selectedGroup.addEventListener('click', this.#onOptionsClick);
        }
        this.#selectedGroup.currentOption = this.currentOption;
        this.#selectedGroup.hasGroups = !!this.listbox?.querySelector('sl-option-group');
        this.#selectedGroup.options = this.currentSelection;

        if (this.#selectedGroup.parentElement !== this.listbox) {
          this.listbox?.prepend(this.#selectedGroup);
        }
      } else {
        this.#selectedGroup?.remove();
        this.#selectedGroup = undefined;
      }
    }

    if (changes.has('disabled')) {
      this.input.disabled = !!this.disabled;
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
        placeholder=${ifDefined(this.multiple && this.currentSelection.length ? undefined : this.placeholder)}
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
                ${repeat(
                  this.currentSelection,
                  option => option.id,
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
    if (!this.#popoverJustClosed) {
      this.wrapper?.showPopover();
    }
  }

  #onClick(event: Event): void {
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

    if (this.allowCustomValues && !currentOption) {
      if (value.length) {
        currentOption = {
          id: `sl-combobox-create-custom-option-${nextUniqueId++}`,
          content: value,
          current: false,
          selected: false,
          value
        };
      }

      this.#updateCreateCustomOption(currentOption);
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
    if (event.key === 'Enter' && this.allowCustomValues && this.currentOption === this.createCustomOption) {
      this.#addCustomOption(this.input.value);
    } else if (event.key === 'Enter' && this.currentOption) {
      this.#toggleSelected(this.currentOption);
      this.#updateSelection(this.currentOption);
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

      if (this.groupSelected && this.currentOption) {
        index = this.currentSelection.indexOf(this.currentOption);
        if (index === -1) {
          index = this.options.filter(o => !o.selected).indexOf(this.currentOption) + this.currentSelection.length;
        }
      } else if (this.currentOption) {
        index = this.options.findIndex(o => o.id === this.currentOption!.id);
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

      let option = this.options[index];
      if (this.groupSelected) {
        option =
          index < this.currentSelection.length
            ? this.currentSelection[index]
            : this.options.filter(o => !o.selected)[index - this.currentSelection.length];
      }

      this.#updateCurrent(option);
    }
  }

  #onOptionsClick(event: Event): void {
    const optionElement = event.composedPath().find((el): el is Option => el instanceof Option);

    if (optionElement instanceof CreateCustomOption) {
      this.#addCustomOption(optionElement.value as string);
    } else if (optionElement instanceof CustomOption) {
      this.#removeCustomOption(this.options.find(o => o.id === optionElement.id));
      this.#updateSelection();
      this.#updateTextFieldValue();
    } else if (optionElement?.id) {
      const option = this.options.find(o => o.id === optionElement.id);

      this.#toggleSelected(option);
      this.#updateSelection(option);
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

  #onTextFieldFormControl(event: SlFormControlEvent): void {
    event.preventDefault();
    event.stopPropagation();
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

  #addCustomOption(value: string): void {
    const element = this.shadowRoot!.createElement('sl-combobox-custom-option') as Option;
    element.id = `sl-combobox-custom-option-${nextUniqueId++}`;
    element.innerHTML = value;
    element.selected = true;
    element.value = value;
    this.listbox?.prepend(element);

    const currentOption = {
      id: element.id,
      content: value,
      current: true,
      custom: true,
      element,
      selected: true,
      value
    };

    this.#updateCreateCustomOption();
    this.#updateCurrent(currentOption);
    this.#updateSelection(currentOption);
    this.#updateTextFieldValue();
    this.#updateValue();
  }

  #removeCustomOption(option?: ComboboxOption): void {
    if (!option) {
      return;
    }

    option.element?.remove();
  }

  #flattenOptions(el: Element): Option[] {
    if (el instanceof Option) {
      return [el];
    } else if (el instanceof OptionGroup) {
      return Array.from(el.children).flatMap(child => this.#flattenOptions(child));
    } else if (el instanceof HTMLSlotElement) {
      return Array.from(el.assignedElements({ flatten: true })).flatMap(child => this.#flattenOptions(child));
    }

    return [];
  }

  #toggleSelected(option?: ComboboxOption, force?: boolean): void {
    if (!option) {
      return;
    }

    const selected = typeof force === 'boolean' ? force : !option.selected;

    option.selected = selected;

    if (option.element) {
      option.element.selected = selected;
      option.element.style.display = this.groupSelected && selected ? 'none' : '';

      if (selected) {
        option.element.setAttribute('aria-selected', 'true');
      } else {
        option.element.removeAttribute('aria-selected');
      }
    }
  }

  /** Updates the options to reflect the current one. */
  #updateCurrent(option?: ComboboxOption): void {
    if (this.currentOption) {
      this.currentOption.current = false;
      this.currentOption.element?.removeAttribute('aria-current');

      this.input.removeAttribute('aria-activedescendant');
    }

    this.currentOption = option;

    if (this.currentOption) {
      this.currentOption.current = true;
      this.currentOption.element?.setAttribute('aria-current', 'true');

      // Scroll to the selected group or the current option
      if (this.groupSelected && this.currentSelection.includes(this.currentOption)) {
        this.#selectedGroup!.scrollIntoView({ block: 'nearest' });
      } else {
        this.currentOption.element?.scrollIntoView({ block: 'nearest' });
      }

      this.input.setAttribute('aria-activedescendant', this.currentOption.id);
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
        this.createCustomOption.element ||= this.shadowRoot!.createElement(
          'sl-combobox-create-custom-option'
        ) as CreateCustomOption;
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
        match = option.content.toLowerCase().startsWith(value!.toLowerCase());
      }

      if (noMatch && match) {
        noMatch = false;
      }

      if (option.element) {
        option.element.style.display = match ? '' : 'none';
      }
    });

    if (noMatch && value) {
      this.#noMatch ||= this.shadowRoot!.createElement('sl-combobox-no-match') as NoMatch;
      this.#noMatch.value = value;
      this.listbox?.prepend(this.#noMatch);
    } else {
      this.#noMatch?.remove();
      this.#noMatch = undefined;
    }
  }

  /** Updates the list of options and the listbox link with the text input. */
  #updateOptions(): void {
    this.listbox = this.wrapper?.assignedElements({ flatten: true })?.at(0);

    if (this.listbox) {
      this.listbox.id ||= `sl-combobox-listbox-${nextUniqueId++}`;
      this.listbox.setAttribute('role', 'listbox');

      this.input.setAttribute('aria-controls', this.listbox.id);

      this.options = Array.from(this.listbox.children)
        .flatMap(el => this.#flattenOptions(el))
        .filter(el => !(el instanceof CreateCustomOption))
        .map(el => {
          el.id ||= `sl-combobox-option-${nextUniqueId++}`;

          return {
            id: el.id,
            element: el,
            content: el.textContent?.trim() || '',
            current: el.getAttribute('aria-current') === 'true',
            custom: el instanceof CustomOption,
            group: el.closest('sl-option-group')?.getAttribute('label') || undefined,
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
    if (this.multiple) {
      const selected = this.options.filter(o => o.selected).map(o => o.value),
        values = Array.isArray(this.value) ? this.value : [this.value];

      this.options.forEach(o => {
        if (values.includes(o.value as T)) {
          this.#toggleSelected(o, true);
        } else if (selected.includes(o.value as T)) {
          this.#toggleSelected(o, false);
        }
      });

      this.#updateSelection();
    } else {
      const option = this.options.find(o => o.value === this.value);

      if (option) {
        this.options.filter(o => o !== option && o.selected).forEach(o => this.#toggleSelected(o, false));

        this.#toggleSelected(option, true);

        if (!this.currentOption) {
          this.#updateCurrent(option);
        }

        this.#updateSelection(option);
        this.#updateTextFieldValue();
      }
    }

    // Remove any custom options that are not selected
    this.options.filter(o => o.custom && !o.selected).forEach(o => this.#removeCustomOption(o));
  }

  /** Updates the selection based on the `selected` property of the options. */
  #updateSelection(option?: ComboboxOption): void {
    let selection: ComboboxOption[] = [];
    if (this.multiple) {
      selection =
        (this.value as T[])
          ?.map(v => this.options.find(o => (o.value ?? o.content) === v))
          .filter((o): o is ComboboxOption => !!o) ?? [];

      if (option?.selected) {
        selection = [...selection, option];
      } else if (option) {
        selection = selection.filter(o => o !== option);
      }
    } else {
      selection = option?.selected ? [option] : [];
    }

    this.currentSelection.forEach(o => {
      // Use ids to compare the two options, since the references may be different
      // due to the options being recreated in `#updateOptions`.
      if (!selection.find(s => s.id === o.id)) {
        this.#toggleSelected(o, false);
      }
    });

    this.currentSelection = selection;
    this.currentSelection.forEach(o => this.#toggleSelected(o, true));
  }

  /** Update the value in the text field. */
  #updateTextFieldValue(): void {
    if (this.multiple) {
      this.input.value = '';
    } else if (this.createCustomOption) {
      this.input.value = this.createCustomOption.content;
      this.input.setSelectionRange(-1, -1);
    } else {
      this.input.value = this.currentSelection.at(0)?.content || '';
      this.input.setSelectionRange(-1, -1);
    }
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
    this.updateValidity();
  }
}
