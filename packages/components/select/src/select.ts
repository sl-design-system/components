import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Listbox, Option, OptionGroup } from '@sl-design-system/listbox';
import {
  type EventEmitter,
  EventsController,
  ObserveAttributesMixin,
  RovingTabindexController,
  anchor,
  event,
  isPopoverOpen
} from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlClearEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { SelectButton } from './select-button.js';
import styles from './select.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select': Select;
  }

  interface ShadowRoot {
    // Workaround for missing type in @open-wc/scoped-elements
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}

export type SelectSize = 'md' | 'lg';

/**
 * A form control that allows users to select one option from a list of options.
 *
 * @slot default - Place for `sl-option` and `sl-option-group` elements
 * @csspart listbox - Set `--sl-popover-max-block-size` and/or `--sl-popover-min-block-size` to control the minimum and maximum height of the dropdown (within the limits of the available screen real estate)
 * @csspart selected - The selected option element within the select's internal `sl-select-button`, exposed for styling via `<sl-select>`
 * @csspart selected-option - The container for the selected option within the select's internal `sl-select-button`, exposed for styling via `<sl-select>`
 * @csspart placeholder - The placeholder text when no option is selected within the select's internal `sl-select-button`, exposed for styling via `<sl-select>`
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Select<T = any> extends ObserveAttributesMixin(
  FormControlMixin(ScopedElementsMixin(LitElement)),
  ['aria-describedby', 'aria-label', 'aria-labelledby']
) {
  /** @internal */
  static formAssociated = true;

  /** @internal The default offset of the listbox to the button. */
  static offset = 6;

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-listbox': Listbox,
      'sl-select-button': SelectButton
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the tooltip and the viewport. */
  static viewportMargin = 8;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** The initial state when the form was associated with the select. Used to reset the select. */
  #initialState?: T;

  /**
   * Track when focus is intentionally leaving the component (e.g. by clicking outside or tabbing
   * away). Set to true in #onFocusout when the listbox is open, and we're not already
   * programmatically closing it. Used to prevent restoring focus to the button when the user
   * intentionally moved focus elsewhere.
   */
  #focusLeavingComponent = false;

  /**
   * The last option that was rendered in the button's selected content. Used to avoid unnecessary
   * DOM updates.
   */
  #lastRenderedOption?: Option | null;

  /** Detect when options are added to the host, or a nested option group and clear the cache. */
  #observer = new MutationObserver(() => this.#rovingTabindexController.clearElementCache());

  /** Detect when the selected option content changes, so the button can refresh its cloned content. */
  #selectedOptionObserver = new MutationObserver(records =>
    this.#onSelectedOptionContentChange(records)
  );

  /** Tracks a scheduled largest-option-width recalculation frame. */
  #widthCalculationFrame?: number;

  /** Since we can't use `popovertarget`, we need to monitor the closing state manually. */
  #popoverClosing = false;

  /** Manage keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<Option>(this, {
    direction: 'vertical',
    elements: () => this.options || [],
    focusInIndex: (elements: Option[]) => {
      const index = elements.findIndex(el => el.selected);

      return index !== -1 ? index : elements.findIndex(el => !el.disabled);
    },
    isFocusableElement: (el: Option) => !el.disabled,
    listenerScope: (): HTMLElement => this.listbox!
  });

  /** @internal The container element for the selected option's content in the button's light DOM. */
  #selectedContentContainer?: HTMLElement;

  /**
   * @internal Since we move the aria-label to the button, we need to proxy it here,
   * otherwise the `<sl-form-validation-errors>` component will not be able to read it.
   */
  override get ariaLabel(): string {
    return this.button?.getAttribute('aria-label') || '';
  }

  /** The button in the light DOM. */
  button!: SelectButton;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | undefined>>;

  /** @internal Emits when the value is cleared. */
  @event({ name: 'sl-clear' }) clearEvent!: EventEmitter<SlClearEvent>;

  /** Will display a clear button when an option is selected. */
  @property({ type: Boolean, reflect: true }) clearable?: boolean;

  /**
   * The current option in the listbox. This is the option that will become the selected option if
   * the user presses Enter/Space.
   *
   * @internal
   */
  @state() currentOption?: Option<T>;

  /** Whether the select is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal */
  readonly internals = this.attachInternals();

  /** @internal The clear button element. */
  @query('button') clearButton?: HTMLButtonElement;

  /** @internal The listbox element that is also the popover. */
  @query('sl-listbox') listbox?: Listbox;

  /** @internal */
  @queryAssignedElements({ selector: 'sl-option-group', flatten: true })
  optionGroups?: OptionGroup[];

  /** @internal A flattened array of all options (even grouped ones). */
  get options(): Array<Option<T>> {
    const elements =
      this.renderRoot
        .querySelector<HTMLSlotElement>('slot:not([name])')
        ?.assignedElements({ flatten: true }) ?? [];

    return elements.flatMap(element => this.#getAllOptions(element));
  }

  /** The placeholder text to show when no option is chosen. */
  @property() placeholder?: string;

  /** Whether the select is a required field. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** @internal The selected option in the listbox. */
  @state() selectedOption?: Option<T>;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the select.
   *
   * @default md
   */
  @property({ reflect: true }) size?: SelectSize;

  /**
   * The number of pixels from the top of the viewport the select should be hidden on scroll. Use
   * this when there is a sticky header you don't want dropdowns to fall on top of.
   */
  @property({ type: Number, attribute: 'hide-margin-top' }) rootMarginTop: number = 0;

  /** The value for the select, to be used in forms. */
  @property() override value?: T;

  override connectedCallback(): void {
    super.connectedCallback();

    // This is a workaround because ARIA reflection elements are not yet available
    // everywhere. This may have changed by autumn 2025.
    if (!this.button) {
      this.button = this.shadowRoot!.createElement('sl-select-button');
      this.button.addEventListener('click', () => this.#onButtonClick());
      this.button.addEventListener('keydown', (event: KeyboardEvent) => this.#onKeydown(event));
      this.button.addEventListener('sl-clear', this.#onButtonClear);
      this.button.clearable = !!this.clearable;
      this.button.disabled = !!this.disabled;
      this.button.placeholder = this.placeholder;
      this.button.required = !!this.required;
      this.button.selected = this.selectedOption;
      this.button.showValid = !!this.showValid;
      this.button.showValidity = this.showValidity;
      this.button.size = this.size;
      this.button.tabIndex = this.disabled ? -1 : 0;
      this.button.setAttribute('aria-expanded', 'false');
      this.button.setAttribute('aria-haspopup', 'listbox');
      this.prepend(this.button);
    }

    this.setFormControlElement(this);
    this.setAttributesTarget(this.button);

    this.#observer.observe(this, { childList: true, subtree: true });
    this.#observeSelectedOptionContent();
    this.#onSelectedOptionContentChange();

    // Listen for i18n updates and update the validation message
    this.#events.listen(window, LOCALE_STATUS_EVENT, this.#updateValueAndValidity);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.#selectedOptionObserver.disconnect();
    if (this.#widthCalculationFrame !== undefined) {
      cancelAnimationFrame(this.#widthCalculationFrame);
      this.#widthCalculationFrame = undefined;
    }

    super.disconnectedCallback();
  }

  formAssociatedCallback(): void {
    this.#initialState = this.value;
  }

  formResetCallback(): void {
    this.value = this.#initialState;
    this.changeEvent.emit(this.value);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('clearable')) {
      this.button.clearable = this.clearable;
      this.#updateAriaKeyShortcuts();
    }

    if (changes.has('disabled')) {
      this.button.disabled = this.disabled;
      this.button.tabIndex = this.disabled ? -1 : 0;
      this.#updateAriaKeyShortcuts();
    }

    if (changes.has('placeholder')) {
      this.button.placeholder = this.placeholder;
    }

    if (changes.has('required')) {
      this.button.required = this.required;
      this.internals.ariaRequired = Boolean(this.required).toString();

      this.#updateValueAndValidity();
    }

    if (changes.has('showValid')) {
      this.button.showValid = this.showValid;
    }

    if (changes.has('showValidity')) {
      this.button.showValidity = this.showValidity;
    }

    if (changes.has('size')) {
      this.button.size = this.size;
    }

    if (changes.has('value')) {
      const selectedOption = this.options.find(option => option.value === this.value);

      if (selectedOption !== this.selectedOption) {
        this.#setSelectedOption(selectedOption, false);
      }
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    requestAnimationFrame(() => {
      if (this.listbox) {
        /**
         * Use ElementInternals element references so the button can reference the listbox across
         * the shadow DOM boundary. In the future, switch to `ariaControlsElements` property
         * (https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaControlsElements) when
         * browser support is sufficient.
         */
        this.button.internals.ariaControlsElements = [this.listbox];
      }

      const labels = Array.from(this.internals.labels) as Element[],
        hostAriaLabel = this.getAttribute('aria-label')?.trim(),
        hostAriaLabelledBy = this.getAttribute('aria-labelledby')?.trim(),
        buttonAriaLabel = this.button.getAttribute('aria-label')?.trim(),
        buttonAriaLabelledBy = this.button.getAttribute('aria-labelledby')?.trim(),
        ariaLabel = hostAriaLabel || buttonAriaLabel,
        explicitLabelledByElements =
          (this.button.ariaLabelledByElements && [...this.button.ariaLabelledByElements]) ||
          this.#resolveLabelledByElements(hostAriaLabelledBy || buttonAriaLabelledBy),
        hasExplicitLabel = Boolean(ariaLabel) || explicitLabelledByElements.length > 0;

      // Use element references so labeling works across the shadow boundary.
      if (!hasExplicitLabel && labels.length) {
        this.listbox!.removeAttribute('aria-label');
        this.button.ariaLabelledByElements = labels;
        this.listbox!.ariaLabelledByElements = labels;
      } else if (this.listbox) {
        if (explicitLabelledByElements.length > 0) {
          // Use element references so listbox labeling works across the shadow boundary.
          this.listbox.removeAttribute('aria-label');
          this.listbox.ariaLabelledByElements = explicitLabelledByElements;
        } else if (ariaLabel) {
          // Mirror explicit aria-label so the listbox has a concrete name in the accessibility tree.
          this.listbox.ariaLabel = ariaLabel;
          this.listbox.ariaLabelledByElements = [];
        }
      }
    });
  }

  #resolveLabelledByElements(ariaLabelledBy?: string): Element[] {
    if (!ariaLabelledBy) {
      return [];
    }

    const root = this.getRootNode() as Document | ShadowRoot;

    return ariaLabelledBy
      .split(/\s+/)
      .map((id: string) => id.trim())
      .filter(Boolean)
      .map((id: string) => root.querySelector<Element>(`#${CSS.escape(id)}`))
      .filter((element: Element | null): element is Element => element !== null);
  }

  override render(): TemplateResult {
    const showClearButton = !this.disabled && this.clearable && this.selectedOption;

    return html`
      <slot name="button"></slot>
      ${showClearButton
        ? html`
            <button
              @click=${this.#onClearButtonClick}
              @focusin=${this.#onClearButtonFocusin}
              @focusout=${this.#onClearButtonFocusout}
              aria-label=${msg('Clear selection', { id: 'sl.select.clearSelection' })}>
              <sl-icon name="circle-xmark"></sl-icon>
              <sl-icon name="circle-xmark-solid"></sl-icon>
            </button>
          `
        : nothing}
      <sl-listbox
        ${anchor({
          element: this.button,
          offset: Select.offset,
          position: 'bottom-start',
          rootMarginTop: this.rootMarginTop,
          viewportMargin: Select.viewportMargin
        })}
        @beforetoggle=${this.#onBeforetoggle}
        @click=${this.#onListboxClick}
        @keydown=${this.#onListboxKeydown}
        @mousedown=${this.#onListboxMousedown}
        @toggle=${this.#onToggle}
        part="listbox"
        popover>
        <slot @slotchange=${this.#onSlotchange}></slot>
      </sl-listbox>
    `;
  }

  override focus(options?: FocusOptions): void {
    this.button?.focus(options);
  }

  #renderSelectedContent(): void {
    if (!this.button) {
      return;
    }

    // Avoid unnecessary DOM work if the selected option hasn't changed
    if (this.#lastRenderedOption === this.selectedOption) {
      return;
    }

    let container =
      this.#selectedContentContainer ??
      this.button.querySelector<HTMLElement>('[slot="selected-content"]') ??
      undefined;

    if (!this.selectedOption) {
      // No selected option: remove any existing selected-content container
      if (container && container.parentNode === this.button) {
        container.remove();
      }

      this.#selectedContentContainer = undefined;
      this.#lastRenderedOption = null;

      return;
    }

    if (!container) {
      container = document.createElement('span');
      container.setAttribute('slot', 'selected-content');

      // Append the selected content as a child of the button (in the button's light DOM)
      this.button.appendChild(container);
    }

    this.#selectedContentContainer = container;

    const slotNodes = this.selectedOption.renderRoot.querySelector('slot')?.assignedNodes() ?? [];

    if (slotNodes.length) {
      const clones: Node[] = [];

      slotNodes.forEach(node => {
        const rootNode = node.getRootNode();

        // Unlike node.cloneNode(), importNode() is implemented in the
        // scoped custom element registry polyfill, so it will upgrade
        // the cloned node if it's a custom element.
        clones.push((rootNode as Document).importNode(node, true));
      });

      container.replaceChildren(...clones);
    } else {
      container.textContent = this.selectedOption.textContent?.trim() || '';
    }

    this.#lastRenderedOption = this.selectedOption;
  }

  #onSelectedOptionContentChange(records?: MutationRecord[]): void {
    if (!this.selectedOption) {
      return;
    }

    const selectedOptionValue = this.selectedOption.value;
    if (selectedOptionValue !== this.value) {
      this.value = selectedOptionValue;
      this.#updateValueAndValidity();
    }

    const hasSelectedContentChange =
      !records ||
      records.some(record => record.type !== 'attributes' || record.attributeName !== 'value');
    if (!hasSelectedContentChange) {
      return;
    }

    this.#lastRenderedOption = undefined;
    this.#renderSelectedContent();
    this.#scheduleLargestOptionWidthCalculation();
  }

  #onBeforetoggle({ newState }: ToggleEvent): void {
    if (newState === 'open') {
      this.button.setAttribute('aria-expanded', 'true');
      this.listbox!.style.width = `${this.button.getBoundingClientRect().width}px`;

      this.currentOption = this.selectedOption ?? this.options[0];
    } else {
      this.#popoverClosing = true;
      this.button.setAttribute('aria-expanded', 'false');
    }
  }

  #onButtonClick(): void {
    if (this.disabled) {
      return;
    } else if (!this.listbox || (!isPopoverOpen(this.listbox) && !this.#popoverClosing)) {
      this.listbox?.showPopover();
    }

    this.#popoverClosing = false;
  }

  #onButtonClear = (event: Event): void => {
    event.stopPropagation();

    this.#onClear();
    this.clearEvent.emit();
  };

  #onClear(): void {
    this.#setSelectedOption(undefined, true);
  }

  #onClearButtonClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.listbox && isPopoverOpen(this.listbox)) {
      this.#popoverClosing = true;
      this.listbox.hidePopover();
    }

    this.#onClear();
    this.clearEvent.emit();
    this.button.focus();
  }

  #onClearButtonFocusin(): void {
    this.button.clearFocused = true;
  }

  #onClearButtonFocusout(): void {
    this.button.clearFocused = false;
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.button.focus();
    }
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(event: FocusEvent): void {
    const leavingComponent =
      event.relatedTarget !== this.button &&
      event.relatedTarget !== this.clearButton &&
      (!(event.relatedTarget instanceof Element) ||
        event.relatedTarget?.closest('sl-select') !== this);

    if (leavingComponent) {
      const listboxIsOpen = this.listbox && isPopoverOpen(this.listbox);

      // Mark as "focus leaving component" when:
      // - We're not already in the process of programmatically closing (#popoverClosing),
      // - The listbox is currently open (if open, we'll close it, which means this is initiated by user).
      if (!this.#popoverClosing && listboxIsOpen) {
        this.#focusLeavingComponent = true;
      }

      if (listboxIsOpen) {
        this.listbox!.hidePopover();
        this.#popoverClosing = true;
      }

      this.blurEvent.emit();
      this.updateState({ touched: true });
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    } else if (!this.listbox || !isPopoverOpen(this.listbox)) {
      if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
        this.#rovingTabindexController.focus();
      } else if (event.key === 'Home') {
        this.#rovingTabindexController.focusToElement(0);
      } else if (event.key === 'End') {
        this.#rovingTabindexController.focusToElement(this.options.length - 1);
      } else {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      this.listbox?.showPopover();
    }
  }

  #onListboxClick(event: Event & { target: HTMLElement }): void {
    const option = event.target?.closest<Option<T>>('sl-option');

    if (option) {
      this.#setSelectedOption(option);
      // Programmatically closing, not because user moved focus away
      this.#popoverClosing = true;
      this.listbox?.hidePopover();
    }
  }

  /**
   * Mousedown on the listbox surface (including scrollbar area) can move focus away from the
   * trigger button, which fires `focusout` on `<sl-select>` and closes the popover.
   *
   * We intentionally use `mousedown` (not `pointerdown`) to keep this fix scoped to the
   * mouse-triggered focus-transfer path that causes the regression.
   */
  #onListboxMousedown(event: MouseEvent): void {
    if (event.button !== 0 || !this.listbox || event.target !== this.listbox) {
      return;
    }

    // Prevent focus from moving off the trigger when interacting with the listbox surface.
    // We only do this when the mousedown targets the listbox itself to avoid suppressing
    // default pointer behavior for option interactions.
    event.preventDefault();
  }

  #onListboxKeydown(event: KeyboardEvent): void {
    if (event.target instanceof Option && [' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      this.#setSelectedOption(event.target);
      // Programmatically closing, not because user moved focus away
      this.#popoverClosing = true;
      this.listbox?.hidePopover();
    } else if (event.key === 'Escape') {
      // Prevents the Escape key event from bubbling up, so that pressing 'Escape' inside the select
      // does not close parent containers (such as dialogs).
      event.stopPropagation();
    }
  }

  #onSlotchange(): void {
    this.#verifyRegisteredListboxElements();

    this.listbox?.applyFlattenedOptionAccessibility(this.options);

    if (this.value !== undefined && this.value !== null) {
      this.#setSelectedOption(
        this.options.find(option => option.value === this.value),
        false
      );
    } else {
      const selected = this.options.find(option => option.selected);

      this.#setSelectedOption(selected, false);
    }

    this.optionGroups?.forEach(group => {
      group.classList.remove('bottom-divider');

      if (group.nextElementSibling?.nodeName === 'SL-OPTION') {
        group.classList.add('bottom-divider');
      }
    });

    // Calculate the width of the widest option text and pass it to the button
    this.#calculateLargestOptionWidth();
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.#rovingTabindexController.focus();
    } else if (event.newState === 'closed') {
      // Only restore focus to the button if the popover was closed by selecting an option,
      // not when focus was moved away intentionally (e.g. by clicking outside or tabbing away)
      if (!this.#focusLeavingComponent) {
        this.button.focus();
      }

      this.#popoverClosing = false;
      this.#focusLeavingComponent = false;
    }
  }

  #calculateLargestOptionWidth(): void {
    if (!this.button) {
      return;
    }

    // If some options contain HTML, then we cannot calculate the width accurately
    const notAllOptionsAreTextOnly = this.options.some(option => !!option.children.length);
    if (notAllOptionsAreTextOnly) {
      return;
    }

    // Set up cached elements for efficient text width measurement
    const measureElement = this.#setupMeasureElement();

    let maxWidth = 0;

    // Get all options (including those in option groups)
    this.options.forEach(option => {
      const textContent = option.textContent?.trim() || '';
      if (textContent) {
        measureElement.textContent = textContent;

        /**
         * Add extra space for the icon and gap in the option: - icon width: 16px, --sl-icon-size:
         * var(--sl-size-200) in icon.scss - gap: 8px, gap: var(--sl-size-100) in option.scss
         */
        const totalWidth = measureElement.getBoundingClientRect().width + 16 + 8;
        maxWidth = Math.max(maxWidth, totalWidth);
      }
    });

    // Also consider the placeholder text (without icon/gap)
    if (this.placeholder) {
      measureElement.textContent = this.placeholder;
      maxWidth = Math.max(maxWidth, measureElement.getBoundingClientRect().width);
    }

    // Clean up measure element
    document.body.removeChild(measureElement);

    // Pass the largest width to the button
    this.button.optionSize = maxWidth;
  }

  #setupMeasureElement(): HTMLElement {
    const measureElement = document.createElement('span');
    measureElement.style.visibility = 'hidden';
    measureElement.style.position = 'absolute';
    measureElement.style.whiteSpace = 'nowrap';

    document.body.appendChild(measureElement);

    const buttonComputedStyle = getComputedStyle(this.button);

    measureElement.style.font = buttonComputedStyle.font;
    measureElement.style.fontFamily = buttonComputedStyle.fontFamily;
    measureElement.style.fontSize = buttonComputedStyle.fontSize;
    measureElement.style.fontWeight = buttonComputedStyle.fontWeight;

    return measureElement;
  }

  /** Returns a flattened array of all options (also the options in groups). */
  #getAllOptions(root: Element): Array<Option<T>> | Option<T> {
    if (root instanceof Option) {
      return root as Option<T>;
    } else if (root instanceof OptionGroup) {
      return Array.from(root.children).flatMap(child => this.#getAllOptions(child));
    } else {
      return [];
    }
  }

  #setSelectedOption(option?: Option<T>, emitEvent = true): void {
    if (this.selectedOption) {
      this.selectedOption.selected = false;
      this.selectedOption.setAttribute('aria-selected', 'false');
    }

    this.selectedOption = option;

    if (this.selectedOption) {
      this.selectedOption.selected = true;
      this.selectedOption.setAttribute('aria-selected', 'true');
    }
    this.#observeSelectedOptionContent();

    this.button.selected = this.selectedOption;
    this.value = this.selectedOption?.value;

    // Update the selected content in the light DOM
    this.#renderSelectedContent();

    if (emitEvent) {
      this.changeEvent.emit(this.value);
      this.updateState({ dirty: true });
    }

    this.#updateValueAndValidity();
    this.#updateAriaKeyShortcuts();
  }

  #observeSelectedOptionContent(): void {
    this.#selectedOptionObserver.disconnect();

    if (!this.selectedOption) {
      return;
    }

    this.#selectedOptionObserver.observe(this.selectedOption, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['value']
    });
  }

  #scheduleLargestOptionWidthCalculation(): void {
    if (this.#widthCalculationFrame !== undefined) {
      return;
    }

    this.#widthCalculationFrame = requestAnimationFrame(() => {
      this.#widthCalculationFrame = undefined;
      this.#calculateLargestOptionWidth();
    });
  }

  #updateAriaKeyShortcuts(): void {
    if (this.clearable && !this.disabled && this.selectedOption) {
      this.button.setAttribute('aria-keyshortcuts', 'Delete Backspace');
    } else {
      this.button.removeAttribute('aria-keyshortcuts');
    }
  }

  #updateValueAndValidity(): void {
    this.internals.setFormValue(this.nativeFormValue);

    if (!this.validity.customError) {
      this.internals.setValidity(
        { valueMissing: this.required && !this.selectedOption },
        msg('Please choose an option from the list.', { id: 'sl.select.validation.valueMissing' })
      );
    }

    this.updateValidity();
  }

  #verifyRegisteredListboxElements(): void {
    const option = this.querySelector('sl-option');

    if (option && !(option instanceof Option)) {
      console.warn(
        'sl-option elements must be registered as custom elements via the @sl-design-system/listbox package'
      );
    }
  }
}
