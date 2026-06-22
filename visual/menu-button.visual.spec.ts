import { takeSnapshot } from '@chromatic-com/vitest';
import { render } from 'lit';
import { describe, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as stories from '../packages/components/menu/src/menu-button.stories.js';

const meta = stories.default,
  basic = stories.Basic;

type MenuButtonElement = HTMLElement & {
  updateComplete?: Promise<unknown>;
  renderRoot?: ShadowRoot;
};

type MenuElement = HTMLElement & {
  showPopover?: () => void;
  hidePopover?: () => void;
};

type ButtonElement = HTMLElement;

const mountBasicStory = async () => {
  document.body.innerHTML = '';
  const args = { ...meta.args, ...basic.args };

  if (!meta.render) {
    throw new Error('Expected menu-button stories default export to include a render function.');
  }

  render(meta.render(args), document.body);

  const menuButton = document.querySelector('sl-menu-button') as MenuButtonElement | null;
  await menuButton?.updateComplete;
};

const getElements = () => {
  const menuButton = document.querySelector('sl-menu-button') as MenuButtonElement | null;
  if (!menuButton) {
    throw new Error('Expected sl-menu-button to be rendered.');
  }

  const menu = menuButton.renderRoot?.querySelector('sl-menu') as MenuElement | null;
  if (!menu) {
    throw new Error('Expected sl-menu to be rendered.');
  }

  const button = menuButton.renderRoot?.querySelector('sl-button') as ButtonElement | null;
  if (!button) {
    throw new Error('Expected sl-button trigger to be rendered.');
  }

  return { button, menu };
};

const waitForPopoverState = async (menu: MenuElement, expectedOpen: boolean) => {
  let attempts = 0;

  while (attempts < 50) {
    const isOpen = menu.matches(':popover-open');
    if (isOpen === expectedOpen) {
      return;
    }

    await new Promise(resolve => requestAnimationFrame(resolve));
    attempts++;
  }

  throw new Error(
    `Timed out waiting for menu popover state "${expectedOpen ? 'open' : 'closed'}".`
  );
};

describe('menu-button visual', () => {
  it('story + extra interactions', async () => {
    await mountBasicStory();

    const { button, menu } = getElements();

    await waitForPopoverState(menu, false);

    // Use real user input so the visual baseline matches interaction behavior.
    await userEvent.click(button);
    await waitForPopoverState(menu, true);

    await takeSnapshot('basic-open');

    // Close via keyboard to verify the interactive state transition.
    menu.focus();
    await userEvent.keyboard('{Escape}');
    await waitForPopoverState(menu, false);

    await takeSnapshot('basic-closed-after-escape');
  });
});
