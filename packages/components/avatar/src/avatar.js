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
import { Badge } from '@sl-design-system/badge';
import { Tooltip } from '@sl-design-system/tooltip';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './avatar.scss.js';
export class Avatar extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    /** Observe the size of various elements. */
    this.#observer = new ResizeObserver(() => this.#onResize());
    this.initials = '';
    this.size = 'md';
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-tooltip': Tooltip
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #observer;
  connectedCallback() {
    super.connectedCallback();
    this.#observer.observe(this);
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('displayName') || changes.has('displayInitials')) {
      if (this.displayInitials) {
        this.initials = this.displayInitials;
      } else if (this.displayName) {
        const names = this.displayName.split(' ');
        this.initials = names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
      } else {
        this.initials = '';
      }
    }
    if (changes.has('shape')) {
      requestAnimationFrame(() => this.#onResize());
    }
  }
  render() {
    const avatar = this.renderAvatar();
    return this.href
      ? html`<a href=${this.href} part="wrapper">${avatar}</a>`
      : html`<div part="wrapper">${avatar}</div>`;
  }
  renderAvatar() {
    return html`
      <div part="avatar">
        <slot @slotchange=${this.#onSlotChange} name="badge"></slot>
        <div part="picture" style=${styleMap({ clipPath: this.clipPath })}>
          ${
            this.pictureUrl
              ? html`
                  <img
                    @error=${this.#onError}
                    part="image"
                    src=${this.pictureUrl}
                    alt=${ifDefined(this.imageOnly ? this.displayName : '')} />
                `
              : html`
                  <slot name="fallback">
                    <span part="initials">${this.initials}</span>
                  </slot>
                `
          }
        </div>
      </div>
      ${
        this.imageOnly
          ? nothing
          : html`
              ${this.tooltip ? html`<sl-tooltip for="name" part="tooltip">${this.displayName}</sl-tooltip>` : nothing}
              <span id="name" part="name">${this.displayName}</span>
              <slot></slot>
            `
      }
    `;
  }
  #onError() {
    this.pictureUrl = void 0;
  }
  #onResize() {
    const outlineOffset = parseInt(getComputedStyle(this).outlineOffset || '0'),
      {
        top: badgeTop = 0,
        right: badgeRight = 0,
        width: badgeWidth = 0,
        height: badgeHeight = 0
      } = this.badge?.getBoundingClientRect() ?? {},
      badgeRadius = badgeHeight / 2,
      {
        top: pictureTop,
        right: pictureRight,
        width: pictureSize
      } = this.renderRoot.querySelector('[part="picture"]').getBoundingClientRect();
    const cutoutTop = badgeTop - pictureTop - outlineOffset,
      cutoutRight = badgeRight - pictureRight + pictureSize - badgeRadius,
      cutoutBottom = cutoutTop + badgeHeight + 2 * outlineOffset,
      cutoutLeft = cutoutRight - badgeWidth + badgeRadius * 2;
    if (badgeHeight && pictureSize) {
      this.clipPath = `path('M 0 0 L ${pictureSize} 0 L ${pictureSize} ${pictureSize} L 0 ${pictureSize} L 0 0 M ${cutoutLeft} ${cutoutTop} A 1 1 0 0 0 ${cutoutLeft} ${cutoutBottom} L ${cutoutRight} ${cutoutBottom} A 1 1 0 0 0 ${cutoutRight} ${cutoutTop} L ${cutoutLeft} ${cutoutTop} Z')`;
    } else {
      this.clipPath = void 0;
    }
    const name = this.renderRoot.querySelector('[part="name"]');
    this.tooltip =
      !!name && (name.offsetWidth < name.scrollWidth || name.offsetHeight + 4 < name.scrollHeight);
  }
  #onSlotChange(event) {
    this.badge = event.target.assignedElements({ flatten: true }).find(el => el instanceof Badge);
    if (this.badge) {
      this.#observer.observe(this.badge);
    }
  }
}
__decorateClass([state()], Avatar.prototype, 'clipPath', 2);
__decorateClass([property({ reflect: true })], Avatar.prototype, 'color', 2);
__decorateClass(
  [property({ attribute: 'display-initials' })],
  Avatar.prototype,
  'displayInitials',
  2
);
__decorateClass([property({ attribute: 'display-name' })], Avatar.prototype, 'displayName', 2);
__decorateClass([property({ reflect: true })], Avatar.prototype, 'emphasis', 2);
__decorateClass([property()], Avatar.prototype, 'href', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'image-only' })],
  Avatar.prototype,
  'imageOnly',
  2
);
__decorateClass([state()], Avatar.prototype, 'initials', 2);
__decorateClass([property({ attribute: 'picture-url' })], Avatar.prototype, 'pictureUrl', 2);
__decorateClass([property({ reflect: true })], Avatar.prototype, 'shape', 2);
__decorateClass([property({ reflect: true })], Avatar.prototype, 'size', 2);
__decorateClass([state()], Avatar.prototype, 'tooltip', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Avatar.prototype, 'vertical', 2);
//# sourceMappingURL=avatar.js.map
