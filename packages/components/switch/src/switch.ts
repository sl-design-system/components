import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type Infotip } from '@sl-design-system/infotip';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { cssState } from '@sl-design-system/shared/decorators/css-state.js';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { ElementInternalsMixin } from '@sl-design-system/shared/mixins/element-internals.js';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins/forward-aria.js';
import { getSlottedText } from '@sl-design-system/shared/slot.js';
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
import styles from './switch.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-switch': Switch;
  }
}

export type SwitchSize = 'sm' | 'md' | 'lg';

/**
 * A toggle switch.
 *
 * @customelement sl-switch
 *
 * @slot - Text label of the switch. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot description - Additional information about the switch, displayed below the label.
 * @slot infotip - The slot for the infotip element
 *
 * @csspart container - The wrapper around all the other elements; it defines the layout.
 * @csspart description - The wrapper around the description, below the label.
 * @csspart label - The wrapper around the label text.
 * @csspart toggle - The wrapper around the input and the track.
 * @csspart tooltip - The tooltip element that is shown when the <code>tooltip</code> attribute is set.
 * @csspart track - The track the handle moves in.
 * @csspart handle - The handle that moves from one side of the track to the other.
 *
 * @cssstate has-description - Set when there is text in the description slot.
 * @cssstate has-infotip - Set when there is an infotip in the infotip slot.
 * @cssstate no-label - Set when there is no text in the default slot.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Switch<T = any> extends ForwardAriaMixin(
  FormControlMixin(ScopedElementsMixin(ElementInternalsMixin(LitElement)))
) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** The initial state of the switch. */
  #initialState = false;

  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the checked state changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /**
   * Whether the switch is on or off.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /**
   * Whether the switch is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /**
   * Icon in "off" state.
   *
   * @default 'xmark'
   */
  @property({ attribute: 'icon-off' }) iconOff?: string;

  /**
   * Icon in "on" state.
   *
   * @default 'check'
   */
  @property({ attribute: 'icon-on' }) iconOn?: string;

  /** @internal Whether there is content in the description slot. */
  @state() @cssState() hasDescription?: boolean;

  /** @internal Whether there is text in the default slot. */
  @state() @cssState('no-label', { invert: true }) hasLabel?: boolean;

  /** @internal The infotip instance when one is slotted. */
  @state() @cssState('has-infotip') infotip?: Infotip;

  /** @internal The input element in the shadow DOM. */
  @query('input') input!: HTMLInputElement;

  /**
   * When set, the toggle is shown before the label.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) reverse?: boolean;

  /**
   * The size of the switch.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: SwitchSize;

  /** The text that will be shown in a tooltip. */
  @property() tooltip?: string;

  /** The value of the switch when the switch is checked. See the formValue property for easy access. */
  @property() override value?: T;

  override get formValue(): T | null {
    return this.checked ? ((this.value ?? true) as T) : null;
  }

  override set formValue(value: T | null) {
    this.checked = value === this.value || (this.value === undefined && value === true);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.#eventController.signal.aborted) {
      this.#eventController = new AbortController();
    }

    const { signal } = this.#eventController;

    this.addEventListener('click', this.#onClick, { signal });
    this.addEventListener('focusin', this.#onFocusin, { signal });
    this.addEventListener('focusout', this.#onFocusout, { signal });

    this.setFormControlElement(this);
  }

  override disconnectedCallback(): void {
    this.#eventController.abort();

    super.disconnectedCallback();
  }

  /** @internal */
  formAssociatedCallback(): void {
    this.#initialState = this.hasAttribute('checked');
  }

  /** @internal */
  formResetCallback(): void {
    this.checked = this.#initialState;
    this.changeEvent.emit(this.formValue);
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.setProxyTarget(this.input);

    this.elementInternals.setFormValue(this.nativeFormValue);
    this.updateValidity();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    // The slots do not exist yet during the first render, so derive this from the light DOM;
    // `slotchange` triggers another update when the content changes later on.
    this.hasDescription = !!this.querySelector('[slot="description"]');
    this.hasLabel = !!this.#labelText();

    if (this.hasUpdated && changes.has('disabled')) {
      this.updateValidity();
    }

    if (changes.has('checked') || changes.has('value')) {
      this.elementInternals.setFormValue(this.nativeFormValue);
    }
  }

  override render(): TemplateResult {
    const icon = this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark',
      size = this.size === 'md' ? 'xs' : 'md',
      // The tooltip only labels the switch when nothing else does; when the switch already has a
      // name - a label, an `aria-label`, an `<sl-label>` - it describes it instead.
      hasName = this.hasLabel || this.hasAccessibleName();

    const describedBy = [this.hasDescription && 'description', this.tooltip && hasName && 'tooltip']
      .filter(Boolean)
      .join(' ');

    const labelledBy = [this.hasLabel && 'label', this.tooltip && !hasName && 'tooltip']
      .filter(Boolean)
      .join(' ');

    // When the default slot's content is itself a forwarded `<slot>` (e.g. this switch is used
    // inside another component's shadow DOM, such as a menu item), that outer component's own
    // accessible name is already derived from the same text. Hide the label here so it isn't
    // announced twice; `aria-labelledby` on the input still resolves it for the switch itself.
    const isLabelForwarded = Array.from(this.childNodes).some(
      node => node instanceof HTMLSlotElement
    );

    return html`
      <div part="container">
        <div @click=${this.#onWrapperClick} id="wrapper" part="wrapper">
          <div aria-hidden=${isLabelForwarded || nothing} id="label" part="label">
            <slot @slotchange=${this.#onLabelSlotChange}></slot>
          </div>

          <slot name="infotip" @slotchange=${this.#onInfotipSlotChange}></slot>

          <div id="description" part="description">
            <slot name="description" @slotchange=${this.#onDescriptionSlotChange}></slot>
          </div>
        </div>

        <label id="toggle" part="toggle">
          <input
            aria-checked=${Boolean(this.checked).toString()}
            aria-describedby=${describedBy || nothing}
            aria-labelledby=${labelledBy || nothing}
            .checked=${!!this.checked}
            ?disabled=${this.disabled}
            @click=${this.#onInputClick}
            @input=${this.#onInput}
            @keydown=${this.#onKeydown}
            id="input"
            role="switch"
            type="checkbox" />
          <div part="track">
            <div part="handle">
              ${
                this.size === 'sm' ? nothing : html`<sl-icon .name=${icon} .size=${size}></sl-icon>`
              }
            </div>
          </div>
        </label>
      </div>

      ${
        this.tooltip
          ? html`
              <sl-tooltip
                for="wrapper toggle"
                id="tooltip"
                part="tooltip"
                type=${hasName ? 'description' : 'label'}>
                ${this.tooltip}
              </sl-tooltip>
            `
          : nothing
      }
    `;
  }

  /**
   * Toggles the switch on or off. Pass `force` to set a specific state: `true` turns the switch on,
   * `false` turns it off. Does nothing when the switch is disabled, or when it already is in the
   * requested state.
   *
   * @param force - Optional boolean to force a specific state.
   */
  toggle(force?: boolean): void {
    const ariaDisabled =
      this.ariaDisabled === 'true' ||
      this.getAttribute('aria-disabled') === 'true' ||
      (this.hasUpdated && this.input.getAttribute('aria-disabled') === 'true');

    if (this.disabled || ariaDisabled) {
      return;
    }

    const checked = force ?? !this.checked;

    if (checked !== !!this.checked) {
      this.#setChecked(checked);
    }
  }

  #onClick = (event: MouseEvent): void => {
    // This handles the case where the user clicks on the <label> element
    // that is part of the `<sl-label>` in `<sl-form-field>`.
    if (event.composedPath().at(0) === this) {
      this.toggle();
    }
  };

  #onDescriptionSlotChange(): void {
    // Trigger an update; willUpdate() derives the state and the aria-describedby attribute.
    this.requestUpdate();
  }

  /** Returns the text of the child nodes that are assigned to the default slot. */
  #labelText(): string {
    return (
      Array.from(this.childNodes)
        // Resolve forwarded `<slot>` elements (e.g. when this element is used inside another
        // component's shadow DOM) to the text nodes they re-project.
        .flatMap(node =>
          node instanceof HTMLSlotElement ? node.assignedNodes({ flatten: true }) : [node]
        )
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent?.trim() ?? '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    );
  }

  #onFocusin = (): void => {
    this.focusEvent.emit();
  };

  #onFocusout = (): void => {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  };

  #onInfotipSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.infotip = event.target
      .assignedElements({ flatten: true })
      .find((el): el is Infotip => el instanceof HTMLElement && el.tagName === 'SL-INFOTIP');

    if (this.infotip) {
      this.infotip.setAttribute('size', 'sm');

      if (!this.infotip.describes) {
        const labelSlot = this.renderRoot.querySelector('slot:not([name])');

        this.infotip.describes = (labelSlot && getSlottedText(labelSlot)) ?? '';
      }
    }
  }

  #onInput(event: Event & { target: HTMLInputElement }): void {
    this.#setChecked(event.target.checked);
  }

  #onInputClick(event: Event & { target: HTMLInputElement }): void {
    // An aria-disabled switch cannot be toggled, but stays focusable. The click has to be
    // cancelled here, because the input event is not cancelable: by the time it fires the
    // checkbox has already flipped, and since `checked` does not change, Lit will not re-commit
    // the binding that would set it back.
    if (event.target.hasAttribute('aria-disabled')) {
      event.preventDefault();
    }
  }

  #onKeydown(event: KeyboardEvent & { target: HTMLInputElement }): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();

      event.target.click();
    }
  }

  #onLabelSlotChange(event: Event): void {
    // Trigger an update; willUpdate() derives the state and the aria-labelledby attribute.
    this.requestUpdate();

    if (this.infotip && !this.infotip.describes) {
      this.infotip.describes = getSlottedText(event.target);
    }
  }

  #onWrapperClick = (event: MouseEvent): void => {
    // Leave clicks inside the infotip alone: the bubble is slotted into the wrapper, so its
    // content bubbles through here, and cancelling the event would break links and buttons in it.
    if (this.infotip && event.composedPath().includes(this.infotip)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.toggle();
  };

  /** Updates the checked state and notifies the outside world about the change. */
  #setChecked(checked: boolean): void {
    this.checked = checked;
    this.changeEvent.emit(this.formValue);
    this.updateState({ dirty: true });
    this.updateValidity();
  }
}
