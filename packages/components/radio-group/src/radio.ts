import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import { type Infotip } from '@sl-design-system/infotip';
import { EventsController } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './radio.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-radio': Radio;
  }
}

export type RadioButtonSize = 'md' | 'lg';

let nextUniqueId = 0;
const priorAriaHidden = new WeakMap<HTMLElement, string | null>();

/**
 * A radio button with 2 states; unchecked and checked.
 *
 * @csspart svg - The svg element that contains the radio button circle.
 * @csspart box - The box element that contains the radio button background and border.
 * @csspart wrapper - The wrapper element that carries the radio role.
 * @csspart content - The container for the label and description.
 * @csspart label - The label of the radio button.
 * @csspart description - The description of the radio button.
 * @csspart tooltip - The tooltip element shown when tooltip property is set.
 *
 * @slot default - Text label of the radio button. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot description - Description text shown below the label.
 * @slot infotip - The slot for the infotip element
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Radio<T = any> extends ScopedElementsMixin(LitElement) {
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

  /** The description instances in the light DOM. */
  #descriptions: HTMLElement[] = [];

  /** Previously owned description element references. */
  #previousDescriptions: HTMLElement[] = [];

  /** Previously owned tooltip element reference. */
  #previousTooltip?: HTMLElement;

  /** Whether the description element was synthesized internally. */
  #isSynthesizedDescription = false;

  #mutationObserver = new MutationObserver(mutations => {
    const isOnlyInternal = mutations.every(m => {
      const target = m.target;
      return (
        this.#isSynthesizedDescription &&
        this.#descriptions.some(
          description => target === description || description.contains(target)
        )
      );
    });
    if (isOnlyInternal) {
      return;
    }
    this.#onLabelSlotChange();
    this.#onDescriptionSlotChange();
  });

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** Whether the radio button is checked. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** A description of the radio that will be rendered below the label. */
  @property() description?: string;

  /** Whether this radio button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Indicates if the radio button shows it is (in)valid. */
  @property({ attribute: 'show-validity', reflect: true })
  showValidity: FormControlShowValidity;

  @state() infotip?: Infotip;

  /** @internal The wrapper element that carries the radio role. */
  @query('[part="wrapper"]') private wrapper!: HTMLElement;

  /**
   * The size of the radio button.
   *
   * @default md
   */
  @property({ reflect: true }) size?: RadioButtonSize;

  /** The text that will be shown in a tooltip. */
  @property() tooltip?: string;

  /** The value for this radio button. */
  @property() value?: T;

  #tabIndex = 0;

  override get tabIndex(): number {
    return this.#tabIndex;
  }

  override set tabIndex(value: number) {
    const oldValue = this.#tabIndex;
    this.#tabIndex = value;

    // Sync wrapper tabIndex immediately when host tabIndex changes
    // This ensures RovingTabindexController changes are reflected in the wrapper
    if (this.wrapper && oldValue !== value) {
      this.wrapper.tabIndex = value;
    }

    // Always serialize tabIndex to the attribute to match native behavior
    this.setAttribute('tabindex', value.toString());
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Make sure aria-checked is always set
    this.checked ??= false;

    // Initialize host tabIndex (will be overridden by RovingTabindexController in groups)
    // Use the setter to ensure attribute is serialized
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    } else {
      // Read existing attribute value
      this.#tabIndex = parseInt(this.getAttribute('tabindex') || '0', 10);
    }

    this.#mutationObserver.observe(this, {
      characterData: true,
      childList: true,
      subtree: true
    });

    this.#onLabelSlotChange();
    this.#onDescriptionSlotChange();
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

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (this.wrapper) {
      if (changes.has('checked')) {
        this.wrapper.setAttribute('aria-checked', Boolean(this.checked).toString());
      }

      // Manage host tabIndex based on disabled state (when not in a group)
      // RovingTabindexController will override this when in a group
      if (changes.has('disabled')) {
        this.tabIndex = this.disabled ? -1 : 0;
      }

      // Always ensure wrapper tabIndex is synced (especially on first render)
      this.wrapper.tabIndex = this.tabIndex;
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
      this.#syncAria();
      requestAnimationFrame(() => this.#syncAria());
    }
  }

  override render(): TemplateResult {
    return html`
      <div
        id="wrapper"
        part="wrapper"
        role="radio"
        aria-checked=${Boolean(this.checked)}
        aria-disabled=${this.disabled ? 'true' : 'false'}>
        <div part="box">
          ${this.checked
            ? html`
                <svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="6"></circle>
                </svg>
              `
            : html`<svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24"></svg>`}
        </div>
        <div part="content">
          <span part="label">
            <slot @slotchange=${() => this.#onLabelSlotChange()}></slot>
          </span>
          <span part="description">
            <slot name="description" @slotchange=${() => this.#onDescriptionSlotChange()}
              >${this.description}</slot
            >
          </span>
        </div>
      </div>
      <slot name="infotip" @slotchange=${() => this.#onInfotipSlotChange()}></slot>
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

  override firstUpdated(): void {
    this.#onLabelSlotChange();
    this.#onDescriptionSlotChange();
    this.#onInfotipSlotChange();
    this.#syncAria();
  }

  override focus(): void {
    this.wrapper?.focus();
  }

  override blur(): void {
    this.wrapper?.blur();
  }

  #onClick(event: Event): void {
    if (this.disabled || (this.infotip && event.composedPath().includes(this.infotip))) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.checked = true;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }

  #labelText(): string {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])'),
      nodes = slot?.assignedNodes({ flatten: true }) || [];

    return nodes
      .map(node => node.textContent?.trim() || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  #onLabelSlotChange(): void {
    if (this.infotip && !this.infotip.describes) {
      this.infotip.describes = this.#labelText();
    }
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
      synthesized.id ||= `sl-radio-description-${nextUniqueId++}`;
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
        description.id ||= `sl-radio-description-${nextUniqueId++}`;
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
    if (!this.wrapper) {
      return;
    }

    const tooltip = this.shadowRoot?.querySelector<HTMLElement>('[part="tooltip"]');
    const previousOwned = [...this.#previousDescriptions, this.#previousTooltip].filter(
      (el): el is HTMLElement => !!el
    );

    const existingRefs = (this.wrapper.ariaDescribedByElements ?? []).filter(
      el => !previousOwned.includes(el as HTMLElement)
    );

    const nextRefs = [...existingRefs];
    nextRefs.push(...this.#descriptions);
    if (tooltip) {
      nextRefs.push(tooltip);
    }

    this.wrapper.ariaDescribedByElements = nextRefs.length > 0 ? nextRefs : null;
    this.#previousDescriptions = this.#descriptions;
    this.#previousTooltip = tooltip ?? undefined;
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

  #onInfotipSlotChange(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="infotip"]'),
      assignedElements = slot?.assignedElements({ flatten: true }) || [];

    this.infotip =
      assignedElements.find(
        (el): el is Infotip => el instanceof HTMLElement && el.tagName === 'SL-INFOTIP'
      ) || undefined;

    if (this.infotip) {
      this.infotip.setAttribute('size', 'sm');

      if (!this.infotip.describes) {
        this.infotip.describes = this.#labelText();
      }
    }
  }
}
