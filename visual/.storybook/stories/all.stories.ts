import { All as AllMenuButton } from '../../../packages/components/menu/src/menu-button.stories';
import { All as AllDialog } from '../../../packages/components/dialog/src/dialog.stories';
import { All as AllTooltip } from '../../../packages/components/tooltip/src/tooltip.stories';
import { allModes } from '../modes';

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
export const MenuButton = { render: AllMenuButton.render };
export const Dialog = { render: AllDialog.render, play: AllDialog.play };
export const Tooltip = { render: AllTooltip.render };
