import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';
import { Tooltip } from '@sl-design-system/tooltip';
import {
  type CSSResultGroup,
  LitElement,
  PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './toggle-button.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-toggle-button': ToggleButton;
  }
}

export type ToggleButtonFill = 'outline' | 'solid';
export type ToggleButtonShape = 'rect' | 'pill';
export type ToggleButtonSize = 'sm' | 'md' | 'lg';

/**
 * A button that lets the user toggle between two states.
 *
 * @customElement sl-toggle-button
 *
 * @slot default - The icon shown in the default state of the button
 * @slot pressed - The icon shown in the pressed state of the button
 *
 * @csspart button - The internal <code>&lt;button&gt;</code> element.
 * @csspart tooltip - The tooltip element that is shown when the <code>tooltip</code> attribute is set.
 *
 * @cssstate error - Set when there is an error with the toggle button, for example when there are no icons in an icon-only toggle button.
 * @cssstate pressed - Set when the toggle button is in the pressed state.
 * @cssstate icon-only - Set when the toggle button has icons and no text.
 * @cssstate text-only - Set when the toggle button has text and no icons.
 */
export class ToggleButton extends ForwardAriaMixin(ScopedElementsMixin(LitElement)) {
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

  /** @internal The button element. */
  @query('button') button!: HTMLButtonElement;

  /** @internal The default (non-pressed) icon. */
  @state() defaultIcon?: Icon;

  /**
   * Whether the button is disabled; when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * The variant of the toggle-button.
   *
   * @default 'solid'
   */
  @property({ reflect: true }) fill?: ToggleButtonFill;

  /** @internal True when the user has slotted text in the button. */
  @state() hasText?: boolean;

  /** @internal */
  readonly internals = this.attachInternals();

  /**
   * The pressed state of the button.
   *
   * @default false
   */
  @property({ type: Boolean }) pressed?: boolean;

  /** @internal The pressed icon. */
  @state() pressedIcon?: Icon;

  /**
   * The shape of the button.
   *
   * @default 'rect'
   */
  @property({ reflect: true }) shape?: ToggleButtonShape;

  /**
   * The size of the button.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: ToggleButtonSize;

  /** @internal Emits when the button has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  /** The tooltip text for the button. */
  @property() tooltip?: string;

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.setProxyTarget(this.button);

    if (import.meta.env?.DEV) {
      // Wait for the slotchange events to fire before checking for errors
      requestAnimationFrame(() => {
        this.internals.states.delete('error');

        if (this.parentElement?.tagName !== 'SL-TOGGLE-GROUP' && !this.hasText) {
          if (!this.defaultIcon) {
            console.error(
              'There needs to be an sl-icon in the "default" slot for the component to work'
            );
            this.internals.states.add('error');
          } else if (!this.pressedIcon) {
            console.error(
              'There needs to be an sl-icon in the "pressed" slot for the component to work'
            );
            this.internals.states.add('error');
          } else if (this.defaultIcon.name === this.pressedIcon.name) {
            console.error('Do not use the same icon for both states of the toggle button.');
            this.internals.states.add('error');
          }
        }
      });
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('defaultIcon') || changes.has('hasText') || changes.has('pressedIcon')) {
      const iconOnly = !this.hasText && (!!this.defaultIcon || !!this.pressedIcon),
        textOnly = !!this.hasText && !this.defaultIcon && !this.pressedIcon,
        hasIconOnly = this.internals.states.has('icon-only');

      if (iconOnly) {
        this.internals.states.add('icon-only');
        this.internals.states.delete('text-only');
      } else if (textOnly) {
        this.internals.states.delete('icon-only');
        this.internals.states.add('text-only');
      } else {
        this.internals.states.delete('icon-only');
        this.internals.states.delete('text-only');
      }

      // Trigger an update when the icon-only state changes
      if (hasIconOnly !== iconOnly) {
        this.requestUpdate();
      }
    }

    if (changes.has('defaultIcon') || changes.has('pressedIcon')) {
      [this.defaultIcon, this.pressedIcon].filter(Boolean).forEach(icon => {
        // Map the button size to the appropriate icon size: xs for sm, otherwise md
        icon!.size = this.size === 'sm' ? 'xs' : 'md';
      });
    }

    if (changes.has('pressed')) {
      if (this.pressed) {
        this.internals.states.add('pressed');
      } else {
        this.internals.states.delete('pressed');
      }
    }
  }

  override render(): TemplateResult {
    let ariaType: 'description' | 'label' | undefined;
    if (this.tooltip) {
      ariaType = this.internals.states.has('icon-only') ? 'label' : 'description';
    }

    return html`
      <button
        @click=${this.#onClick}
        ?disabled=${this.disabled}
        aria-pressed=${Boolean(this.pressed).toString()}
        id="button"
        part="button"
        type="button">
        <slot @slotchange=${this.#onIconSlotChange} name="default"></slot>
        <slot @slotchange=${this.#onIconSlotChange} name="pressed">
          <sl-icon name="check-solid" size=${this.size === 'sm' ? 'xs' : 'md'}></sl-icon>
        </slot>
        <slot @slotchange=${this.#onSlotChange}></slot>
      </button>
      ${this.tooltip
        ? html`
            <sl-tooltip for="button" part="tooltip" type=${ifDefined(ariaType)}>
              ${this.tooltip}
            </sl-tooltip>
          `
        : nothing}
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled || this.button.ariaDisabled === 'true') {
      event.preventDefault();
      event.stopImmediatePropagation();

      return;
    }

    this.pressed = !this.pressed;
    this.toggleEvent.emit(this.pressed);
  }

  #onIconSlotChange(event: Event & { target: HTMLSlotElement }): void {
    if (event.target.matches('[name="default"]')) {
      this.defaultIcon = event.target
        .assignedElements({ flatten: true })
        .find(element => element instanceof Icon);
    } else {
      this.pressedIcon = event.target
        .assignedElements({ flatten: true })
        .find(element => element instanceof Icon);
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.hasText = !!event.target
      .assignedNodes({ flatten: true })
      .filter(node => node.textContent && node.textContent.trim().length > 0).length;
  }
}
