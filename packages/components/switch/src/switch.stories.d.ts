import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/infotip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Switch } from './switch.js';
type Props = Pick<Switch, 'checked' | 'disabled' | 'reverse' | 'size' | 'value'> & {
  text: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    checked: false;
    disabled: false;
    reverse: false;
    text: string;
    value: string;
  };
  argTypes: {
    size: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    checked,
    disabled,
    reverse,
    size,
    text,
    value
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Checked: Story;
export declare const Disabled: Story;
export declare const Empty: Story;
export declare const Overflow: Story;
export declare const Reverse: Story;
export declare const Infotip: Story;
export declare const CustomIcons: Story;
export declare const CustomValidity: Story;
export declare const All: Story;
