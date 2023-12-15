import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import type { EventEmitter } from '@sl-design-system/shared';
import { EventsController, anchor, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { SelectOption } from './select-option.js';
import { SelectOptionGroup } from './select-option-group.js';
import styles from './select.scss.js';

declare global {
  interface ARIAMixin {
    ariaActiveDescendantElement: HTMLElement | null;
  }
}

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributes: true,
  attributeFilter: ['selected', 'size'],
  attributeOldValue: true,
  subtree: true
};

export type SelectSize = 'md' | 'lg';

export class Select extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** If an option is selected programmatically update all the options or the size of the select itself. */
  #observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'selected' && mutation.oldValue === null) {
        const selectedOption = <SelectOption>mutation.target;

        this.#observer.disconnect();
        this.#updateSelectedOption(selectedOption);
        this.#observer.observe(this, OBSERVER_OPTIONS);
      }
    });
  });

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<void>;

  /** Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<string>;

  /** Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<void>;

  /** @private */
  @query('#selectedOption') selectedOptionPlaceholder?: HTMLElement;

  /** @private */
  @queryAssignedElements({ selector: 'sl-select-option-group', flatten: false }) optionGroups?: SelectOptionGroup[];

  /** @private */
  @query('button') button!: HTMLButtonElement;

  /** @private */
  @query('#popover') listbox!: HTMLElement;

  /** @private A flattened array of all options (even grouped ones). */
  get options(): SelectOption[] {
    const elements = this.renderRoot.querySelector('slot')?.assignedElements({ flatten: true }) ?? [];

    return elements.flatMap(element => this.#getAllOptions(element));
  }

  /**
   * The current option in the listbox. This is the option that will become the
   * selected option if the user presses Enter/Space.
   * @private
   */
  @state() currentOption?: SelectOption;

  /** Whether the select is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The maximum size the dropdown can have; only used when there are  enough options and enough space on the screen. */
  @property({ attribute: 'max-overlay-height', reflect: true }) maxOverlayHeight?: string;

  /** The placeholder text to show when no option is chosen. */
  @property() placeholder?: string;

  /** Whether the select is a required field. */
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /** @private The selected option in the listbox. */
  @state() selectedOption?: SelectOption | null;

  /** The size of the select. */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** Whether the select is invalid. */
  @property({ type: Boolean, reflect: true }) invalid?: boolean;

  /** The value for the select, to be used in forms. */
  @property() value: string | null = null;

  /** @private */
  get allOptions(): SelectOption[] {
    return Array.from(this.querySelectorAll('sl-select-option'));
  }

  get #renderSelectedOption(): HTMLElement | TemplateResult {
    if (!this.selectedOption) {
      return this.placeholder ? html`${this.placeholder}` : html`&nbsp;`;
    }
    return (this.selectedOption.firstChild as HTMLElement).cloneNode(true) as HTMLElement;
  }

  get #optionContentType(): string {
    if (!this.selectedOption) {
      return `string`;
    }
    return (this.selectedOption?.firstChild as HTMLElement).nodeType === 1 ? 'element' : 'string';
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this, OBSERVER_OPTIONS);

    this.setFormControlElement(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.selectedOption ||= this.allOptions.find(option => option.selected);

    if (this.selectedOption) {
      this.#setSelectedOptionVisible(this.selectedOption);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('currentOption')) {
      this.options.forEach(option => option.classList.toggle('sl-current', option === this.currentOption));
      this.currentOption?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      this.button.ariaActiveDescendantElement = this.currentOption ?? null;
    }

    if (changes.has('maxOverlayHeight') && this.maxOverlayHeight && this.listbox) {
      this.listbox.style.setProperty('--max-overlay-height', `${this.maxOverlayHeight}`);
    }

    if (changes.has('placeholder')) {
      if (this.placeholder) {
        this.setAttribute('aria-placeholder', this.placeholder);
      } else {
        this.removeAttribute('aria-placeholder');
      }
    }

    if (changes.has('size')) {
      this.allOptions?.forEach(option => (option.size = this.size));
      this.optionGroups?.forEach(group => (group.size = this.size));
    }
  }

  override render(): TemplateResult {
    return html`
      <button
        @keydown=${this.#onKeydown}
        ?disabled=${this.disabled}
        id="button"
        popovertarget="popover"
        role="combobox"
      >
        <span aria-hidden=${!this.selectedOption} contenttype=${this.#optionContentType}>
          ${this.#renderSelectedOption}
        </span>
        <sl-icon name="chevron-down"></sl-icon>
      </button>

      <div
        ${anchor({ position: 'bottom' })}
        @beforetoggle=${this.#onBeforetoggle}
        @click=${this.#onClick}
        anchor="button"
        id="popover"
        popover
        role="listbox"
      >
        <slot @slotchange=${this.#onSlotchange}></slot>
      </div>
    `;
  }

  #onBeforetoggle({ newState }: ToggleEvent): void {
    if (newState === 'open') {
      this.listbox.style.width = `${this.button.getBoundingClientRect().width}px`;

      this.currentOption = this.selectedOption ?? this.allOptions[0];
    }
  }

  #onClick(event: Event & { target: HTMLElement }): void {
    console.log('click', event);

    const option = event.target?.closest('sl-select-option');

    console.log({ option });

    if (option) {
      this.#updateSelectedOption(option);

      this.listbox.hidePopover();
    }
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
  }

  #onKeydown(event: KeyboardEvent): void {
    const size = this.options.length;

    let delta = 0,
      index = this.options.indexOf(this.currentOption ?? this.selectedOption ?? this.options[0]);

    switch (event.key) {
      case 'ArrowDown':
        if (this.listbox.matches(':popover-open')) {
          delta = 1;
        } else {
          this.button.click();
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
      case 'Enter':
      case 'Space':
        if (this.listbox.matches(':popover-open')) {
          this.selectedOption = this.currentOption;
          this.button.click();
        } else {
          this.button.click();
        }
        break;
      default:
        return;
    }

    index = (index + delta + size) % size;
    this.currentOption = this.options[index];

    event.preventDefault();
    event.stopPropagation();
  }

  #onSlotchange(): void {
    if (this.optionGroups) {
      this.optionGroups.forEach(group => {
        group.size = this.size;
        group.classList.remove('bottom-divider');

        if (group.nextElementSibling?.nodeName === 'SL-SELECT-OPTION') {
          group.classList.add('bottom-divider');
        }
      });
    }
    if (this.allOptions.length > 0) {
      this.allOptions.forEach(option => (option.size = this.size));
    }
  }

  /**
   * Update the selected option with attributes and values.
   */
  #updateSelectedOption(selectedOption: SelectOption): void {
    // Always reset the scroll when an option is selected.
    this.scrollTo({ top: 0 });

    /**
     * Return handler if it's not an option or if it's already selected
     */
    if (selectedOption === this.selectedOption || selectedOption.disabled || !this.listbox) return;

    // Reset all the selected state of the tabs, and select the clicked tab
    this.allOptions.forEach((option: SelectOption) => {
      option.removeAttribute('selected');
      if (option === selectedOption) {
        option.setAttribute('selected', '');
        option.focus();
        option.scrollIntoView({ block: 'nearest', inline: 'nearest' });

        this.selectedOption = option;
        // const selectedValue = option.value || option.innerHTML;
        // this.#validation.validate(this.selectedOption ? selectedValue : undefined);
        this.#setSelectedOptionVisible(option);
      }
    });
  }

  /** Returns a flattened array of all options (also the options in groups). */
  #getAllOptions(root: Element): SelectOption[] {
    if (root instanceof SelectOption) {
      return [root];
    } else if (root instanceof SelectOptionGroup) {
      return Array.from(root.children).flatMap(child => this.#getAllOptions(child));
    } else {
      return [];
    }
  }

  /**
   * Copy the value/represenation of the selected option to the placeholder
   */
  #setSelectedOptionVisible(option: SelectOption): void {
    this.internals.setFormValue(option.value || option.innerHTML);

    const clonedOption = (option.firstChild as HTMLElement).cloneNode(true) as HTMLElement;
    const contentType = (option.firstChild as HTMLElement).nodeType === 1 ? 'element' : 'string';

    this.selectedOptionPlaceholder?.childNodes.forEach(cn => cn.remove());
    this.selectedOptionPlaceholder?.append(clonedOption);
    this.selectedOptionPlaceholder?.setAttribute('contentType', contentType);
  }
}
