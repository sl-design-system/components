import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import type { EventEmitter } from '@sl-design-system/shared';
import { EventsController, anchor, event, isPopoverOpen } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { SelectOption } from './select-option.js';
import { SelectOptionGroup } from './select-option-group.js';
import styles from './select.scss.js';
import { SelectButton } from './select-button.js';

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
      'sl-select-button': SelectButton
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

  /** The button in the light DOM. */
  button!: SelectButton;

  /** The listbox popover. */
  listbox!: HTMLElement;

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

    if (!this.button) {
      this.button = this.shadowRoot?.createElement('sl-select-button') as SelectButton;
      this.button.addEventListener('click', () => this.#onButtonClick());
      this.button.addEventListener('keydown', (event: KeyboardEvent) => this.#onKeydown(event));
      this.button.disabled = !!this.disabled;
      this.button.placeholder = this.placeholder;
      this.button.size = this.size;
      this.append(this.button);
    }

    this.#observer.observe(this, OBSERVER_OPTIONS);

    this.setFormControlElement(this);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.listbox = this.renderRoot.querySelector('[popover]') as HTMLElement;

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

    if (changes.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
      this.button.disabled = this.disabled;
    }

    if (changes.has('maxOverlayHeight') && this.maxOverlayHeight && this.listbox) {
      this.listbox.style.setProperty('--max-overlay-height', `${this.maxOverlayHeight}`);
    }

    if (changes.has('placeholder')) {
      this.button.placeholder = this.placeholder;
    }

    if (changes.has('size')) {
      this.button.size = this.size;
      this.allOptions?.forEach(option => (option.size = this.size));
      this.optionGroups?.forEach(group => (group.size = this.size));
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="button"></slot>
      <div
        ${anchor({ element: this.button, position: 'bottom' })}
        @beforetoggle=${this.#onBeforetoggle}
        @click=${this.#onListboxClick}
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

      this.currentOption = this.selectedOption ?? this.allOptions[0];
    } else {
      this.button.removeAttribute('aria-expanded');
    }
  }

  #onButtonClick(): void {
    if (isPopoverOpen(this.listbox)) {
      this.listbox.hidePopover();
    } else {
      this.listbox.showPopover();
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
          this.selectedOption = this.currentOption;
        }

        // Return and let the button handle the toggling of the popover
        return;
      default:
        return;
    }

    index = (index + delta + size) % size;
    this.currentOption = this.options[index];

    event.preventDefault();
    event.stopPropagation();
  }

  #onListboxClick(event: Event & { target: HTMLElement }): void {
    const option = event.target?.closest('sl-select-option');

    if (option) {
      this.#updateSelectedOption(option);
      this.listbox.hidePopover();
    }
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
