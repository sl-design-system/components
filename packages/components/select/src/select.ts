import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectOptionGroup } from './select-option-group.js';
import {
  FormControlMixin,
  RovingTabindexController,
  ValidationController,
  hintStyles,
  isPopoverOpen,
  requiredValidator,
  validationStyles
} from '@sl-design-system/shared';
import { computePosition } from '@floating-ui/dom';
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
  static override styles: CSSResultGroup = [validationStyles, hintStyles, styles];

  static formAssociated = true;

  static #observerOptions = {
    attributes: true,
    subtree: true,
    attributeFilter: ['selected', 'size'],
    attributeOldValue: true
  };

  @query('#selectedOption') selectedOptionPlaceholder?: HTMLElement;

  /** The slotted options and option groups. */
  // @queryAssignedElements({ selector: 'sl-select-option', flatten: false }) options?: SelectOption[];
  @queryAssignedElements({ selector: 'sl-select-option-group', flatten: false }) optionGroups?: SelectOptionGroup[];

  @query('button') button?: HTMLButtonElement;
  @query('dialog') dialog?: HTMLDialogElement;

  /** render helpers */
  @property() maxOverlayHeight?: string;

  /** Select size. */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** Whether the select is invalid. */
  @property({ type: Boolean, reflect: true }) invalid?: boolean;

  #rovingTabindexController = new RovingTabindexController<SelectOption>(this, {
    focusInIndex: (elements: SelectOption[]) => elements.findIndex(el => el.selected && !!isPopoverOpen(this.dialog)),
    elements: () => this.allOptions || [],
    isFocusableElement: (el: SelectOption) => !el.disabled
  });

  #validation = new ValidationController(this, {
    validators: [requiredValidator]
  });

  #observer?: MutationObserver;

  #selectId = `sl-select-${nextUniqueId++}`;

  get allOptions(): SelectOption[] {
    return Array.from(this.querySelectorAll('sl-select-option'));
  }

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** The current node selected in the list of options. */
  @state() private selectedOption?: SelectOption | null;

  override render(): TemplateResult {
    return html`
      <button
        ?disabled=${this.disabled}
        class="select-toggle"
        id=${this.#selectId}
        popovertarget="dialog-${this.#selectId}"
        role="combobox"
        tabindex="0"
      >
        <span contenttype=${this.#optionContentType}>${this.#renderSelectedOption}</span>
        <sl-icon name="chevron-down"></sl-icon>
      </button>
      <dialog
        @beforetoggle=${this.#positionPopover}
        @click=${this.#handleOptionChange}
        @keydown="${this.#handleOverlayKeydown}"
        @toggle=${this.#handleOptionFocus}
        id="dialog-${this.#selectId}"
        popover
        role="listbox"
      >
        <slot @slotchange=${this.#handleOptionsSlotChange}></slot>
      </dialog>
      ${this.#validation.render()}
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.internals.role = 'select';
    this.setFormControlElement(this);

    if (this.dialog && this.button) {
      this.dialog.style.width = `${this.button.getBoundingClientRect().width}px`;
    }
    this.#validation.validate(
      this.selectedOption ? this.selectedOption.value || this.selectedOption.innerHTML : undefined
    );
  }

  override firstUpdated(): void {
    this.#observer = new MutationObserver(m => this.#handleMutation(m));
    this.#observer?.observe(this, Select.#observerOptions);
    this.selectedOption ||= this.allOptions.find(option => option.selected);

    if (this.selectedOption) {
      // this.setFormValue(this.selectedOption.value || this.selectedOption.innerHTML);
      this.#setSelectedOptionVisible(this.selectedOption);
    }
  }

  // openSelect(event: Event & { target: HTMLElement }): void {
  //   const toggle = event.target.closest<HTMLElement>('.select-toggle');
  //   if (!toggle) return;

  //   if (!isPopoverOpen(this.overlay)) {
  //     this.scrollTo({ top: 0 });
  //     this.allOptions.find(option => option.selected)?.focus();
  //     this.overlay?.show(toggle);
  //   } else {
  //     this.overlay?.hidePopover();
  //   }
  // }

  #closeSelect(): void {
    this.dialog?.hidePopover?.();
    this.renderRoot.querySelector<HTMLElement>('.select-toggle')?.focus();
  }

  #handleOptionsSlotChange(): void {
    if (this.optionGroups) {
      this.optionGroups.forEach(group => {
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

  get #renderSelectedOption(): HTMLElement | TemplateResult {
    if (!this.selectedOption) {
      return html`&nbsp`;
    }
    return (this.selectedOption.firstChild as HTMLElement).cloneNode(true) as HTMLElement;
  }

  get #optionContentType(): string {
    if (!this.selectedOption) {
      return `string`;
    }
    return (this.selectedOption?.firstChild as HTMLElement).nodeType === 1 ? 'element' : 'string';
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

  #positionPopover(event: ToggleEvent): void {
    if (event.newState === 'open' && this.button && this.dialog) {
      this.dialog.style.width = `${this.button.getBoundingClientRect().width}px`;
      void computePosition(this.button, this.dialog, { placement: 'bottom-start' }).then(({ x, y }) => {
        if (this.dialog && this.button) {
          Object.assign(this.dialog.style, {
            left: `${x}px`,
            top: `${y}px`
          });
        }
      });
    }
  }
}
