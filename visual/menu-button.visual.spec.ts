import { takeSnapshot } from '@chromatic-com/vitest';
import { render } from 'lit';
import { describe, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as stories from '../packages/components/menu/src/menu-button.stories.ts';

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

const mountBasicStory = () => {
  const args = { ...meta.args, ...basic.args };

  if (!meta.render) {
    throw new Error('Expected menu-button stories default export to include a render function.');
  }

  render(meta.render(args), document.body);
};

const getMenuAndWaitForState = async (expectedOpen: boolean) => {
  const menuButton = document.querySelector('sl-menu-button') as MenuButtonElement | null;
  if (!menuButton) {
    throw new Error('Expected sl-menu-button to be rendered.');
  }

  const menu = menuButton.renderRoot?.querySelector('sl-menu') as MenuElement | null;
  if (!menu) {
    throw new Error('Expected sl-menu to be rendered.');
  }

  // Wait for the :popover-open state to match expected
  let attempts = 0;
  while (attempts < 50) {
    const isOpen = menu.matches(':popover-open');
    if (isOpen === expectedOpen) {
      break;
    }
    await new Promise(resolve => requestAnimationFrame(resolve));
    attempts++;
  }

  return menu;
};

describe('menu-button visual', () => {
  it('story + extra interactions', async () => {
    mountBasicStory();

    // Open menu explicitly
    let menu = await getMenuAndWaitForState(false);
    menu.showPopover?.();
    menu = await getMenuAndWaitForState(true);

    await takeSnapshot('basic-open');

    // Close menu
    await userEvent.keyboard('{Escape}');
    menu = await getMenuAndWaitForState(false);

    await takeSnapshot('basic-closed-after-escape');
  });
});
