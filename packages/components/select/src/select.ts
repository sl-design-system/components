import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Listbox, Option, OptionGroup } from '@sl-design-system/listbox';
import {
  type EventEmitter,
  EventsController,
  ObserveAttributesMixin,
  anchor,
  event,
  isPopoverOpen
} from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
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

  /** Since we can't use `popovertarget`, we need to monitor the closing state manually. */
  #popoverClosing = false;

  /** @internal */
  readonly internals = this.attachInternals();

  /**m @internal The button in the light DOM. */
  button: Ref<SelectButton> = createRef();

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | undefined>>;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal The listbox element that is also the popover. */
  @query('sl-listbox') listbox?: Listbox;

  /** @internal */
  @queryAssignedElements({ selector: 'sl-option-group', flatten: false }) optionGroups?: OptionGroup[];

  /** @internal A flattened array of all options (even grouped ones). */
  get options(): Array<Option<T>> {
    const elements =
      this.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])')?.assignedElements({ flatten: true }) ?? [];

    return elements.flatMap(element => this.#getAllOptions(element));
  }

  /**
   * The current option in the listbox. This is the option that will become the
   * selected option if the user presses Enter/Space.
   * @internal
   */
  @state() currentOption?: Option<T>;

  /** Whether the select is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Boolean for tracking the expanded state of the popover. */
  @state() expanded?: boolean;

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

    // // This is a workaround because `ariaActiveDescendantElement` is only supported in
    // // Safari at the time of writing. By putting the button in the light DOM, we can use
    // // the aria-activedescendant attribute on the button itself.
    // if (!this.button) {
    //   this.button = this.shadowRoot!.createElement('sl-select-button');
    //   this.button.addEventListener('click', () => this.#onButtonClick());
    //   this.button.addEventListener('keydown', (event: KeyboardEvent) => this.#onKeydown(event));
    //   this.button.disabled = !!this.disabled;
    //   this.button.placeholder = this.placeholder;
    //   this.button.size = this.size;
    //   this.button.setAttribute('aria-expanded', 'false');
    //   this.prepend(this.button);

    //   // This is a workaround because `::slotted` does not allow you to select children
    //   // of the slotted elements. For example grouped options.
    //   const style = document.createElement('style');
    //   style.innerHTML = `
    //     sl-select:has(sl-select-button:focus-visible) .sl-current {
    //       background-color: var(--sl-color-select-item-hover-background);
    //     }
    //   `;
    //   this.prepend(style);
    // }

    this.setFormControlElement(this);

    // if (this.button) {
    //   this.setAttributesTarget(this.button);
    // }

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

    if (changes.has('currentOption')) {
      this.options.forEach(option => option.classList.toggle('sl-current', option === this.currentOption));
      // this.currentOption?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

      // if (this.currentOption) {
      //   this.button.setAttribute('aria-activedescendant', this.currentOption.id);
      // } else {
      //   this.button.removeAttribute('aria-activedescendant');
      // }
    }

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

  // override firstUpdated(changes: PropertyValues<this>): void {
  //   super.firstUpdated(changes);

  //   requestAnimationFrame(() => {
  //     this.button.setAttribute('aria-controls', this.wrapper.id);

  //     if (this.internals.labels.length) {
  //       this.button.setAttribute(
  //         'aria-labelledby',
  //         Array.from(this.internals.labels)
  //           .map(label => (label as HTMLLabelElement).id)
  //           .join(' ')
  //       );
  //     }
  //   });
  // }

  override render(): TemplateResult {
    return html`
      <sl-select-button
        ${ref(this.button)}
        @click=${this.#onButtonClick}
        @keydown=${this.#onKeydown}
        ?disabled=${this.disabled}
        ?required=${this.required}
        .placeholder=${this.placeholder}
        .selected=${this.selectedOption}
        .showValidity=${this.showValidity}
        .size=${this.size}
        aria-expanded=${Boolean(this.expanded).toString()}
        aria-controls="listbox"
      ></sl-select-button>

      <sl-listbox
        ${anchor({
          element: this.button,
          offset: Select.offset,
          position: 'bottom-start',
          viewportMargin: Select.viewportMargin,
          rootMarginTop: this.rootMarginTop
        })}
        @beforetoggle=${this.#onBeforetoggle}
        @click=${this.#onListboxClick}
        @toggle=${this.#onToggle}
        id="listbox"
        part="listbox"
        popover
      >
        <slot @slotchange=${this.#onSlotchange}></slot>
      </sl-listbox>
    `;
  }

  override focus(options?: FocusOptions): void {
    this.button.value?.focus(options);
  }

  #onBeforetoggle({ newState }: ToggleEvent): void {
    if (newState === 'open') {
      this.listbox!.style.width = `${this.button.value?.getBoundingClientRect().width}px`;

      this.currentOption = this.selectedOption ?? this.options[0];
    } else {
      this.#popoverClosing = true;
    }
  }

  #onButtonClick(): void {
    if (!this.listbox?.matches(':popover-open') && !this.#popoverClosing) {
      this.listbox?.showPopover();
    }

    this.#popoverClosing = false;
  }

  #onClick(event: Event): void {
    if (event.target === this || event.target === this.button) {
      this.button.value?.focus();
    }
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onKeydown(event: KeyboardEvent): void {
    const options = this.options.filter(o => !o.disabled),
      size = options.length;

    let delta = 0,
      index = options.indexOf(this.currentOption ?? this.selectedOption ?? this.options[0]);

    switch (event.key) {
      case 'ArrowDown':
        if (isPopoverOpen(this.listbox)) {
          delta = 1;
        } else {
          this.listbox?.showPopover();
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
          this.#setSelectedOption(this.currentOption);
          this.listbox?.hidePopover();
        } else {
          this.listbox?.showPopover();
        }

        return;
      default:
        return;
    }

    index = (index + delta + size) % size;
    this.currentOption = options[index];

    event.preventDefault();
    event.stopPropagation();
  }

  #onListboxClick(event: Event & { target: HTMLElement }): void {
    const option = event.target?.closest<Option<T>>('sl-option');

    if (option) {
      this.#setSelectedOption(option);
      this.listbox?.hidePopover();
    }
  }

  #onSlotchange(): void {
    this.#setSelectedOption(
      this.options.find(option => option.value === this.value),
      false
    );

    this.optionGroups?.forEach(group => {
      group.classList.remove('bottom-divider');

      if (group.nextElementSibling?.nodeName === 'SL-OPTION') {
        group.classList.add('bottom-divider');
      }
    });
  }

  #onToggle(event: ToggleEvent): void {
    this.expanded = event.newState === 'open';

    if (event.newState === 'closed') {
      this.#popoverClosing = false;
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
    }

    this.selectedOption = option;
    if (this.selectedOption) {
      this.selectedOption.selected = true;
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
