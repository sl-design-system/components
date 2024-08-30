import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { type EventEmitter, EventsController, anchor, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { Tag, TagList } from '@sl-design-system/tag';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
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
  element: HTMLElement;
  content: string;
  current: boolean;
  selected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export type ComboboxMultipleSelectionType = 'automatic' | 'manual';

let nextUniqueId = 0;

/**
 * Component for selecting one or more options from a list, similar to a native `<select>` element
 * but with the ability to search and filter options.
 *
 * @slot default - The input field
 * @slot options - Contains the listbox with options
 */
@localized()
export class Combobox<T extends { toString(): string } = string> extends FormControlMixin(
  ScopedElementsMixin(LitElement)
) {
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
  currentSelection: ComboboxOption[] = [];

  /** Whether the text field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** When set, will filter the results in the listbox based on user input. */
  @property({ type: Boolean, attribute: 'filter-results' }) filterResults?: boolean;

  /** The input element in the light DOM. */
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
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Whether the text field is a required field. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The value of the combobox. It `multiple` selection is enabled, then this
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

    this.#events.listen(this.input, 'click', this.#onInputClick);
    this.#events.listen(this.input, 'focus', this.#onFocus);
    this.#events.listen(this.input, 'pointerdown', this.#onPointerDown);
    this.#events.listen(this.input, 'pointerup', this.#onPointerUp);

    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-autocomplete', 'both');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-haspopup', 'listbox');

    this.#observer.observe(this, { childList: true, subtree: true });

    this.setFormControlElement(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('autocomplete')) {
      this.input.setAttribute('aria-autocomplete', this.autocomplete || 'both');
    }

    if (changes.has('autocomplete') || changes.has('readonly')) {
      this.input.readOnly = this.readonly ?? this.autocomplete === 'off';
    }

    if (changes.has('disabled')) {
      this.input.disabled = !!this.disabled;
    }

    if (changes.has('options') || changes.has('value')) {
      this.#updateSelected();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-text-field
        @input=${this.#onInput}
        @keydown=${this.#onKeydown}
        ?disabled=${this.disabled}
        placeholder=${ifDefined(this.placeholder)}
      >
        <slot name="input" slot="input"></slot>
        <button
          @click=${this.#onButtonClick}
          ?disabled=${this.disabled}
          aria-label=${msg('Toggle the options')}
          slot="suffix"
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
    }
  }

  #onButtonClick(): void {
    this.wrapper?.togglePopover();
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
  }

  #onInputClick(): void {
    this.wrapper?.showPopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.currentOption) {
      this.#updateSelection(this.currentOption);
      this.#updateTextFieldValue();

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
    const option = event.composedPath().find((el): el is Option => el instanceof Option);

    if (option?.id) {
      this.#updateSelection(this.options.find(o => o.id === option.id));
      this.#updateTextFieldValue();

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

  #toggleSelected(option: ComboboxOption): void {
    option.selected = !option.selected;

    if (option.selected) {
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

    // const value = this.input.value.slice(0, this.input.selectionStart ?? 0).trim();

    // this.options.forEach(option => {
    //   let match = !this.filterResults || !value;
    //   if (!match) {
    //     match = option.content.toLowerCase().startsWith(value.toLowerCase());
    //   }

    //   const optionElement = this.#findOptionElement(option);
    //   if (optionElement) {
    //     optionElement.style.display = match ? '' : 'none';
    //   }
    // });
  }

  /** Updates the state of the options to reflect the current value. */
  #updateSelected(): void {
    // Clear all selected options
    this.options.filter(o => o.selected).forEach(o => this.#toggleSelected(o));

    if (this.multiple) {
      // empty
    } else {
      const option = this.options.find(o => o.value === this.value);
      if (option) {
        this.#toggleSelected(option);
        this.#updateCurrent(option);
      }
    }
  }

  #updateSelection(option?: ComboboxOption): void {
    if (!option) {
      return;
    }

    this.#toggleSelected(option);

    if (this.multiple) {
      if (option.selected) {
        this.currentSelection = [...this.currentSelection, option];
      } else {
        this.currentSelection = this.currentSelection.filter(o => o !== option);
      }

      this.value = this.currentSelection.map(o => o.value as T) as unknown as T;
    } else {
      if (this.currentSelection.length && this.currentSelection[0] !== option) {
        // Deselect the old option
        this.#toggleSelected(this.currentSelection[0]);
      }

      this.currentSelection = option.selected ? [option] : [];
      this.value = option.value as T;
    }

    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.updateValidity();
  }

  #updateTextFieldValue(): void {
    if (this.multiple) {
      this.input.value = '';
    } else {
      this.input.value = this.currentSelection.at(0)?.content || '';
      this.input.setSelectionRange(-1, -1);
    }
  }
}
