import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type Infotip } from '@sl-design-system/infotip';
import { type EventEmitter, event } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';
import { getSlottedText, hasSlottedContent } from '@sl-design-system/shared/slot.js';
import { Tooltip } from '@sl-design-system/tooltip';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property } from 'lit/decorators.js';
import styles from './switch.scss.js';

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
 * @csspart container - The wrapper around all the other elements; it defines the layout.
 * @csspart description - The wrapper around the description, below the label.
 * @csspart label - The wrapper around the label text.
 * @csspart toggle - The wrapper around the input and the track.
 * @csspart tooltip - The tooltip element that is shown when the <code>tooltip</code> attribute is set.
 * @csspart track - The track the handle moves in.
 * @csspart handle - The handle that moves from one side of the track to the other.
 *
 * @cssstate checked - Set when the switch is on.
 * @cssstate has-description - Set when there is text in the description slot.
 * @cssstate has-label - Set when there is text in the default slot.
 * @cssstate no-label - Set when there is no text in the default slot.
 *
 * @slot - Text label of the switch. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot description - Additional information about the switch, displayed below the label.
 * @slot infotip - The slot for the infotip element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Switch<T = any> extends ForwardAriaMixin(
  FormControlMixin(ScopedElementsMixin(LitElement))
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

  /** @internal Element internals. */
  readonly internals = this.attachInternals();

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
  @property({ type: Boolean }) checked?: boolean;

  /**
   * Whether the switch is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean }) override disabled?: boolean;

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

  /** @internal The infotip instance when one is slotted. */
  infotip?: Infotip;

  /** @internal The input element in the shadow DOM. */
  get input(): HTMLInputElement {
    return this.renderRoot.querySelector('input')!;
  }

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

  formAssociatedCallback(): void {
    this.#initialState = this.hasAttribute('checked');
  }

  formResetCallback(): void {
    this.checked = this.#initialState;
    this.changeEvent.emit(this.formValue);
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.setProxyTarget(this.input);

    this.internals.setFormValue(this.nativeFormValue);
    this.updateValidity();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('checked')) {
      if (this.checked) {
        this.internals.states.add('checked');
      } else {
        this.internals.states.delete('checked');
      }
    }

    if (this.hasUpdated && changes.has('disabled')) {
      this.updateValidity();
    }

    if (changes.has('checked') || changes.has('value')) {
      this.internals.setFormValue(this.nativeFormValue);
    }
  }

  override render(): TemplateResult {
    const icon = this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark',
      size = this.size === 'md' ? 'xs' : 'md',
      hasLabel = this.internals.states.has('has-label'),
      // If the switch has no label, the tooltip functions as the label, otherwise as the description
      tooltipType = hasLabel ? 'description' : 'label',
      describedBy = [
        this.internals.states.has('has-description') && 'description',
        this.tooltip && hasLabel && 'tooltip'
      ]
        .filter(Boolean)
        .join(' '),
      labelledBy = [hasLabel && 'label', this.tooltip && !hasLabel && 'tooltip']
        .filter(Boolean)
        .join(' ');

    return html`
      <div id="container" part="container">
        <div part="wrapper">
          <label for="input" id="label" part="label">
            <slot @slotchange=${this.#onLabelSlotChange}></slot>
          </label>

          <slot name="infotip" @slotchange=${this.#onInfotipSlotChange}></slot>
        </div>

        <label id="toggle" part="toggle">
          <input
            aria-checked=${this.checked ? 'true' : 'false'}
            aria-describedby=${describedBy || nothing}
            aria-labelledby=${labelledBy || nothing}
            .checked=${!!this.checked}
            ?disabled=${this.disabled}
            @input=${this.#onInput}
            @keydown=${this.#onKeydown}
            id="input"
            role="switch"
            type="checkbox" />
          <div part="track">
            <div part="handle">
              ${this.size === 'sm'
                ? nothing
                : html`<sl-icon .name=${icon} .size=${size}></sl-icon>`}
            </div>
          </div>
        </label>

        <div id="description" part="description">
          <slot name="description" @slotchange=${this.#onDescriptionSlotChange}></slot>
        </div>
      </div>

      ${this.tooltip
        ? html`
            <sl-tooltip for="container toggle" id="tooltip" part="tooltip" type=${tooltipType}>
              ${this.tooltip}
            </sl-tooltip>
          `
        : nothing}
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
      this.hasAttribute('aria-disabled') ||
      (this.hasUpdated && this.input.hasAttribute('aria-disabled'));

    if (this.disabled || ariaDisabled) {
      return;
    }

    const checked = force ?? !this.checked;

    if (checked !== !!this.checked) {
      this.#setChecked(checked);
    }
  }

  #onClick = (event: MouseEvent): void => {
    // If the user clicks the label in the sl-form-field, it will trigger a click event here
    // where event.target === this. Toggle the switch, like the native input would do.
    if (event.target === this) {
      this.toggle();
    }
  };

  #onDescriptionSlotChange(event: Event): void {
    if (hasSlottedContent(event.target)) {
      this.internals.states.add('has-description');
    } else {
      this.internals.states.delete('has-description');
    }

    // Trigger update to ensure the aria-describedby attribute is updated correctly.
    this.requestUpdate();
  }

  #onFocusin = (): void => {
    this.focusEvent.emit();
  };

  #onFocusout = (): void => {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  };

  #onInfotipSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true }) || [];

    this.infotip = assignedElements.find(
      (el): el is Infotip => el instanceof HTMLElement && el.tagName === 'SL-INFOTIP'
    );

    if (this.infotip) {
      this.infotip.setAttribute('size', 'sm');

      if (!this.infotip.describes) {
        const labelSlot = this.renderRoot.querySelector('slot:not([name])');

        this.infotip.describes = (labelSlot && getSlottedText(labelSlot)) ?? '';
      }
    }
  }

  #onInput(event: Event & { target: HTMLInputElement }): void {
    if (event.target.hasAttribute('aria-disabled')) {
      event.preventDefault();

      return;
    }

    this.#setChecked(event.target.checked);
  }

  #onKeydown(event: KeyboardEvent & { target: HTMLInputElement }): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();

      event.target.click();
    }
  }

  #onLabelSlotChange(event: Event): void {
    const text = getSlottedText(event.target);

    if (text) {
      this.internals.states.add('has-label');
      this.internals.states.delete('no-label');
    } else {
      this.internals.states.delete('has-label');
      this.internals.states.add('no-label');
    }

    // Trigger update to ensure the aria-labelledby attribute is updated correctly.
    this.requestUpdate();

    if (this.infotip && !this.infotip.describes) {
      this.infotip.describes = text;
    }
  }

  /** Updates the checked state and notifies the outside world about the change. */
  #setChecked(checked: boolean): void {
    this.checked = checked;
    this.changeEvent.emit(this.formValue);
    this.updateState({ dirty: true });
    this.updateValidity();
  }
}
