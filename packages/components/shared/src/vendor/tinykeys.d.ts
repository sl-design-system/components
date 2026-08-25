type KeyBindingPress = [string[], string];
/** A map of keybinding strings to event handlers. */
export interface KeyBindingMap {
    [keybinding: string]: (event: KeyboardEvent) => void;
}
export interface KeyBindingHandlerOptions {
    /**
     * Keybinding sequences will wait this long between key presses before cancelling (default: 1000).
     *
     * **Note:** Setting this value too low (i.e. `300`) will be too fast for many of your users.
     */
    timeout?: number;
}
/** Options to configure the behavior of keybindings. */
export interface KeyBindingOptions extends KeyBindingHandlerOptions {
    /** Key presses will listen to this event (default: "keydown"). */
    event?: 'keydown' | 'keyup';
}
/**
 * Parses a "Key Binding String" into its parts
 *
 * Grammar = `<sequence>` <sequence> = `<press> <press> <press> ...` <press> = `<key>` or
 * `<mods>+<key>` <mods> = `<mod>+<mod>+...`
 */
export declare function parseKeybinding(str: string): KeyBindingPress[];
/**
 * Creates an event listener for handling keybindings.
 *
 * @example
 *   ```js
 *   import { createKeybindingsHandler } from '../src/keybindings';
 *
 *   let handler = createKeybindingsHandler({
 *     'Shift+d': () => {
 *       alert("The 'Shift' and 'd' keys were pressed at the same time");
 *     },
 *     'y e e t': () => {
 *       alert("The keys 'y', 'e', 'e', and 't' were pressed in order");
 *     },
 *     '$mod+d': () => {
 *       alert("Either 'Control+d' or 'Meta+d' were pressed");
 *     }
 *   });
 *
 *   window.addEvenListener('keydown', handler);
 *   ```
 */
export declare function createKeybindingsHandler(keyBindingMap: KeyBindingMap, options?: KeyBindingHandlerOptions): EventListener;
/**
 * Subscribes to keybindings.
 *
 * Returns an unsubscribe method.
 *
 * @example
 *   ```js
 *   import { tinykeys } from '../src/tinykeys';
 *
 *   tinykeys(window, {
 *     'Shift+d': () => {
 *       alert("The 'Shift' and 'd' keys were pressed at the same time");
 *     },
 *     'y e e t': () => {
 *       alert("The keys 'y', 'e', 'e', and 't' were pressed in order");
 *     },
 *     '$mod+d': () => {
 *       alert("Either 'Control+d' or 'Meta+d' were pressed");
 *     }
 *   });
 *   ```
 */
export declare function tinykeys(target: Window | HTMLElement, keyBindingMap: KeyBindingMap, options?: KeyBindingOptions): () => void;
export {};
