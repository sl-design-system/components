import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectOverlay } from './select-overlay.js';
import { LitElement, html } from 'lit';
import { query, queryAssignedElements, state } from 'lit/decorators.js';
import { RovingTabindexController } from '../utils/controllers/roving-tabindex.js';
import { SelectOption } from './select-option.js';
import styles from './select.scss.js';

export class Select extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @query('sl-select-overlay') overlay?: SelectOverlay;

  /** The slotted options. */
  @queryAssignedElements({ slot: 'options' }) options?: SelectOption[];

  #rovingTabindexController = new RovingTabindexController<SelectOption>(this, {
    focusInIndex: (elements: SelectOption[]) => elements.findIndex(el => el.selected),
    elements: () => this.options || [],
    isFocusableElement: (el: SelectOption) => !el.disabled
  });

  #observer?: MutationObserver;
  static #observerOptions = {
    attributes: true,
    subtree: true,
    attributeFilter: ['selected'],
    attributeOldValue: true
  };

  /** The current tab node selected in the tab group. */
  @state() private selectedOption?: SelectOption | null;

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.openSelect}
        >${this.selectedOption ? html`${this.selectedOption.innerHTML}` : ''}</sl-button
      >
      <sl-select-overlay @keydown=${this.#handleKeydown} @click=${this.#handleOptionChange}>
        <slot name="options" @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
      </sl-select-overlay>
    `;
  }

  override firstUpdated(): void {
    this.#observer = new MutationObserver(this.#handleMutation);
    this.#observer?.observe(this, Select.#observerOptions);
    this.selectedOption ||= this.options?.find(option => option.selected);
  }

  openSelect({ target }: Event): void {
    this.overlay?.show(target as HTMLElement);
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
    if (!(event.target instanceof SelectOption)) return;
    this.#updateSelectedOption(event.target);
  }

  /**
   * Update the selected option with attributes and values.
   */
  #updateSelectedOption(selectedOption: SelectOption): void {
    if (selectedOption === this.selectedOption || selectedOption.disabled) return;

    // const optionIndex = Array.from(this.querySelectorAll('sl-select-option')).indexOf(selectedOption);

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
      }
    });

    // console.log(this.selectedOption);

    /**
     * Reset all the visibility of the panels,
     * and show the panel related to the selected tab
     */
    // const panels = this.querySelectorAll('sl-tab-panel');

    // if (panels.length === 1) {
    //   panels[0].setAttribute('id', `${this.#tabGroupId}-panel-${tabIndex + 1}`);
    //   panels[0].setAttribute('aria-labelledby', `${this.#tabGroupId}-tab-${tabIndex + 1}`);
    // } else {
    //   panels.forEach(panel => {
    //     panel.setAttribute('aria-hidden', `${panel !== selectedPanel ? 'true' : 'false'}`);
    //   });
    // }

    // this.tabChange.emit(tabIndex);
  }

  /** Handle keyboard accessible controls. */
  #handleKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.scrollTo({ top: 0 });
      console.log('handleKeydown', <SelectOption>event.target);
      this.#updateSelectedOption(<SelectOption>event.target);
    }
  }
}
