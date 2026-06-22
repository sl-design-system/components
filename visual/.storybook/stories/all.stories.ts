import menuButtonMeta, {
  Submenu as AllMenuButton
} from '../../../packages/components/menu/src/menu-button.stories';
import { All as AllDialog } from '../../../packages/components/dialog/src/dialog.stories';
import { All as AllTooltip } from '../../../packages/components/tooltip/src/tooltip.stories';
import { nothing } from 'lit';
import { expect, userEvent } from 'storybook/test';
import { allModes } from '../modes';

type PlayContext = {
  canvasElement?: unknown;
};

const getCanvasRoot = (context: PlayContext): ParentNode => {
  if (
    context.canvasElement instanceof Element ||
    context.canvasElement instanceof DocumentFragment
  ) {
    return context.canvasElement;
  }

  return document.body;
};

export default {
  title: 'All',
  args: {
    theme: 'sanoma-learning',
    icons: Object.keys(window.SLDS?.icons || {})
  },
  parameters: {
    chromatic: {
      modes: Object.fromEntries(Object.entries(allModes).filter(([key]) => key !== 'default'))
    }
  }
};

/**
 * When adding an "All" story of a component you need to only include all variants that can have
 * changes per style; so when multiple variants or scenarios use the exact same styling or, more
 * specifically, tokens, there is no need to include all those scenarios.
 *
 * The All story always needs its own `render` function, otherwise this doesn't work.
 */
export const MenuButton = {
  play: async (context: PlayContext) => {
    const root = getCanvasRoot(context),
      menuButton = root.querySelector('sl-menu-button'),
      trigger = menuButton?.shadowRoot?.querySelector('sl-button');

    if (!trigger) {
      throw new Error('Expected sl-menu-button trigger to be rendered.');
    }

    await userEvent.click(trigger);

    const menu = menuButton?.shadowRoot?.querySelector('sl-menu');

    await expect.poll(() => Boolean(menu?.matches(':popover-open'))).toBe(true);
  },
  render: () => {
    if (!menuButtonMeta.render) {
      return nothing;
    }

    const args = { ...(menuButtonMeta.args ?? {}), ...(AllMenuButton.args ?? {}) };

    return menuButtonMeta.render(args);
  }
};
export const Dialog = {
  play: async (context: PlayContext) => {
    const root = getCanvasRoot(context),
      trigger = root.querySelector('sl-button');

    if (!trigger) {
      throw new Error('Expected dialog trigger button to be rendered.');
    }

    await userEvent.click(trigger);

    const dialogHost = root.querySelector('sl-dialog'),
      nativeDialog = dialogHost?.shadowRoot?.querySelector('dialog');

    await expect.poll(() => Boolean(nativeDialog?.open)).toBe(true);
  },
  render: AllDialog.render
};

export const Tooltip = {
  play: async (context: PlayContext) => {
    const root = getCanvasRoot(context),
      trigger = root.querySelector('sl-button');

    if (!trigger) {
      throw new Error('Expected tooltip trigger button to be rendered.');
    }

    await userEvent.hover(trigger);

    const tooltip = root.querySelector('sl-tooltip');

    await expect.poll(() => Boolean(tooltip?.matches(':popover-open'))).toBe(true);
  },
  render: AllTooltip.render
};
