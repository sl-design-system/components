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
import { closestElementComposed } from '@sl-design-system/shared';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './button.scss.js';
export class Button extends ForwardAriaMixin(ScopedElementsMixin(LitElement)) {
  constructor() {
    super(...arguments);
    /** Observe changes to the slotted content that aren't caught by the `slotchange` event. */
    this.#observer = new MutationObserver(() => this.#onUpdate());
    /** Stores tabIndex set before the button is rendered. */
    this.#tabIndex = 0;
    /** @internal */
    this.internals = this.attachInternals();
  }
  static {
    /** @internal */
    this.formAssociated = true;
  }
  /** @internal */
  static get scopedElements() {
    return {
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
  #observer;
  #tabIndex;
  get tabIndex() {
    return this.#tabIndex;
  }
  set tabIndex(value) {
    if (this.button) {
      this.#tabIndex = this.button.tabIndex = value;
    } else {
      this.#tabIndex = value;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.#observer.observe(this, { characterData: true, childList: true, subtree: true });
  }
  disconnectedCallback() {
    this.#observer.disconnect();
    super.disconnectedCallback();
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    this.setProxyTarget(this.button);
    if (this.hasAttribute('tabindex')) {
      this.tabIndex = parseInt(this.getAttribute('tabindex') ?? '0');
    }
    requestAnimationFrame(() => this.#onUpdate());
  }
  render() {
    let target = this.commandForElement ?? null;
    if (!target && this.commandFor) {
      target = this.getRootNode().getElementById?.(this.commandFor) ?? null;
    }
    let ariaType;
    if (this.tooltip) {
      ariaType = this.internals.states.has('icon-only') ? 'label' : 'description';
    }
    return html`
      <button
        @click=${this.#onClick}
        command=${ifDefined(this.command)}
        .commandForElement=${target}
        ?disabled=${this.disabled}
        id="button"
        part="button"
        type="button">
        <slot></slot>
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
  #onClick(event) {
    if (this.disabled || this.button.ariaDisabled === 'true') {
      event.preventDefault();
      event.stopImmediatePropagation();
    } else if (this.type === 'reset') {
      if (this.internals.form) {
        this.internals.form.reset();
      } else {
        closestElementComposed(this, 'sl-form')?.reset();
      }
    } else if (this.type === 'submit') {
      if (this.internals.form) {
        this.internals.form.requestSubmit();
      } else {
        closestElementComposed(this, 'sl-form')?.requestSubmit();
      }
    }
  }
  #onUpdate() {
    const filteredNodes = this.renderRoot
      .querySelector('slot')
      ?.assignedNodes({ flatten: true })
      .filter(node => {
        return node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim().length;
      });
    let iconOnly = false;
    if (filteredNodes?.length === 1 && filteredNodes[0].nodeType === Node.ELEMENT_NODE) {
      const el = filteredNodes[0];
      iconOnly =
        el.nodeName === 'SL-ICON' ||
        ((el.textContent || '').trim().length === 0 &&
          el.children.length === 1 &&
          el.children[0].nodeName === 'SL-ICON');
    }
    const hasIconOnly = this.internals.states.has('icon-only');
    if (iconOnly) {
      this.internals.states.add('icon-only');
    } else {
      this.internals.states.delete('icon-only');
    }
    if (hasIconOnly !== iconOnly) {
      this.requestUpdate();
    }
  }
}
__decorateClass([query('button')], Button.prototype, 'button', 2);
__decorateClass([property()], Button.prototype, 'command', 2);
__decorateClass([property({ attribute: 'commandfor' })], Button.prototype, 'commandFor', 2);
__decorateClass([property({ attribute: false })], Button.prototype, 'commandForElement', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Button.prototype, 'disabled', 2);
__decorateClass([property({ reflect: true })], Button.prototype, 'fill', 2);
__decorateClass([property({ reflect: true })], Button.prototype, 'shape', 2);
__decorateClass([property({ reflect: true })], Button.prototype, 'size', 2);
__decorateClass([property()], Button.prototype, 'tooltip', 2);
__decorateClass([property()], Button.prototype, 'type', 2);
__decorateClass([property({ reflect: true })], Button.prototype, 'variant', 2);
//# sourceMappingURL=button.js.map
