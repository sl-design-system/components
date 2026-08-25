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
import { AnchorController, EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './popover.scss.js';
let nextUniqueId = 0;
const _Popover = class _Popover extends LitElement {
  constructor() {
    super(...arguments);
    // eslint-disable-next-line no-unused-private-class-members
    this.#events = new EventsController(this, { keydown: this.#onKeydown });
    /** Controller for managing anchoring. */
    this.#anchor = new AnchorController(this, {
      arrowElement: '[part="arrow"]',
      arrowPadding: _Popover.arrowPadding,
      offset: _Popover.offset,
      viewportMargin: _Popover.viewportMargin
    });
    this.position = 'bottom';
  }
  static {
    /** @internal The default padding of the arrow. */
    this.arrowPadding = 16;
  }
  static {
    /** @internal The default offset of the popover to its anchor. */
    this.offset = 12;
  }
  static {
    /** @internal */
    this.shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  static {
    /** @internal The default margin between the tooltip and the viewport. */
    this.viewportMargin = 8;
  }
  #events;
  #anchor;
  connectedCallback() {
    super.connectedCallback();
    this.id ||= `sl-popover-${nextUniqueId++}`;
    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('position')) {
      this.#anchor.position = this.position;
    }
  }
  render() {
    return html`
      <div class="container" part="container">
        <slot></slot>
      </div>
      <div part="arrow" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xml:space="preserve"
          clip-rule="evenodd"
          viewBox="0 0 20 11">
          <path d="M0 11 20 11 10 1 0 11" paint-order="stroke" />
        </svg>
      </div>
    `;
  }
  #onKeydown(event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
    }
  }
};
__decorateClass([property()], _Popover.prototype, 'position', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'no-describedby' })],
  _Popover.prototype,
  'noDescribedby',
  2
);
export let Popover = _Popover;
//# sourceMappingURL=popover.js.map
