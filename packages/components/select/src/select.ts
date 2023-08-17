import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { SelectOptionGroup } from './select-option-group.js';
import {
  FormControlMixin,
  RovingTabindexController,
  ValidationController,
  anchor,
  hintStyles,
  isPopoverOpen,
  popoverPolyfillStyles,
  requiredValidator,
  validationStyles
} from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { SelectOption } from './select-option.js';
import styles from './select.scss.js';

let nextUniqueId = 0;
interface ToggleEvent extends Event {
  oldState: string;
  newState: string;
}

export type SelectSize = 'md' | 'lg';

export class Select extends FormControlMixin(LitElement) {
  static override styles: CSSResultGroup = [popoverPolyfillStyles, validationStyles, hintStyles, styles];

  /** @private */
  static formAssociated = true;

  static #observerOptions = {
    attributes: true,
    subtree: true,
    attributeFilter: ['selected', 'size'],
    attributeOldValue: true
  };

  /** @private */
  @query('#selectedOption') selectedOptionPlaceholder?: HTMLElement;

  /** @private */
  @queryAssignedElements({ selector: 'sl-select-option-group', flatten: false }) optionGroups?: SelectOptionGroup[];

  /** @private */
  @query('button') button?: HTMLButtonElement;
  /** @private */
  @query('dialog') dialog?: HTMLDialogElement;

  /** The maximum size the dropdown can have; only used when there are  enough options and enough space on the screen. */
  @property({ attribute: 'max-overlay-height', reflect: true }) maxOverlayHeight?: string;

  /** The size of the select.
   *  @type {'md' | 'lg'}
   */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** The placeholder text to show when no option is chosen. */
  @property({ reflect: true }) placeholder?: string;

  /** Whether the select is invalid. */
  @property({ type: Boolean, reflect: true }) invalid?: boolean;

  #rovingTabindexController = new RovingTabindexController<SelectOption>(this, {
    focusInIndex: (elements: SelectOption[]) => elements.findIndex(el => el.selected && isPopoverOpen(this.dialog)),
    elements: () => this.allOptions || [],
    isFocusableElement: (el: SelectOption) => !el.disabled
  });

  #validation = new ValidationController(this, {
    validators: [requiredValidator]
  });

  #observer?: MutationObserver;

  #selectId = `sl-select-${nextUniqueId++}`;

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** The current node selected in the list of options. */
  @state() private selectedOption?: SelectOption | null;

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

  override render(): TemplateResult {
    return html`
      <button
        ?disabled=${this.disabled}
        class="select-toggle"
        id=${this.#selectId}
        popovertarget="dialog-${this.#selectId}"
        role="combobox"
        aria-haspopup="listbox"
        aria-controls="dialog-${this.#selectId}"
        aria-expanded=${isPopoverOpen(this.dialog)}
        aria-activedescendant=${this.selectedOption || false}
        tabindex="0"
      >
        <span aria-hidden=${!this.selectedOption} contenttype=${this.#optionContentType}
          >${this.#renderSelectedOption}</span
        >
        <sl-icon name="chevron-down"></sl-icon>
      </button>
      <dialog
        @beforetoggle=${this.#setPopoverWidth}
        @click=${this.#handleOptionChange}
        @keydown=${this.#handleOverlayKeydown}
        @toggle=${this.#handleOptionFocus}
        id="dialog-${this.#selectId}"
        anchor=${this.#selectId}
        popover
        ${anchor({ position: 'bottom' })}
        aria-labelledby=${this.#selectId}
        role="listbox"
      >
        <slot @slotchange=${this.#handleOptionsSlotChange}></slot>
      </dialog>
      ${this.#validation.render()}
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setFormControlElement(this);

    this.#validation.validate(
      this.selectedOption ? this.selectedOption.value || this.selectedOption.innerHTML : undefined
    );
  }

  override firstUpdated(): void {
    this.#observer = new MutationObserver(m => this.#handleMutation(m));
    this.#observer?.observe(this, Select.#observerOptions);
    this.selectedOption ||= this.allOptions.find(option => option.selected);

    if (this.selectedOption) {
      this.#setSelectedOptionVisible(this.selectedOption);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('size')) {
      this.allOptions?.forEach(option => (option.size = this.size));
      this.optionGroups?.forEach(group => (group.size = this.size));
    }

    if (changes.has('placeholder')) {
      if (this.placeholder) {
        this.setAttribute('aria-placeholder', this.placeholder);
        this.button?.classList.add('placeholder');
      } else {
        this.removeAttribute('aria-placeholder');
        this.button?.classList.remove('placeholder');
      }
    }
    if (changes.has('maxOverlayHeight') && this.maxOverlayHeight && this.dialog) {
      this.dialog.style.setProperty('--max-overlay-height', `${this.maxOverlayHeight}`);
    }
  }

  #closeSelect(): void {
    this.dialog?.hidePopover?.();
    this.renderRoot.querySelector<HTMLElement>('.select-toggle')?.focus();
  }

  #handleOptionsSlotChange(): void {
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

    this.#rovingTabindexController.clearElementCache();
  }

  /**
   * If an option is selected programmatically update all the options or the size of the select itself
   */
  #handleMutation(mutations: MutationRecord[]): void {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'selected' && mutation.oldValue === null) {
        const selectedOption = <SelectOption>mutation.target;
        this.#observer?.disconnect();
        this.#updateSelectedOption(selectedOption);
        this.#observer?.observe(this, Select.#observerOptions);
      }
    });
  }

  /**
   * One of the options in the select has been clicked, get the right target and update the selection
   * */
  #handleOptionChange(event: Event): void {
    const selectOption = (event.target as HTMLElement)?.closest('sl-select-option');
    if (!event.target || !(selectOption instanceof SelectOption)) return;

    this.#updateSelectedOption(selectOption);

    if (!this.dialog?.hidePopover) return; // we can remove this check when Typescript knows the PopoverApi
    this.dialog.hidePopover();
  }

  /**
   * Make sure the focus is on the currently selected option
   * */
  #handleOptionFocus(): void {
    this.button?.setAttribute('aria-expanded', isPopoverOpen(this.dialog) ? 'true' : 'false');
    this.#rovingTabindexController.focusToElement(this.allOptions.findIndex(el => el.selected));
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
    if (selectedOption === this.selectedOption || selectedOption.disabled || !this.dialog) return;

    // Reset all the selected state of the tabs, and select the clicked tab
    this.allOptions.forEach((option: SelectOption) => {
      option.removeAttribute('selected');
      if (option === selectedOption) {
        option.setAttribute('selected', '');
        option.focus();
        option.scrollIntoView({ block: 'nearest', inline: 'nearest' });

        this.selectedOption = option;
        const selectedValue = option.value || option.innerHTML;
        this.#validation.validate(this.selectedOption ? selectedValue : undefined);
        this.#setSelectedOptionVisible(option);
      }
    });
  }

  /**
   * Copy the value/represenation of the selected option to the placeholder
   */
  #setSelectedOptionVisible(option: SelectOption): void {
    this.setFormValue(option.value || option.innerHTML);

    const clonedOption = (option.firstChild as HTMLElement).cloneNode(true) as HTMLElement;
    const contentType = (option.firstChild as HTMLElement).nodeType === 1 ? 'element' : 'string';

    this.selectedOptionPlaceholder?.childNodes.forEach(cn => cn.remove());
    this.selectedOptionPlaceholder?.append(clonedOption);
    this.selectedOptionPlaceholder?.setAttribute('contentType', contentType);
  }

  /**
   * Handle keyboard accessible controls.
   */
  #handleOverlayKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.stopPropagation();
        this.#updateSelectedOption(<SelectOption>event.target);
        this.#closeSelect();
        break;
      case 'Escape':
        this.#closeSelect();
        break;
      default:
        break;
    }
  }

  #setPopoverWidth(event: ToggleEvent): void {
    if (event.newState === 'open' && this.button && this.dialog) {
      this.dialog.style.width = `${this.button.getBoundingClientRect().width}px`;
    }
  }
}
