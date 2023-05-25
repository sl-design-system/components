
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/text-input/register.js';
import '@sl-design-system/label/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/textarea/register.js';
import { All as AllButton} from "../../../packages/components/button/src/button.stories";
import { All as AllRadioGroup} from "../../../packages/components/button/src/button.stories";
import { updateTheme } from '../themes';

updateTheme('magister','light');

export default {
  title: 'Magister',
  args: {
    text: 'Button',
    icon: 'none',
    size: 'md',
    fill: 'default',
    variant: 'default'
  },
};

export const Buttons = AllButton;
export const RadioGroup = AllRadioGroup;
