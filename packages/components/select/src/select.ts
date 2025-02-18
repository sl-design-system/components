import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Listbox, Option, OptionGroup } from '@sl-design-system/listbox';
import {
  type EventEmitter,
  EventsController,
  ObserveAttributesMixin,
  RovingTabindexController,
  anchor,
  event
} from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { SelectButton } from './select-button.js';
import styles from './select.scss.js';

declare global {
  interface ElementInternals {
    ariaDescribedByElements: Element[];
  }

  interface HTMLElement {
    // Workaround for missing options in TypeScript's lib.dom.d.ts
    // See https://html.spec.whatwg.org/multipage/popover.html#dom-showpopover
    showPopover(options?: { source?: HTMLElement }): void;
  }

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
 * @slot default - Place for `sl-option` elements
 * @csspart listbox - Set `--sl-popover-max-block-size` and/or `--sl-popover-min-block-size` to control the minimum and maximum height of the dropdown (within the limits of the available screen real estate)
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Select<T = any> extends ObserveAttributesMixin(FormControlMixin(ScopedElementsMixin(LitElement)), [
  'aria-describedby',
  'aria-label',
  'aria-labelledby'
]) {
  /** @internal */
  static formAssociated = true;

  /** @internal The default offset of the listbox to the button. */
  static offset = 6;

  /** @internal */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-describedby', 'aria-label', 'aria-labelledby'];
  }

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-listbox': Listbox,
      'sl-select-button': SelectButton
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the tooltip and the viewport. */
  static viewportMargin = 8;

  /** Events controller. */
  #events = new EventsController(this, { focusin: this.#onFocusin, focusout: this.#onFocusout });

  /** The initial state when the form was associated with the select. Used to reset the select. */
  #initialState?: T;

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
    isFocusableElement: (el: Option) => !el.disabled
  });

  /**m @internal The button in the light DOM. */
  button: Ref<SelectButton> = createRef();

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | undefined>>;

  /** Will display a clear button when an option is selected. */
  @property({ type: Boolean, reflect: true }) clearable?: boolean;

  /**
   * The current option in the listbox. This is the option that will become the
   * selected option if the user presses Enter/Space.
   * @internal
   */
  @state() currentOption?: Option<T>;

  /** Whether the select is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal */
  readonly internals = this.attachInternals();

  /** @internal The listbox element that is also the popover. */
  @query('sl-listbox') listbox?: Listbox;

  /** @internal */
  @queryAssignedElements({ selector: 'sl-option-group', flatten: true }) optionGroups?: OptionGroup[];

  /** @internal A flattened array of all options (even grouped ones). */
  get options(): Array<Option<T>> {
    const elements = this.renderRoot.querySelector('slot')?.assignedElements({ flatten: true }) ?? [];

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
   * @default md
   */
  @property({ reflect: true }) size?: SelectSize;

  /**
   * The number of pixels from the top of the viewport the select should be hidden on scroll.
   * Use this when there is a sticky header you don't want dropdowns to fall on top of.
   */
  @property({ type: Number, attribute: 'hide-margin-top' }) rootMarginTop: number = 0;

  /** The value for the select, to be used in forms. */
  @property() override value?: T;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setFormControlElement(this);

    // Listen for i18n updates and update the validation message
    this.#events.listen(window, LOCALE_STATUS_EVENT, this.#updateValueAndValidity);
  }

  /** @ignore Stores the initial state of the select */
  formAssociatedCallback(): void {
    this.#initialState = this.value;
  }

  /** @ignore Resets the select to the initial state */
  formResetCallback(): void {
    this.value = this.#initialState;
    this.changeEvent.emit(this.value);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('required')) {
      this.internals.ariaRequired = Boolean(this.required).toString();

      this.#updateValueAndValidity();
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

    if (this.button.value) {
      this.setAttributesTarget(this.button.value);
    }

    requestAnimationFrame(() => {
      if (this.internals.labels.length) {
        // Set the aria-label of the button to the concatenated text content of all labels
        // FIXME: This is a workaround because we do not yet have access to `referenceTarget`
        this.button.value?.setAttribute(
          'aria-label',
          Array.from(this.internals.labels)
            .map(label => (label as HTMLLabelElement).textContent?.trim())
            .join(' ')
        );
      }
    });
  }

  override render(): TemplateResult {
    return html`
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
        @toggle=${this.#onToggle}
        id="listbox"
        part="listbox"
        popover
      >
        <slot @slotchange=${this.#onSlotchange}></slot>
      </sl-listbox>

      <sl-select-button
        ${ref(this.button)}
        @click=${this.#onButtonClick}
        @keydown=${this.#onKeydown}
        @sl-clear=${this.#onClear}
        ?clearable=${this.clearable}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?show-valid=${this.showValid}
        .placeholder=${this.placeholder}
        .selected=${this.selectedOption}
        .showValidity=${this.showValidity}
        .size=${this.size}
        .tabIndex=${this.disabled ? -1 : 0}
        aria-expanded="false"
        aria-controls="listbox"
        aria-haspopup="listbox"
      ></sl-select-button>
    `;
  }

  #onBeforetoggle({ newState }: ToggleEvent): void {
    if (newState === 'open') {
      this.button.value?.setAttribute('aria-expanded', 'true');
      this.listbox!.style.width = `${this.button.value?.getBoundingClientRect().width}px`;

      this.currentOption = this.selectedOption ?? this.options[0];
    } else {
      this.button.value?.setAttribute('aria-expanded', 'false');
      this.#popoverClosing = true;
    }
  }

  #onButtonClick(): void {
    if (!this.listbox?.matches(':popover-open') && !this.#popoverClosing) {
      this.listbox?.showPopover({ source: this.button.value });
    }

    this.#popoverClosing = false;
  }

  #onClear(): void {
    this.#setSelectedOption(undefined, true);
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !this.listbox?.matches(':popover-open')) {
      event.preventDefault();
      event.stopPropagation();

      this.listbox?.showPopover({ source: this.button.value });
    }
  }

  #onListboxClick(event: Event & { target: HTMLElement }): void {
    const option = event.target?.closest<Option<T>>('sl-option');

    if (option) {
      this.#setSelectedOption(option);
      this.listbox?.hidePopover();
    }
  }

  #onListboxKeydown(event: KeyboardEvent): void {
    if (event.target instanceof Option && [' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      this.#setSelectedOption(event.target);
      this.listbox?.hidePopover();
    }
  }

  #onSlotchange(): void {
    this.options.forEach(option => option.setAttribute('aria-selected', 'false'));

    if (this.value !== undefined) {
      this.#setSelectedOption(
        this.options.find(option => option.value === this.value),
        false
      );
    } else {
      this.#setSelectedOption(undefined, false);
    }

    this.optionGroups?.forEach(group => {
      group.classList.remove('bottom-divider');

      if (group.nextElementSibling?.nodeName === 'SL-OPTION') {
        group.classList.add('bottom-divider');
      }
    });
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.#rovingTabindexController.focus();
    } else if (event.newState === 'closed') {
      this.#popoverClosing = false;
      this.button.value?.focus();
    }
  }

  /** Returns a flattened array of all options (also the options in groups). */
  #getAllOptions(root: Element): Array<Option<T>> {
    if (root instanceof Option) {
      return [root] as Array<Option<T>>;
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

    this.value = this.selectedOption?.value;

    if (emitEvent) {
      this.changeEvent.emit(this.value);
      this.updateState({ dirty: true });
    }

    this.#updateValueAndValidity();
  }

  #updateValueAndValidity(): void {
    this.internals.setFormValue(this.nativeFormValue);
    this.internals.setValidity(
      { valueMissing: this.required && !this.selectedOption },
      msg('Please choose an option from the list.')
    );

    this.updateValidity();

    // NOTE: for some reason setting `showValidity` to `undefined` in the
    // `updateValidity()` method doesn't trigger a `willUpdate` call. So we
    // work around that by updating it here.
    // this.button.showValidity = this.showValidity;
  }
}
