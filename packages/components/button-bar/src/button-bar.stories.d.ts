import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type ButtonBar } from './button-bar.js';
type Props = Pick<ButtonBar, 'align' | 'reverse' | 'size'> & {
  buttons(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    align: 'start';
    reverse: false;
  };
  argTypes: {
    align: {
      control: 'select';
      options: string[];
    };
    buttons: {
      table: {
        disable: true;
      };
    };
    size: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({ align, buttons, reverse, size }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Groups: Story;
export declare const Wrapping: Story;
export declare const IconOnly: Story;
export declare const All: Story;
