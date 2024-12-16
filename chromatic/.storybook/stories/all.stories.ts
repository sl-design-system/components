import { updateTheme } from '../../../.storybook/themes.js';
import { All as AllAccordion } from '../../../packages/components/accordion/src/accordion.stories';
import { All as AllAvatar } from '../../../packages/components/avatar/src/avatar.stories';
import { All as AllBadge } from '../../../packages/components/badge/src/badge.stories';
import { All as AllBreadcrumbs } from '../../../packages/components/breadcrumbs/src/breadcrumbs.stories';
import { All as AllButton } from '../../../packages/components/button/src/button.stories';
import { All as AllButtonBar } from '../../../packages/components/button-bar/src/button-bar.stories';
import { All as AllCard } from '../../../packages/components/card/src/card.stories';
import { All as AllCheckbox } from '../../../packages/components/checkbox/src/checkbox.stories';
import { All as AllCombobox } from '../../../packages/components/combobox/src/combobox.stories';
import { All as AllDialog } from '../../../packages/components/dialog/src/dialog.stories';
import { All as AllIcon } from '../../../packages/components/icon/src/icon.stories';
import { All as AllInlineMessage } from '../../../packages/components/inline-message/src/inline-message.stories';
import { All as AllMenu } from '../../../packages/components/menu/src/menu.stories';
import { All as AllMenuButton } from '../../../packages/components/menu/src/menu-button.stories';
import { All as AllPopover } from '../../../packages/components/popover/src/popover.stories';
import { All as AllRadioGroup } from '../../../packages/components/radio-group/src/radio-group.stories';
import { All as AllSelect } from '../../../packages/components/select/src/select.stories';
import { All as AllSkeleton } from '../../../packages/components/skeleton/src/skeleton.stories';
import { All as AllSpinner } from '../../../packages/components/spinner/src/spinner.stories';
import { All as AllSwitch } from '../../../packages/components/switch/src/switch.stories';
import { All as AllTextArea } from '../../../packages/components/text-area/src/text-area.stories';
import { All as AllTextField } from '../../../packages/components/text-field/src/text-field.stories';
import { All as AllToggleButton } from '../../../packages/components/toggle-button/src/toggle-button.stories';
import { All as AllTooltip } from '../../../packages/components/tooltip/src/tooltip.stories';
import { allModes } from "../modes";

export default {
  title: 'All',
  args: {
    theme: 'sanoma-learning',
    icons: Object.keys(window.SLDS?.icons)
  },
  loaders: [
    async ({ globals: { theme }}) => await updateTheme(theme)
  ],
  parameters: {
    chromatic: {
      modes: {
        'bingel-dc': allModes['bingel-dc'],
        'bingel-int': allModes['bingel-int'],
        'clickedu': allModes['clickedu'],
        'editorial-suite': allModes['editorial-suite'],
        'itslearning': allModes['itslearning'],
        'kampus': allModes['kampus'],
        'magister': allModes['magister'],
        'max': allModes['max'],
        'my-digital-book': allModes['my-digital-book'],
        'neon': allModes['neon'],
        'sanoma-learning': allModes['sanoma-learning'],
        'teas': allModes['teas'],
      }
    }
  }
};

/**
 * When adding an "All" story of a component you need to only include all variants that can have changes per style;
 * so when multiple variants or scenarios use the exact same styling or, more specifically, tokens,
 * there is no need to include all those scenarios.
 *
 * The All story always needs its own `render` function, otherwise this doesn't work.
 */
export const Accordion = { render: AllAccordion.render };
export const Avatar = { render: AllAvatar.render };
export const Badge = { render: AllBadge.render };
export const Breadcrumbs = { render: AllBreadcrumbs.render };
export const Button = { render: AllButton.render };
export const ButtonBar = { render: AllButtonBar.render };
export const Card = { render: AllCard.render };
export const Checkbox = { render: AllCheckbox.render };
export const Combobox = { render: AllCombobox.render };
export const Dialog = { render: AllDialog.render, play: AllDialog.play };
export const Icon = { render: AllIcon.render };
export const InlineMessage = { render: AllInlineMessage.render };
export const Menu = { render: AllMenu.render };
export const MenuButton = { render: AllMenuButton.render };
export const Popover = { render: AllPopover.render };
export const RadioGroup = { render: AllRadioGroup.render };
export const Select = { render: AllSelect.render };
export const Skeleton = { render: AllSkeleton.render };
export const Spinner = { render: AllSpinner.render };
export const Switch = { render: AllSwitch.render };
export const TextArea = { render: AllTextArea.render };
export const TextField = { render: AllTextField.render };
export const ToggleButton = { render: AllToggleButton.render };
export const Tooltip = { render: AllTooltip.render };
