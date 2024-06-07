import { EventsController, anchor } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './combobox.scss.js';
import { Option } from './option.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox': Combobox;
  }
}

export interface ComboboxModel {}

export type ComboboxOption = {
  id: string;
  content: string;
  current: boolean;
  selected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export type ComboboxMultipleSelectionType = 'automatic' | 'manual';

let nextUniqueId = 0;

export class Combobox extends TextField {
  /** The default offset of the popover to the input. */
  static offset = 6;

  /** @internal */
  static override styles: CSSResultGroup = [TextField.styles, styles];

  /** The default margin between the popover and the viewport. */
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
  @property() override autocomplete?: 'off' | 'inline' | 'list' | 'both' = 'both';

  /** @internal The current highlighted option in the listbox. */
  currentOption?: ComboboxOption;

  /** When set, will filter the results in the listbox based on user input. */
  @property({ type: Boolean, attribute: 'filter-results' }) filterResults?: boolean;

  /** @internal The popover containing the list. */
  @query('[popover]') menu?: HTMLElement;

  /** Use a custom model for the options. */
  @property({ attribute: false }) model?: ComboboxModel;

  /** Will allow the selection of multiple options if true. */
  @property({ type: Boolean }) multiple?: boolean;

  /**
   * If set to 'automatic' (default), it will be one single text input with delimited values.
   * If set to "manual", you will only enter 1 option at a time, and then need to confirm selection, and then the input will clear,
   * and then you will add another selection.
   */
  @property({ attribute: 'multiple-selection-type' }) multipleSelectionType: ComboboxMultipleSelectionType =
    'automatic';

  /** @internal The options to choose from. */
  options: ComboboxOption[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.#events.listen(this.input, 'click', this.#onClick);
    this.#events.listen(this.input, 'focus', this.#onFocus);
    this.#events.listen(this.input, 'pointerdown', this.#onPointerDown);
    this.#events.listen(this.input, 'pointerup', this.#onPointerUp);

    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-haspopup', 'listbox');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-autocomplete', 'both');

    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-current', 'aria-selected', 'current', 'role', 'selected']
    });
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} @keydown=${this.#onKeydown} class="input">${this.renderInputSlot()}</div>
      <button @click=${this.#onButtonClick}>
        <sl-icon name="chevron-down"></sl-icon>
      </button>

      <slot
        ${anchor({
          element: this,
          offset: Combobox.offset,
          position: 'bottom-start',
          viewportMargin: Combobox.viewportMargin
        })}
        @beforetoggle=${this.#onBeforeToggle}
        @slotchange=${this.#onSlotChange}
        name="options"
        popover
        tabindex="-1"
      ></slot>
    `;
  }

  /** @internal */
  override updateInputElement(input: HTMLInputElement): void {
    super.updateInputElement(input);

    // Set readOnly if autocomplete is off
    input.readOnly = this.readonly ?? this.autocomplete === 'off';

    // Combobox uses aria-autocomplete instead of autocomplete
    input.autocomplete = 'off';
    input.setAttribute('aria-autocomplete', this.autocomplete || 'both');
  }

  #onBeforeToggle(event: ToggleEvent): void {
    this.input.setAttribute('aria-expanded', event.newState === 'open' ? 'true' : 'false');

    if (event.newState === 'open') {
      this.menu!.style.inlineSize = `${this.getBoundingClientRect().width}px`;
    }
  }

  #onButtonClick(): void {
    this.menu?.togglePopover();
  }

  #onClick(): void {
    this.menu?.showPopover();
  }

  #onFocus(): void {
    if (!this.#pointerDown) {
      this.menu?.showPopover();
    }
  }

  #onInput(): void {
    const value = this.input.value;

    this.menu?.showPopover();

    let currentOption: ComboboxOption | undefined = undefined;
    if (this.autocomplete === 'inline' || this.autocomplete === 'both') {
      currentOption = this.options.find(option => option.content.toLowerCase().startsWith(value.toLowerCase()));
    } else {
      currentOption = this.options.find(option => value === option.value);
    }

    this.#updateCurrent(currentOption);
  }

  #onKeydown(event: KeyboardEvent): void {
    console.log('keydown', event.key);
  }

  #onPointerDown(): void {
    this.#pointerDown = true;
  }

  #onPointerUp(): void {
    this.#pointerDown = false;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const listbox = event.target.assignedElements({ flatten: true }).at(0);

    if (listbox) {
      listbox.id ||= `sl-combobox-listbox-${nextUniqueId++}`;
      listbox.setAttribute('role', 'listbox');

      this.input.setAttribute('aria-controls', listbox.id);
    }
  }

  #findOptionElement(option: ComboboxOption): Option | null {
    return option?.id ? this.querySelector(`#${option.id}`) : null;
  }

  #updateCurrent(option?: ComboboxOption): void {
    if (this.currentOption) {
      this.currentOption.current = false;

      const optionElement = this.#findOptionElement(this.currentOption);
      if (optionElement) {
        optionElement.current = false;
        optionElement.removeAttribute('aria-current');
      }
    }

    this.currentOption = option;

    if (this.currentOption) {
      this.currentOption.current = true;

      const optionElement = this.#findOptionElement(this.currentOption);
      if (optionElement) {
        optionElement.current = true;
        optionElement.setAttribute('aria-current', 'true');
      }
    }
  }

  #updateOptions(): void {
    this.options = Array.from(this.querySelectorAll(':is(sl-option, [role="option"]):not(:disabled, [disabled])'))
      .filter((el): el is Option => el instanceof Option)
      .map(el => {
        el.id ||= `sl-combobox-option-${nextUniqueId++}`;

        return {
          id: el.id,
          content: el.textContent?.trim() || '',
          current: el.current || el.getAttribute('aria-current') === 'true',
          selected: el.selected || el.getAttribute('aria-selected') === 'true',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: el.value || el.textContent?.trim() || ''
        };
      });

    if (this.currentOption) {
      this.input.setAttribute('aria-activedescendant', this.currentOption.id);
    } else {
      this.input.removeAttribute('aria-activedescendant');
    }

    const value = this.input.value.slice(0, this.input.selectionStart ?? 0).trim();

    this.options.forEach(option => {
      let match = !this.filterResults || !value;
      if (!match) {
        match = option.content.toLowerCase().startsWith(value.toLowerCase());
      }

      const optionElement = this.#findOptionElement(option);
      if (optionElement) {
        optionElement.style.display = match ? '' : 'none';
      }
    });
  }
}
