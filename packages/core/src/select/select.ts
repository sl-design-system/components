import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectOverlay } from './select-overlay.js';
import { LitElement, html } from 'lit';
import { query, queryAssignedElements, state } from 'lit/decorators.js';
import { RovingTabindexController } from '../utils/controllers/roving-tabindex.js';
import { FormControlMixin } from '../utils/mixins/form-control.js';
import { SelectOption } from './select-option.js';
import styles from './select.scss.js';

let nextUniqueId = 0;

export class Select extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = styles;

  @query('sl-select-overlay') overlay?: SelectOverlay;
  @query('#selectedOption') selectedOptionPlaceholder?: HTMLElement;

  /** The slotted options. */
  @queryAssignedElements({ slot: 'options' }) options?: SelectOption[];

  #rovingTabindexController = new RovingTabindexController<SelectOption>(this, {
    focusInIndex: (elements: SelectOption[]) => elements.findIndex(el => el.selected && !!this.overlay?.popoverOpen),
    elements: () => this.options || [],
    isFocusableElement: (el: SelectOption) => !el.disabled
  });

  #observer?: MutationObserver;

  #selectId = `sl-select-${nextUniqueId++}`;

  static #observerOptions = {
    attributes: true,
    subtree: true,
    attributeFilter: ['selected'],
    attributeOldValue: true
  };

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** The current tab node selected in the tab group. */
  @state() private selectedOption?: SelectOption | null;

  override render(): TemplateResult {
    return html`
      <sl-button id=${this.#selectId} @click=${this.openSelect} @keydown="${this.#handleOverallKeydown}">
        <span id="selectedOption">Select an option</span>🔽
      </sl-button>
      <sl-select-overlay
        @keydown=${this.#handleOverlayKeydown}
        @click=${this.#handleOptionChange}
        aria-labelledby=${this.#selectId}
      >
        <slot name="options" @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
      </sl-select-overlay>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.internals.role = 'select';
    this.setFormControlElement(this);
  }

  override firstUpdated(): void {
    this.#observer = new MutationObserver(this.#handleMutation);
    this.#observer?.observe(this, Select.#observerOptions);
    this.selectedOption ||= this.options?.find(option => option.selected);
    if (this.selectedOption) {
      this.#setSelectedOptionVisible(this.selectedOption);
    }
  }

  openSelect({ target }: Event): void {
    this.scrollTo({ top: 0 });
    this.options?.find(option => option.selected)?.focus();
    this.overlay?.show(target as HTMLElement);
  }

  closeSelect(): void {
    this.overlay?.hide();
    this.renderRoot.querySelector('sl-button')?.focus();
  }

  /** If an option is selected programmatically update all the options. */
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

  #handleOptionChange(event: Event): void {
    // Always reset the scroll when an option is selected.
    this.scrollTo({ top: 0 });

    /**
     * Return handler if it's not an option or if it's already selected
     */
    const selectOption = (event.target as HTMLElement)?.closest('sl-select-option');

    if (!event.target || !(selectOption instanceof SelectOption)) return;
    this.#updateSelectedOption(selectOption);
  }

  /**
   * Update the selected option with attributes and values.
   */
  #updateSelectedOption(selectedOption: SelectOption): void {
    if (selectedOption === this.selectedOption || selectedOption.disabled) return;

    /**
     * Reset all the selected state of the tabs, and select the clicked tab
     */
    this.options?.forEach((option: SelectOption) => {
      option.removeAttribute('selected');
      if (option === selectedOption) {
        option.setAttribute('selected', '');
        option.focus();
        option.scrollIntoView({ block: 'nearest', inline: 'nearest' });

        this.selectedOption = option;
        this.#setSelectedOptionVisible(option);
      }
    });
  }

  #setSelectedOptionVisible(option: SelectOption): void {
    this.setFormValue(option.value || option.innerHTML);

    const clonedOption = (option.firstChild as HTMLElement).cloneNode(true) as HTMLElement;
    this.selectedOptionPlaceholder?.childNodes.forEach(cn => cn.remove());
    this.selectedOptionPlaceholder?.append(clonedOption);
  }

  /** Handle keyboard accessible controls. */
  #handleOverlayKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.stopPropagation();
        this.scrollTo({ top: 0 });
        this.#updateSelectedOption(<SelectOption>event.target);
        this.closeSelect();
        break;
      case 'Escape':
        this.closeSelect();
        break;
      default:
        break;
    }
  }

  /** Handle keyboard accessible controls. */
  #handleOverallKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.openSelect(event);
        break;
      case 'Escape':
        this.closeSelect();
        break;
      default:
        break;
    }
  }
}
