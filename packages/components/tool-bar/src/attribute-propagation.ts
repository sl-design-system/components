import { type ButtonFill } from '@sl-design-system/button';

type PropagatedState = {
  fill?: ButtonFill;
  inverted?: true; // toolbar propagated the `inverted` boolean attribute (dividers)
  variant?: true; // toolbar propagated `variant="inverted"` (buttons / menu-buttons)
};

const propagatedState = new WeakMap<Element, PropagatedState>();

/**
 * Propagate `fill`, `variant` and `inverted` attributes to child buttons, menu-buttons and
 * tool-bar-dividers inside the given elements.
 */
export function updateChildAttributes(
  elements: Element[],
  fill?: ButtonFill,
  inverted?: boolean
): void {
  for (const el of elements) {
    updateButtonFillAndVariant(el, fill, inverted);
    updateDividerVariant(el, inverted);
  }
}

function updateButtonFillAndVariant(el: Element, fill?: ButtonFill, inverted?: boolean): void {
  for (const btn of getTargets(el, ['SL-BUTTON', 'SL-MENU-BUTTON'], 'sl-button, sl-menu-button')) {
    const state = getState(btn);

    syncFill(btn, state, fill);
    syncVariant(btn, state, inverted);
    saveState(btn, state);
  }
}

function updateDividerVariant(el: Element, inverted?: boolean): void {
  for (const divider of getTargets(el, ['SL-TOOL-BAR-DIVIDER'], 'sl-tool-bar-divider')) {
    const state = getState(divider);

    syncDividerInverted(divider, state, inverted);
    saveState(divider, state);
  }
}

function syncFill(btn: Element, state: PropagatedState, fill?: ButtonFill): void {
  if (state.fill !== undefined) {
    clearPropagatedIfChanged(btn, state, 'fill', state.fill);
  }

  if (fill && (!btn.hasAttribute('fill') || state.fill !== undefined)) {
    btn.setAttribute('fill', fill);
    state.fill = fill;
  } else if (!fill && state.fill !== undefined) {
    btn.removeAttribute('fill');
    delete state.fill;
  }
}

function syncVariant(btn: Element, state: PropagatedState, inverted?: boolean): void {
  clearPropagatedIfChanged(btn, state, 'variant', 'inverted');

  if (inverted && (!btn.hasAttribute('variant') || state.variant)) {
    btn.setAttribute('variant', 'inverted');
    state.variant = true;
  } else if (!inverted && state.variant) {
    btn.removeAttribute('variant');
    delete state.variant;
  }
}

function syncDividerInverted(divider: Element, state: PropagatedState, inverted?: boolean): void {
  clearPropagatedIfChanged(divider, state, 'inverted', '');

  if (inverted && (!divider.hasAttribute('inverted') || state.inverted)) {
    divider.setAttribute('inverted', '');
    state.inverted = true;
  } else if (!inverted && state.inverted) {
    divider.removeAttribute('inverted');
    delete state.inverted;
  }
}

function getTargets(el: Element, tagNames: string[], selector: string): Element[] {
  return [
    ...(tagNames.includes(el.tagName) ? [el] : []),
    ...Array.from(el.querySelectorAll(selector))
  ];
}

function getState(el: Element): PropagatedState {
  return propagatedState.get(el) ?? {};
}

function clearPropagatedIfChanged(
  el: Element,
  state: PropagatedState,
  key: keyof PropagatedState,
  expectedValue: string
): void {
  if (state[key] !== undefined && el.getAttribute(String(key)) !== expectedValue) {
    delete state[key];
  }
}

/** Persists `state` back into the WeakMap, or removes the entry when state is empty. */
function saveState(el: Element, state: PropagatedState): void {
  if (Object.keys(state).length > 0) {
    propagatedState.set(el, state);
  } else {
    propagatedState.delete(el);
  }
}
