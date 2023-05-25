
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/text-input/register.js';
import '@sl-design-system/label/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/textarea/register.js';
import { All as AllButton} from "../../../packages/components/button/src/button.stories";
import { All as AllCheckbox} from "../../../packages/components/checkbox/src/checkbox.stories";
import { All as AllRadioGroup} from "../../../packages/components/radio-group/src/radio-group.stories";
import { html } from 'lit';
import { themes } from '../themes';

export default {
  title: 'Max',
  decorators: [
    (Story) => {
      const fonts = themes.find(theme => theme.id==='max')?.fonts || [];
      return html`
        <link href="/themes/max/base.css" rel="stylesheet">
        <link href="/themes/max/light.css" rel="stylesheet">
        ${fonts.map(font => html`<link href="${font}" rel="stylesheet">`)}
        ${Story()}`
    },
  ],
  args: {
    text: 'Button',
    icon: 'none',
    size: 'md',
    fill: 'default',
    variant: 'default'
  }
};


export const Button = AllButton;
export const Checkbox = AllCheckbox;
export const RadioGroup = AllRadioGroup;
