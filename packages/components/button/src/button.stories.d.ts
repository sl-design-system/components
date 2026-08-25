import '@sl-design-system/avatar/register.js';
import '@sl-design-system/dialog/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/tooltip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Button } from './button.js';
interface Props extends Pick<
  Button,
  'disabled' | 'fill' | 'shape' | 'size' | 'tooltip' | 'variant'
> {
  icon: string;
  text: string;
}
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    a11y: {
      config: {
        rules: {
          id: string;
          selector: string;
        }[];
      };
    };
  };
  args: {
    disabled: false;
    icon: string;
    text: string;
  };
  argTypes: {
    fill: {
      control: 'inline-radio';
      options: string[];
    };
    icon: {
      control: 'inline-radio';
      options: string[];
    };
    shape: {
      control: 'inline-radio';
      options: string[];
    };
    size: {
      control: 'inline-radio';
      options: string[];
    };
    variant: {
      control: 'radio';
      options: string[];
    };
  };
  render: ({
    disabled,
    fill,
    icon,
    shape,
    size,
    text,
    tooltip,
    variant
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Avatar: Story;
export declare const Command: Story;
export declare const Disabled: Story;
export declare const DoubleLabel: Story;
export declare const IconOnly: Story;
export declare const Pill: Story;
export declare const All: Story;
