import { tinykeys } from '../vendor/tinykeys.js';
const KEY_REGEX = /(?:Key|Digit)([A-Z0-9])/g;
const isMac = () => navigator.platform.indexOf('Mac') > -1;
export class ShortcutController {
  #host;
  #shortcuts;
  #target;
  #unregister;
  constructor(host, shortcuts, target = window) {
    this.#host = host;
    this.#host.addController(this);
    this.#shortcuts = shortcuts;
    this.#target = target;
  }
  hostConnected() {
    if (this.#shortcuts) {
      this.bind(this.#shortcuts);
    }
  }
  hostDisconnected() {
    this.unbind();
  }
  unbind() {
    this.#unregister?.();
  }
  bind(shortcuts) {
    this.unbind();
    this.#shortcuts = shortcuts;
    this.#unregister = tinykeys(this.#target, shortcuts);
  }
  renderAsLabel(shortcut) {
    const keys = shortcut.replace(KEY_REGEX, '$1').split('+');
    return keys
      .map(key => {
        if (key === '$mod') {
          return isMac() ? '\u2318' : 'Ctrl';
        } else {
          return key;
        }
      })
      .join('');
  }
  renderAsText(shortcut) {
    const keys = shortcut.replace(KEY_REGEX, '$1').split('+');
    return keys
      .map(key => {
        if (key === '$mod') {
          return isMac() ? 'Meta' : 'Ctrl';
        } else {
          return key;
        }
      })
      .join('+');
  }
}
//# sourceMappingURL=shortcut.js.map
