import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { type Infotip } from '@sl-design-system/infotip';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';
import { Tooltip } from '@sl-design-system/tooltip';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing,
  svg
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './checkbox.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox': Checkbox;
  }
}

export type CheckboxSize = 'sm' | 'md' | 'lg';

let nextUniqueId = 0;
const priorAriaHidden = new WeakMap<HTMLElement, string | null>();

/**
 * A checkbox with 3 states; unchecked, checked and intermediate.
 *
 * @csspart outer - The outer container of the checkbox.
 * @csspart inner - The inner container of the checkbox.
 * @csspart content - The container for the label and description.
 * @csspart label - The label of the checkbox.
 * @csspart description - The description of the checkbox.
 * @csspart tooltip - The tooltip element shown when tooltip property is set.
 *
 * @slot default - Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot description - Description text shown below the label.
 * @slot input - The slot for the input element
 * @slot infotip - The slot for the infotip element
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Checkbox<T = any> extends ForwardAriaMixin(
  FormControlMixin(ScopedElementsMixin(LitElement))
) {
  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    focusin: this.#onFocusin,
    focusout: this.#onFocusout,
    keydown: this.#onKeydown
  });

  /** The description instances in the light DOM. */
  #descriptions: HTMLElement[] = [];

  /** Previously owned description element references. */
  #previousDescriptions: HTMLElement[] = [];

  /** Previously owned tooltip element reference. */
  #previousTooltip?: HTMLElement;

  /** Light DOM tooltip description used by the native input. */
  #tooltipDescription?: HTMLElement;

  /** Previously owned light DOM tooltip description reference. */
  #previousTooltipDescription?: HTMLElement;

  /** External aria-describedby references forwarded to the native input. */
  #externalDescribedByElements: Element[] = [];

  /** External aria-describedby references owned by the host forwarding path. */
  #hostDescribedByElements: Element[] = [];

  /** Whether the description element was synthesized internally. */
  #isSynthesizedDescription = false;

  /** Whether the input element was synthesized internally. */
  #isSynthesizedInput = false;

  /** The input element synthesized internally. */
  #synthesizedInput?: HTMLInputElement;

  /** The label instance in the light DOM. */
  #label?: HTMLLabelElement;

  #mutationObserver = new MutationObserver(mutations => {
    const isOnlyInternal = mutations.every(m => {
      const target = m.target;
      return (
        (this.#isSynthesizedDescription &&
          this.#descriptions.some(
            description => target === description || description.contains(target)
          )) ||
        (this.#label && (target === this.#label || this.#label.contains(target))) ||
        (this.input && (target === this.input || this.input.contains(target)))
      );
    });
    if (isOnlyInternal) {
      return;
    }
    this.#onLabelSlotChange();
    this.#onDescriptionSlotChange();
  });

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /**
   * Whether the checkbox is checked.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** A description of the checkbox that will be rendered below the label. */
  @property() description?: string;

  /**
   * Whether the checkbox is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /**
   * Whether the checkbox has the indeterminate state.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate?: boolean;

  /** The input element in the light DOM. */
  input!: HTMLInputElement;

  /**
   * Whether the checkbox is required.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /**
   * When set will cause the control to show it is valid after reportValidity is called.
   *
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-valid' })
  override showValid?: boolean;

  @state() infotip?: Infotip;

  /**
   * The size of the checkbox.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: CheckboxSize;

  /** The text that will be shown in a tooltip. */
  @property() tooltip?: string;

  /**
   * The value of the checkbox when the checkbox is checked. See the formValue property for easy
   * access.
   */
  @property() override value?: T;

  override get formValue(): T | null {
    return this.checked ? ((this.value ?? true) as T) : null;
  }

  override set formValue(value: T | null) {
    this.checked = value === this.value || (this.value === undefined && value === true);
  }

  override get ariaDescribedByElements(): readonly Element[] | null {
    return super.ariaDescribedByElements;
  }

  override set ariaDescribedByElements(value: readonly Element[] | null) {
    this.#hostDescribedByElements = (value ?? []).filter(el => !this.#ownedAria().includes(el));
    this.#externalDescribedByElements = this.#hostDescribedByElements;
    super.ariaDescribedByElements = value ? [...value] : null;
    queueMicrotask(() => this.#syncAria());
  }

  override removeAttribute(name: string): void {
    super.removeAttribute(name);
    if (name === 'aria-describedby') {
      queueMicrotask(() => {
        this.#hostDescribedByElements = this.#externalAriaFromInput();
        this.#externalDescribedByElements = this.#hostDescribedByElements;
        this.#syncAria();
      });
    }
  }

  override connectedCallback(): void {
    this.#hostDescribedByElements = this.#uniqueAriaRefs([
      ...this.#hostDescribedByElements,
      ...this.#ariaDescribedByAttributeElements(this.getAttribute('aria-describedby'))
    ]);
    this.#externalDescribedByElements = this.#hostDescribedByElements;

    super.connectedCallback();

    if (!this.input) {
      this.input =
        this.querySelector<HTMLInputElement>('input[slot="input"]') || this.#createInput();
      this.input.slot = 'input';
      this.input.type = 'checkbox';
      this.#syncInput(this.input);

      if (!this.input.parentElement) {
        this.append(this.input);
      }

      // This is a workaround because we can't style the inner part based on :focus-visible and ::slotted
      const style = document.createElement('style');
      style.innerHTML = `
        sl-checkbox:has(input:focus-visible)::part(inner) {
          outline-color: var(--sl-color-border-focused);
          transition: 200ms ease-in-out;
          transition-property: background, border-color, color, outline-color;
        }
      `;
      this.append(style);
    }

    this.setFormControlElement(this.input);

    this.#mutationObserver.observe(this, {
      characterData: true,
      childList: true,
      subtree: true
    });

    this.#onLabelSlotChange();
    this.#onDescriptionSlotChange();
    queueMicrotask(() => this.#syncAria());
  }

  override disconnectedCallback(): void {
    this.#mutationObserver.disconnect();

    if (
      this.#descriptions.length &&
      !this.#isSynthesizedDescription &&
      this.#descriptions.some(description => priorAriaHidden.has(description))
    ) {
      this.#descriptions.forEach(description => this.#restoreAriaHidden(description));
    }

    super.disconnectedCallback();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#onDescriptionSlotChange();
    this.#syncAria();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    const props: Array<keyof Checkbox> = ['checked', 'disabled', 'indeterminate', 'required'];

    if (props.some(prop => changes.has(prop))) {
      this.#syncInput(this.input);
    }

    if (changes.has('description')) {
      const hasCustomSlotted = Array.from(this.childNodes).some(
        node =>
          (!this.#isSynthesizedDescription || !this.#descriptions.includes(node as HTMLElement)) &&
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).getAttribute('slot') === 'description'
      );
      if (this.description?.trim() && !hasCustomSlotted) {
        this.#ensureSynthesizedDescription();
      } else if (
        !this.description?.trim() &&
        this.#descriptions.length &&
        this.#isSynthesizedDescription
      ) {
        this.#descriptions.forEach(description => description.remove());
        this.#descriptions = [];
        this.#isSynthesizedDescription = false;
      }
      this.#syncAria();
      this.toggleAttribute('has-description', this.#descriptionText().length > 0);
    }

    if (changes.has('tooltip')) {
      this.#syncTooltipDescription();
      this.#syncAria();
      requestAnimationFrame(() => this.#syncAria());
    }

    if (changes.has('disabled')) {
      this.updateValidity();
    }

    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value?.toString() || '';
    }
  }

  override render(): TemplateResult {
    return html`
      <div id="wrapper" part="wrapper">
        <slot
          @keydown=${this.#onKeydown}
          @slotchange=${this.#onInputSlotChange}
          name="input"></slot>
        <div part="outer">
          <div part="inner">
            <svg
              aria-hidden="true"
              class=${classMap({
                checked: !!this.checked,
                indeterminate: !!this.indeterminate
              })}
              part="svg"
              version="1.1"
              viewBox="0 0 24 24">
              ${
                this.indeterminate
                  ? svg`<path d="M4.1,12 9,12 20.3,12"></path>`
                  : svg`<path d="M4.1,12.7 9,17.6 20.3,6.3"></path>`
              }
            </svg>
          </div>
        </div>
        <div part="content">
          <span part="label">
            <slot name="label"></slot>
            <slot @slotchange=${() => this.#onLabelSlotChange()} style="display: none"></slot>
          </span>
          <span part="description">
            <slot name="description" @slotchange=${() => this.#onDescriptionSlotChange()}
              >${this.description}</slot
            >
          </span>
        </div>
      </div>
      <slot name="infotip" @slotchange=${() => this.#onInfotipSlotChange()}></slot>
      <slot name="tooltip-description"></slot>
      ${this.tooltip
        ? html`
            <sl-tooltip
              for="wrapper"
              part="tooltip"
              style="position-area: right; position-try-fallbacks: flip-inline, top"
              type="description">
              ${this.tooltip}
            </sl-tooltip>
          `
        : nothing}
    `;
  }

  override focus(): void {
    this.input.focus();
  }

  override blur(): void {
    this.input.blur();
  }

  override getLocalizedValidationMessage(): string {
    if (!this.validity.customError && this.validity.valueMissing) {
      return msg('Please check this box.', {
        id: 'sl.checkbox.validation.valueMissing'
      });
    }

    return super.getLocalizedValidationMessage();
  }

  #onClick(event: Event): void {
    if (this.disabled || (this.infotip && event.composedPath().includes(this.infotip))) {
      return;
    }

    const label = event
      .composedPath()
      .find((el): el is HTMLLabelElement => el instanceof HTMLLabelElement);
    if (label?.parentElement === this) {
      this.input.click();

      event.preventDefault();
      event.stopPropagation();

      // Return early to prevent the checkbox from being toggled twice
      return;
    }

    event.stopPropagation();

    this.checked = !this.checked;
    this.input.checked = this.checked;
    this.changeEvent.emit(this.formValue);
    this.updateState({ dirty: true });
    this.updateValidity();
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      this.#onClick(event);
    }
  }

  #onInputSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      input =
        elements.find(
          (el): el is HTMLInputElement =>
            el instanceof HTMLInputElement && el !== this.#synthesizedInput
        ) ?? this.#synthesizedInput;

    // Handle the scenario where a custom input is being slotted after `connectedCallback`
    if (input) {
      const customValidity = this.#customValidityMessage(input);
      if (this.input && this.input !== input) {
        this.#clearOwnedAriaFrom(this.input);
        if (this.#isSynthesizedInput && this.input.parentElement === this) {
          this.input.remove();
        }
      }
      this.input = input;
      this.#isSynthesizedInput = input === this.#synthesizedInput;
      this.#syncInput(this.input, customValidity);
      this.#syncAria();
      this.#syncLabelTarget();
      if (this.#isSynthesizedInput && !this.input.parentElement) {
        this.append(this.input);
      }

      this.setFormControlElement(this.input);
    } else if (!this.#isSynthesizedInput) {
      const customValidity = this.input.validity.customError ? this.input.validationMessage : '';
      const input = this.#synthesizedInput ?? this.#createInput();
      this.input = input;
      this.#syncInput(this.input, customValidity);
      this.#syncAria();
      this.#syncLabelTarget();
      this.append(this.input);

      this.setFormControlElement(this.input);
    }
  }

  #onLabelSlotChange(): void {
    const nodes = Array.from(this.childNodes).filter(
      node =>
        node.nodeType === Node.TEXT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE &&
          !(node as Element).hasAttribute('slot') &&
          !(node instanceof HTMLStyleElement))
    );

    if (!nodes.length && this.#label) {
      // Prevent an infinite loop
      return;
    }

    const labelText = this.#labelText();
    if (nodes.length > 0 && labelText.length > 0) {
      this.#label ||= document.createElement('label');
      this.#syncLabelTarget();
      this.#label.id ||= `sl-checkbox-label-${nextUniqueId++}`;
      this.#label.setAttribute('aria-hidden', 'true');
      this.#label.slot = 'label';
      this.#label.append(...nodes);
      this.append(this.#label);
    }

    requestAnimationFrame(() => {
      // Only link the label(s) if nothing else labels the input already. Checking the attribute is
      // not enough: assigning `ariaLabelledByElements` (which is how an sl-tooltip labels its
      // anchor) reflects an empty `aria-labelledby` attribute, and removing those references again
      // leaves that empty attribute behind.
      const labelledBy =
        !!this.input.getAttribute('aria-labelledby') || !!this.input.ariaLabelledByElements?.length;

      if (!labelledBy && this.input.labels?.length) {
        this.input.setAttribute(
          'aria-labelledby',
          Array.from(this.input.labels)
            .map(label => label.id)
            .join(' ')
        );
      }
    });

    if (this.infotip && !this.infotip.describes) {
      this.infotip.describes = labelText;
    }

    this.toggleAttribute('no-label', labelText.length === 0);
  }

  #labelText(): string {
    const labelSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="label"]'),
      labelSlotNodes = labelSlot?.assignedNodes({ flatten: true }) || [],
      lightDomNodes = Array.from(this.childNodes).filter(
        node =>
          node.nodeType === Node.TEXT_NODE ||
          (node.nodeType === Node.ELEMENT_NODE &&
            !(node as Element).hasAttribute('slot') &&
            !(node instanceof HTMLStyleElement))
      ),
      nodes = labelSlotNodes.length ? labelSlotNodes : lightDomNodes;

    return nodes
      .map(node => node.textContent?.trim() || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  #ensureSynthesizedDescription(): void {
    if (!this.description?.trim()) {
      if (this.#descriptions.length && this.#isSynthesizedDescription) {
        this.#descriptions.forEach(description => description.remove());
        this.#descriptions = [];
        this.#isSynthesizedDescription = false;
      }
      return;
    }

    const [description] = this.#descriptions;
    if (!description || !description.parentElement || !this.#isSynthesizedDescription) {
      const synthesized = document.createElement('span');
      synthesized.id ||= `sl-checkbox-description-${nextUniqueId++}`;
      synthesized.slot = 'description';
      synthesized.setAttribute('aria-hidden', 'true');
      this.#isSynthesizedDescription = true;
      this.#descriptions = [synthesized];
      this.append(synthesized);
    }
    if (this.#descriptions[0].textContent !== this.description) {
      this.#descriptions[0].textContent = this.description;
    }
  }

  #onDescriptionSlotChange(): void {
    const slottedDescriptions = Array.from(this.childNodes).filter(
      (node): node is HTMLElement =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).getAttribute('slot') === 'description' &&
        (!this.#isSynthesizedDescription || !this.#descriptions.includes(node as HTMLElement))
    );

    if (slottedDescriptions.length) {
      if (this.#isSynthesizedDescription) {
        this.#descriptions.forEach(description => description.remove());
      } else {
        this.#descriptions
          .filter(description => !slottedDescriptions.includes(description))
          .forEach(description => this.#restoreAriaHidden(description));
      }
      slottedDescriptions.forEach(description => {
        description.id ||= `sl-checkbox-description-${nextUniqueId++}`;
        if (!priorAriaHidden.has(description)) {
          priorAriaHidden.set(description, description.getAttribute('aria-hidden'));
        }
        description.setAttribute('aria-hidden', 'true');
      });
      this.#descriptions = slottedDescriptions;
      this.#isSynthesizedDescription = false;
    } else if (this.description?.trim()) {
      if (!this.#isSynthesizedDescription) {
        this.#descriptions.forEach(description => this.#restoreAriaHidden(description));
      }
      this.#ensureSynthesizedDescription();
    } else if (this.#descriptions.length) {
      if (this.#isSynthesizedDescription) {
        this.#descriptions.forEach(description => description.remove());
      } else {
        this.#descriptions.forEach(description => this.#restoreAriaHidden(description));
      }
      this.#descriptions = [];
      this.#isSynthesizedDescription = false;
    }

    this.#syncAria();
    this.toggleAttribute('has-description', this.#descriptionText().length > 0);
  }

  #descriptionText(): string {
    const slottedNodes = Array.from(this.childNodes).filter(
      node =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).getAttribute('slot') === 'description' &&
        (!this.#isSynthesizedDescription || !this.#descriptions.includes(node as HTMLElement))
    );

    const descriptionSlot = this.shadowRoot?.querySelector<HTMLSlotElement>(
        'slot[name="description"]'
      ),
      descriptionSlotNodes = (descriptionSlot?.assignedNodes({ flatten: true }) || []).filter(
        node =>
          !(
            this.#isSynthesizedDescription &&
            node instanceof HTMLElement &&
            this.#descriptions.includes(node)
          )
      ),
      nodes = descriptionSlotNodes.length ? descriptionSlotNodes : slottedNodes;

    if (!nodes.length) {
      return this.description?.trim() || '';
    }

    return nodes
      .map(node => node.textContent?.trim() || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  #syncAria(): void {
    if (!this.input) {
      return;
    }

    const previousOwned = this.#ownedAria();

    const existingRefs = (this.input.ariaDescribedByElements ?? []).filter(
      el => !previousOwned.includes(el)
    );

    this.#externalDescribedByElements = this.#uniqueAriaRefs([
      ...this.#hostDescribedByElements,
      ...existingRefs
    ]);

    const nextRefs = [...this.#externalDescribedByElements];
    nextRefs.push(...this.#descriptions);
    if (this.#tooltipDescription) {
      nextRefs.push(this.#tooltipDescription);
    }

    this.input.ariaDescribedByElements = nextRefs.length > 0 ? nextRefs : null;
    this.#syncAriaDescribedByAttribute(nextRefs);
    this.#previousDescriptions = this.#descriptions;
    this.#previousTooltipDescription = this.#tooltipDescription;
    this.#previousTooltip =
      this.shadowRoot?.querySelector<HTMLElement>('[part="tooltip"]') ?? undefined;
  }

  #clearOwnedAriaFrom(input: HTMLInputElement): void {
    const owned = this.#ownedAria(),
      nextRefs = (input.ariaDescribedByElements ?? []).filter(el => !owned.includes(el));

    input.ariaDescribedByElements = nextRefs.length > 0 ? nextRefs : null;
    this.#syncAriaDescribedByAttribute(nextRefs, input);
  }

  #ownedAria(): Element[] {
    const elements: Array<Element | undefined> = [
      ...this.#previousDescriptions,
      ...this.#descriptions,
      this.#previousTooltipDescription,
      this.#tooltipDescription,
      this.#previousTooltip
    ];

    return elements.filter((el): el is Element => !!el);
  }

  #uniqueAriaRefs(elements: Element[]): Element[] {
    return Array.from(new Set(elements));
  }

  #syncAriaDescribedByAttribute(elements: Element[], input = this.input): void {
    if (!elements.length) {
      input.removeAttribute('aria-describedby');
      return;
    }

    const ids = elements.map(el => (el instanceof HTMLElement ? el.id : '')).filter(Boolean);
    if (ids.length === elements.length) {
      input.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  #externalAriaFromInput(): Element[] {
    return this.#externalAriaFrom(this.input);
  }

  #externalAriaFrom(input?: HTMLInputElement): Element[] {
    const owned = this.#ownedAria();

    return (input?.ariaDescribedByElements ?? []).filter(el => !owned.includes(el));
  }

  #ariaDescribedByAttributeElements(value: string | null): HTMLElement[] {
    const root = this.getRootNode() as Document | ShadowRoot;

    return (value ?? '')
      .split(/\s+/)
      .map(id => (id ? root.querySelector<HTMLElement>(`#${CSS.escape(id)}`) : null))
      .filter((el): el is HTMLElement => !!el);
  }

  #restoreAriaHidden(description: HTMLElement): void {
    if (priorAriaHidden.has(description)) {
      const prior = priorAriaHidden.get(description);
      if (prior !== null && prior !== undefined) {
        description.setAttribute('aria-hidden', prior);
      } else {
        description.removeAttribute('aria-hidden');
      }
      priorAriaHidden.delete(description);
    }
  }

  #syncTooltipDescription(): void {
    const tooltip = this.tooltip?.trim();

    if (!tooltip) {
      this.#tooltipDescription?.remove();
      this.#tooltipDescription = undefined;
      return;
    }

    if (!this.#tooltipDescription?.parentElement) {
      this.#tooltipDescription = document.createElement('span');
      this.#tooltipDescription.id ||= `sl-checkbox-tooltip-description-${nextUniqueId++}`;
      this.#tooltipDescription.slot = 'tooltip-description';
      this.append(this.#tooltipDescription);
    }
    if (this.#tooltipDescription.textContent !== tooltip) {
      this.#tooltipDescription.textContent = tooltip;
    }
  }

  #syncLabelTarget(): void {
    if (this.#label) {
      this.#label.htmlFor = this.input.id;
    }
  }

  #createInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.slot = 'input';
    input.type = 'checkbox';
    this.#synthesizedInput = input;
    this.#isSynthesizedInput = true;
    return input;
  }

  #customValidityMessage(input = this.input): string | undefined {
    if (this.input?.validity.customError) {
      return this.input.validationMessage;
    }

    if (input === this.#synthesizedInput) {
      return this.customValidity ?? '';
    }

    return this.customValidity;
  }

  #onInfotipSlotChange(): void {
    const slot: HTMLSlotElement | undefined | null =
      this.shadowRoot?.querySelector('slot[name="infotip"]');
    const assignedElements = slot?.assignedElements({ flatten: true }) || [];
    this.infotip =
      assignedElements.find(
        (el): el is Infotip => el instanceof HTMLElement && el.tagName === 'SL-INFOTIP'
      ) || undefined;
    if (this.infotip) {
      this.infotip.setAttribute('size', 'sm');
    }
    if (this.infotip && !this.infotip.describes) {
      // Ensure label is synthesized before reading it
      this.#onLabelSlotChange();

      this.infotip.describes = this.#labelText();
    }
  }

  #syncInput(input: HTMLInputElement, customValidity = this.customValidity): void {
    input.autofocus = this.autofocus;
    input.disabled = !!this.disabled;
    input.id ||= `sl-checkbox-${nextUniqueId++}`;
    input.name = this.name ?? '';
    input.required = !!this.required;
    input.value = this.value?.toString() || '';

    input.checked = !!this.checked;
    input.indeterminate = !!this.indeterminate;
    if (customValidity !== undefined) {
      input.setCustomValidity(customValidity);
    }
    if (this.showValidity === 'invalid') {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }

    this.setProxyTarget(input);
    this.#syncAria();
    queueMicrotask(() => this.#syncAria());
  }
}
