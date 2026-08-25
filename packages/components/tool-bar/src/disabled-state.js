export function queryToolBarButtons(host) {
  return Array.from(host.querySelectorAll('sl-button, sl-menu-button')).filter(
    btn => btn.closest('sl-tool-bar') === host
  );
}
export function syncDisabledState(host, disabled) {
  const buttons = queryToolBarButtons(host);
  if (disabled) {
    buttons.forEach(el => {
      if (el.hasAttribute('disabled') || el.disabled) {
        const isAttribute = el.hasAttribute('disabled');
        el.removeAttribute('disabled');
        if ('ariaDisabled' in el) {
          el.ariaDisabled = 'true';
        }
        el.disabled = false;
        el.setAttribute('data-toolbar-disabled-native', isAttribute ? 'attribute' : 'property');
      } else if (
        !el.hasAttribute('data-toolbar-disabled') &&
        !el.hasAttribute('data-toolbar-disabled-original') &&
        !el.hasAttribute('data-toolbar-disabled-native')
      ) {
        let ariaDisabled = el.getAttribute('aria-disabled');
        if (el.tagName === 'SL-MENU-BUTTON' && ariaDisabled === null) {
          const internalButton = el.renderRoot.querySelector('sl-button');
          ariaDisabled = internalButton?.getAttribute('aria-disabled') ?? null;
        }
        if (ariaDisabled !== null) {
          el.setAttribute('data-toolbar-disabled-original', ariaDisabled);
        } else {
          el.setAttribute('data-toolbar-disabled', '');
        }
        el.ariaDisabled = 'true';
      }
    });
  } else {
    buttons.forEach(el => {
      const nativeMarker = el.getAttribute('data-toolbar-disabled-native');
      if (nativeMarker !== null) {
        if (nativeMarker === 'attribute') {
          el.setAttribute('disabled', '');
        }
        el.disabled = true;
        el.ariaDisabled = null;
        el.removeAttribute('data-toolbar-disabled-native');
        el.removeAttribute('data-toolbar-disabled-original');
        el.removeAttribute('data-toolbar-disabled');
      } else if (el.hasAttribute('data-toolbar-disabled-original')) {
        const original = el.getAttribute('data-toolbar-disabled-original');
        el.ariaDisabled = original;
        el.removeAttribute('data-toolbar-disabled-original');
        el.removeAttribute('data-toolbar-disabled');
      } else if (el.hasAttribute('data-toolbar-disabled')) {
        el.ariaDisabled = null;
        el.removeAttribute('data-toolbar-disabled');
      }
    });
  }
}
//# sourceMappingURL=disabled-state.js.map
