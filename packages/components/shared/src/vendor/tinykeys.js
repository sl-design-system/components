let KEYBINDING_MODIFIER_KEYS = ["Shift", "Meta", "Alt", "Control"];
let DEFAULT_TIMEOUT = 1e3;
let DEFAULT_EVENT = "keydown";
let PLATFORM = typeof navigator === "object" ? navigator.platform : "";
let APPLE_DEVICE = /Mac|iPod|iPhone|iPad/.test(PLATFORM);
let MOD = APPLE_DEVICE ? "Meta" : "Control";
let ALT_GRAPH_ALIASES = PLATFORM === "Win32" ? ["Control", "Alt"] : APPLE_DEVICE ? ["Alt"] : [];
function getModifierState(event, mod) {
  return typeof event.getModifierState === "function" ? event.getModifierState(mod) || ALT_GRAPH_ALIASES.includes(mod) && event.getModifierState("AltGraph") : false;
}
export function parseKeybinding(str) {
  return str.trim().split(" ").map((press) => {
    let mods = press.split(/\b\+/);
    let key = mods.pop();
    mods = mods.map((mod) => mod === "$mod" ? MOD : mod);
    return [mods, key];
  });
}
function match(event, press) {
  return !// Allow either the `event.key` or the `event.code`
  // MDN event.key: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
  // MDN event.code: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
  (press[1].toUpperCase() !== event.key.toUpperCase() && press[1] !== event.code || // Ensure all the modifiers in the keybinding are pressed.
  press[0].find((mod) => {
    return !getModifierState(event, mod);
  }) || // KEYBINDING_MODIFIER_KEYS (Shift/Control/etc) change the meaning of a
  // keybinding. So if they are pressed but aren't part of the current
  // keybinding press, then we don't have a match.
  KEYBINDING_MODIFIER_KEYS.find((mod) => {
    return !press[0].includes(mod) && press[1] !== mod && getModifierState(event, mod);
  }));
}
export function createKeybindingsHandler(keyBindingMap, options = {}) {
  let timeout = options.timeout ?? DEFAULT_TIMEOUT;
  let keyBindings = Object.keys(keyBindingMap).map((key) => {
    return [parseKeybinding(key), keyBindingMap[key]];
  });
  let possibleMatches = /* @__PURE__ */ new Map();
  let timer = null;
  return (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }
    keyBindings.forEach((keyBinding) => {
      let sequence = keyBinding[0];
      let callback = keyBinding[1];
      let prev = possibleMatches.get(sequence);
      let remainingExpectedPresses = prev ? prev : sequence;
      let currentExpectedPress = remainingExpectedPresses[0];
      let matches = match(event, currentExpectedPress);
      if (!matches) {
        if (!getModifierState(event, event.key)) {
          possibleMatches.delete(sequence);
        }
      } else if (remainingExpectedPresses.length > 1) {
        possibleMatches.set(sequence, remainingExpectedPresses.slice(1));
      } else {
        possibleMatches.delete(sequence);
        callback(event);
      }
    });
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(possibleMatches.clear.bind(possibleMatches), timeout);
  };
}
export function tinykeys(target, keyBindingMap, options = {}) {
  let event = options.event ?? DEFAULT_EVENT;
  let onKeyEvent = createKeybindingsHandler(keyBindingMap, options);
  target.addEventListener(event, onKeyEvent);
  return () => {
    target.removeEventListener(event, onKeyEvent);
  };
}
//# sourceMappingURL=tinykeys.js.map
