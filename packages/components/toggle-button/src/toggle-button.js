var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { event } from '@sl-design-system/shared';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './toggle-button.scss.js';
export class ToggleButton extends ForwardAriaMixin(ScopedElementsMixin(LitElement)) {
  constructor() {
    super(...arguments);
    /** @internal */
    this.internals = this.attachInternals();
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }
  static {
    /** @internal */
    this.shadowRootOptions = {
      ...LitElement.shadowRootOptions,
      delegatesFocus: true
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    this.setProxyTarget(this.button);
    if (import.meta.env?.DEV) {
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
  updated(changes) {
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
      if (hasIconOnly !== iconOnly) {
        this.requestUpdate();
      }
    }
    if (changes.has('defaultIcon') || changes.has('pressedIcon')) {
      [this.defaultIcon, this.pressedIcon].filter(Boolean).forEach(icon => {
        icon.size = this.size === 'sm' ? 'xs' : 'md';
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
  render() {
    let ariaType;
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
      ${
        this.tooltip
          ? html`
              <sl-tooltip for="button" part="tooltip" type=${ifDefined(ariaType)}>
                ${this.tooltip}
              </sl-tooltip>
            `
          : nothing
      }
    `;
  }
  #onClick(event2) {
    if (this.disabled || this.button.ariaDisabled === 'true') {
      event2.preventDefault();
      event2.stopImmediatePropagation();
      return;
    }
    this.pressed = !this.pressed;
    this.toggleEvent.emit(this.pressed);
  }
  #onIconSlotChange(event2) {
    if (event2.target.matches('[name="default"]')) {
      this.defaultIcon = event2.target
        .assignedElements({ flatten: true })
        .find(element => element instanceof Icon);
    } else {
      this.pressedIcon = event2.target
        .assignedElements({ flatten: true })
        .find(element => element instanceof Icon);
    }
  }
  #onSlotChange(event2) {
    this.hasText = !!event2.target
      .assignedNodes({ flatten: true })
      .filter(node => node.textContent && node.textContent.trim().length > 0).length;
  }
}
__decorateClass([query('button')], ToggleButton.prototype, 'button', 2);
__decorateClass([state()], ToggleButton.prototype, 'defaultIcon', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  ToggleButton.prototype,
  'disabled',
  2
);
__decorateClass([property({ reflect: true })], ToggleButton.prototype, 'fill', 2);
__decorateClass([state()], ToggleButton.prototype, 'hasText', 2);
__decorateClass([property({ type: Boolean })], ToggleButton.prototype, 'pressed', 2);
__decorateClass([state()], ToggleButton.prototype, 'pressedIcon', 2);
__decorateClass([property({ reflect: true })], ToggleButton.prototype, 'shape', 2);
__decorateClass([property({ reflect: true })], ToggleButton.prototype, 'size', 2);
__decorateClass([event({ name: 'sl-toggle' })], ToggleButton.prototype, 'toggleEvent', 2);
__decorateClass([property()], ToggleButton.prototype, 'tooltip', 2);
//# sourceMappingURL=toggle-button.js.map
