
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/text-input/register.js';
import '@sl-design-system/label/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/textarea/register.js';
import {MessageSize} from "@sl-design-system/shared";
import { All } from "../../../packages/components/button/src/button.stories";
import { updateTheme } from '../themes';


const sizes: MessageSize[] = ['sm', 'md', 'lg'];
updateTheme('max','light');

export default {
  title: 'Max',
  args: {
    text: 'Button',
    icon: 'none',
    size: 'md',
    fill: 'default',
    variant: 'default'
  },
};

export const Buttons = All;
