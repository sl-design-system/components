import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectOverlay } from './select-overlay.js';
import { LitElement, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { RovingTabindexController } from '../utils/controllers/roving-tabindex.js';
import { FormControlMixin } from '../utils/mixins/form-control.js';
import { ValidationController, validationStyles } from '../utils/controllers/index.js';
import { requiredValidator } from '../utils/index.js';
import { SelectOption } from './select-option.js';
import styles from './select.scss.js';

let nextUniqueId = 0;

export class Select extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

  @query('sl-select-overlay') overlay?: SelectOverlay;
  @query('#selectedOption') selectedOptionPlaceholder?: HTMLElement;

  /** The slotted options. */
  @queryAssignedElements({ slot: 'options' }) options?: SelectOption[];

  @property() size?: { width: string; height: string } = { width: '500px', height: '32px' };
  @property() maxOverlayHeight?: string;

  #rovingTabindexController = new RovingTabindexController<SelectOption>(this, {
    focusInIndex: (elements: SelectOption[]) => elements.findIndex(el => el.selected && !!this.overlay?.popoverOpen),
    elements: () => this.options || [],
    isFocusableElement: (el: SelectOption) => !el.disabled
  });

  #validation = new ValidationController(this, {
    validators: [requiredValidator]
  });

  #observer?: MutationObserver;

  #selectId = `sl-select-${nextUniqueId++}`;

  static #observerOptions = {
    attributes: true,
    subtree: true,
    attributeFilter: ['selected', 'size'],
    attributeOldValue: true
  };

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** The current tab node selected in the tab group. */
  @state() private selectedOption?: SelectOption | null;

  override render(): TemplateResult {
    return html`
      <div
        id=${this.#selectId}
        tabindex="0"
        class="select-toggle"
        @click=${this.openSelect}
        @keydown="${this.#handleOverallKeydown}"
      >
        <span id="selectedOption" style=${styleMap(this.size || {})}></span>

        <div class="toggle-icon">🔽</div>
        <!-- to be replaced by <sl-icon></sl-icon> -->
      </div>
      <sl-select-overlay
        @keydown=${this.#handleOverlayKeydown}
        @click=${this.#handleOptionChange}
        aria-labelledby=${this.#selectId}
        style="--max-overlay-height:${this.maxOverlayHeight || 'unset'}"
      >
        <slot name="options" @slotchange=${this.#handleOptionsSlotChange}></slot>
      </sl-select-overlay>
      ${this.#validation.render()}
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.internals.role = 'select';
    this.setFormControlElement(this);
    this.#validation.validate(
      this.selectedOption ? this.selectedOption.value || this.selectedOption.innerHTML : undefined
    );
  }

  override firstUpdated(): void {
    this.#observer = new MutationObserver(m => this.#handleMutation(m));
    this.#observer?.observe(this, Select.#observerOptions);
    this.selectedOption ||= this.options?.find(option => option.selected);
    if (this.selectedOption) {
      this.#setSelectedOptionVisible(this.selectedOption);
    }
  }

  openSelect({ target }: Event): void {
    const toggle = (target as HTMLElement).closest('.select-toggle') as HTMLElement;
    if (!toggle) return;
    this.scrollTo({ top: 0 });
    this.options?.find(option => option.selected)?.focus();
    this.overlay?.show(toggle);
  }

  closeSelect(): void {
    this.overlay?.hide();
    (this.renderRoot.querySelector('.select-toggle') as HTMLElement).focus();
  }

  #handleOptionsSlotChange(): void {
    this.#rovingTabindexController.clearElementCache();
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
      if (mutation.attributeName === 'size') {
        this.#observer?.disconnect();
        this.#updateSize();
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
        this.#validation.validate(
          this.selectedOption ? this.selectedOption.value || this.selectedOption.innerHTML : undefined
        );
        this.#setSelectedOptionVisible(option);
      }
    });
  }

  #updateSize(): void {
    const sizes = this.options ? this.options.map(o => o.size || 0) : [];
    const maxWidth = Math.max(...sizes.map(s => s.width));
    const maxHeight = Math.max(...sizes.map(s => s.height));
    this.size = {
      width: maxWidth > 0 ? `${maxWidth}px` : 'auto',
      height: maxHeight > 0 ? `${maxHeight}px` : 'auto'
    };
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
