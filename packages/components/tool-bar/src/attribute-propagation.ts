import { type ButtonFill } from '@sl-design-system/button';

/**
 * Propagate `fill`, `variant` and `inverted` attributes to child buttons,
 * menu-buttons and tool-bar-dividers inside the given elements.
 */
export function updateChildAttributes(elements: Element[], fill?: ButtonFill, inverted?: boolean): void {
  elements.forEach(el => {
    updateButtonFillAndVariant(el, fill, inverted);
    updateDividerVariant(el, inverted);
  });
}

function updateButtonFillAndVariant(el: Element, fill?: ButtonFill, inverted?: boolean): void {
  const targets: Element[] = [];

  if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') {
    targets.push(el);
  }

  targets.push(...Array.from(el.querySelectorAll('sl-button, sl-menu-button')));

  targets.forEach(btn => {
    if (fill) {
      btn.setAttribute('fill', fill);
    }

    if (inverted) {
      btn.setAttribute('variant', 'inverted');
    } else {
      btn.removeAttribute('variant');
    }
  });
}

function updateDividerVariant(el: Element, inverted?: boolean): void {
  const dividers: Element[] = [];

  if (el.tagName === 'SL-TOOL-BAR-DIVIDER') {
    dividers.push(el);
  }

  dividers.push(...Array.from(el.querySelectorAll('sl-tool-bar-divider')));

  dividers.forEach(divider => {
    if (inverted) {
      divider.setAttribute('inverted', '');
    } else {
      divider.removeAttribute('inverted');
    }
  });
}
