const propagatedState = /* @__PURE__ */ new WeakMap();
export function updateChildAttributes(elements, fill, inverted) {
  for (const el of elements) {
    updateButtonFillAndVariant(el, fill, inverted);
    updateDividerVariant(el, inverted);
  }
}
function updateButtonFillAndVariant(el, fill, inverted) {
  for (const btn of getTargets(el, ['SL-BUTTON', 'SL-MENU-BUTTON'], 'sl-button, sl-menu-button')) {
    const state = getState(btn);
    syncFill(btn, state, fill);
    syncVariant(btn, state, inverted);
    saveState(btn, state);
  }
}
function updateDividerVariant(el, inverted) {
  for (const divider of getTargets(el, ['SL-TOOL-BAR-DIVIDER'], 'sl-tool-bar-divider')) {
    const state = getState(divider);
    syncDividerInverted(divider, state, inverted);
    saveState(divider, state);
  }
}
function syncFill(btn, state, fill) {
  if (state.fill !== void 0) {
    clearPropagatedIfChanged(btn, state, 'fill', state.fill);
  }
  if (fill && (!btn.hasAttribute('fill') || state.fill !== void 0)) {
    btn.setAttribute('fill', fill);
    state.fill = fill;
  } else if (!fill && state.fill !== void 0) {
    btn.removeAttribute('fill');
    delete state.fill;
  }
}
function syncVariant(btn, state, inverted) {
  clearPropagatedIfChanged(btn, state, 'variant', 'inverted');
  if (inverted && (!btn.hasAttribute('variant') || state.variant)) {
    btn.setAttribute('variant', 'inverted');
    state.variant = true;
  } else if (!inverted && state.variant) {
    btn.removeAttribute('variant');
    delete state.variant;
  }
}
function syncDividerInverted(divider, state, inverted) {
  clearPropagatedIfChanged(divider, state, 'inverted', '');
  if (inverted && (!divider.hasAttribute('inverted') || state.inverted)) {
    divider.setAttribute('inverted', '');
    state.inverted = true;
  } else if (!inverted && state.inverted) {
    divider.removeAttribute('inverted');
    delete state.inverted;
  }
}
function getTargets(el, tagNames, selector) {
  return [
    ...(tagNames.includes(el.tagName) ? [el] : []),
    ...Array.from(el.querySelectorAll(selector))
  ];
}
function getState(el) {
  return propagatedState.get(el) ?? {};
}
function clearPropagatedIfChanged(el, state, key, expectedValue) {
  if (state[key] !== void 0 && el.getAttribute(String(key)) !== expectedValue) {
    delete state[key];
  }
}
function saveState(el, state) {
  if (Object.keys(state).length > 0) {
    propagatedState.set(el, state);
  } else {
    propagatedState.delete(el);
  }
}
//# sourceMappingURL=attribute-propagation.js.map
