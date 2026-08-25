import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type KeyBindingMap, tinykeys } from '../vendor/tinykeys.js';
type ShortcutTarget = Parameters<typeof tinykeys>[0];
export type ShortcutMap = KeyBindingMap;
export declare class ShortcutController implements ReactiveController {
  #private;
  constructor(
    host: ReactiveControllerHost & HTMLElement,
    shortcuts?: ShortcutMap,
    target?: ShortcutTarget
  );
  hostConnected(): void;
  hostDisconnected(): void;
  unbind(): void;
  bind(shortcuts: KeyBindingMap): void;
  renderAsLabel(shortcut: string): string;
  renderAsText(shortcut: string): string;
}
export {};
