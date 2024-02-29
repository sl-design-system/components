import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { type KeyBindingMap, tinykeys } from 'tinykeys';

type ShortcutTarget = Parameters<typeof tinykeys>[0];
export type ShortcutMap = KeyBindingMap;

const KEY_REGEX = /(?:Key|Digit)([A-Z0-9])/g;

const isMac = (): boolean => navigator.platform.indexOf('Mac') > -1;

export class ShortcutController implements ReactiveController {
  #host: ReactiveControllerHost & HTMLElement;
  #shortcuts?: ShortcutMap;
  #target: ShortcutTarget;
  #unregister?: ReturnType<typeof tinykeys>;

  constructor(host: ReactiveControllerHost & HTMLElement, shortcuts?: ShortcutMap, target: ShortcutTarget = window) {
    this.#host = host;
    this.#host.addController(this);
    this.#shortcuts = shortcuts;
    this.#target = target;
  }

  hostConnected(): void {
    if (this.#shortcuts) {
      this.bind(this.#shortcuts);
    }
  }

  hostDisconnected(): void {
    this.unbind();
  }

  unbind(): void {
    this.#unregister?.();
  }

  bind(shortcuts: KeyBindingMap): void {
    this.unbind();
    this.#shortcuts = shortcuts;
    this.#unregister = tinykeys(this.#target, shortcuts);
  }

  render(shortcut: string): string {
    const keys = shortcut.replace(KEY_REGEX, '$1').split('+');

    return keys
      .map(key => {
        if (key === '$mod') {
          return isMac() ? '⌘' : 'Ctrl';
        } else {
          return key;
        }
      })
      .join('');
  }
}
