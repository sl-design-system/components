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
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './icon.scss.js';
window.SLDS ||= { icons: {} };
const isIconDefinition = icon => {
  return 'icon' in icon;
};
const _Icon = class _Icon extends LitElement {
  constructor() {
    super(...arguments);
    this.iconNotDef =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="icon-not-def"><path d="M64 390.3L153.5 256 64 121.7V390.3zM102.5 448H281.5L192 313.7 102.5 448zm128-192L320 390.3V121.7L230.5 256zM281.5 64H102.5L192 198.3 281.5 64zM0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48z"/></svg>';
    // do we want to show something here? it would probably only cause flickering
    this.iconLoading =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-loading"></svg>';
    this.iconHTML = this.iconLoading;
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  /** @ignore */
  static register(icon, ...icons) {
    if (isIconDefinition(icon)) {
      [icon, ...icons].forEach(i => {
        if (window.SLDS.icons[`${i.prefix}-${i.iconName}`] && import.meta.env?.DEV) {
          console.warn(`Icon ${i.prefix}-${i.iconName} is already in the registry`);
          return;
        }
        const {
            icon: [width, height, , , path]
          } = i,
          paths = Array.isArray(path) ? path : [path];
        const svg = `
          <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${paths
              .map(
                (p, idx) =>
                  `<path d="${p}" fill="var(--sl-icon-fill-${_Icon.getColorToken(idx, i.prefix)})"></path>`
              )
              .join('')}
          </svg>
        `;
        window.SLDS.icons[`${i.prefix}-${i.iconName}`] = { svg, type: 'RegisteredIcon' };
      });
    } else {
      window.SLDS.icons = { ...window.SLDS.icons, ...icon };
    }
  }
  static getColorToken(pathCounter, prefix) {
    return pathCounter === 0 && (prefix === 'fad' || prefix === 'fadr') ? 'accent' : 'default';
  }
  #getIconHTML() {
    if (!this.sldsLibrary) {
      return this.iconLoading;
    }
    if (!this.name) {
      return this.iconNotDef;
    }
    return this.sldsLibrary.icons[this.name]
      ? this.sldsLibrary.icons[this.name].svg
      : this.iconNotDef;
  }
  async connectedCallback() {
    super.connectedCallback();
    if (this.name) {
      await this.#waitForWindowProperty(this.name);
    }
    this.sldsLibrary = window.SLDS;
    this.iconHTML = this.#getIconHTML();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('name')) {
      this.iconHTML = this.#getIconHTML();
    }
    if (this.label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }
  render() {
    return html`${unsafeHTML(this.iconHTML)}`;
  }
  /**
   * Sometimes the icon tries to render before any icons are registered, that's why we need to check
   * if the icons have been registered, and if not we need to wait a bit and then check again, so we
   * can (re)render the icon when the library is set.
   */
  async #waitForWindowProperty(name) {
    let tries = 0;
    await new Promise(resolve => {
      const checkProperty = () => {
        if (window.SLDS?.icons && Object.keys(window.SLDS.icons).length > 0) {
          if (name && window.SLDS?.icons[name]) {
            resolve();
          } else if (tries > 10) {
            resolve();
          } else {
            setTimeout(checkProperty, 100);
            tries++;
          }
        } else {
          setTimeout(checkProperty, 100);
        }
      };
      checkProperty();
    });
  }
};
__decorateClass([property()], _Icon.prototype, 'label', 2);
__decorateClass([property({ reflect: true })], _Icon.prototype, 'name', 2);
__decorateClass([property({ reflect: true })], _Icon.prototype, 'size', 2);
__decorateClass([state()], _Icon.prototype, 'iconHTML', 2);
__decorateClass([state()], _Icon.prototype, 'sldsLibrary', 2);
export let Icon = _Icon;
//# sourceMappingURL=icon.js.map
