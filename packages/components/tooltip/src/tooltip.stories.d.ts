import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Tooltip } from './tooltip.js';
type Props = Pick<Tooltip, 'disabled' | 'open' | 'type'> & {
  maxWidth: number;
  position: string;
  showHoverBridge: boolean;
  text: string;
  tooltip(): TemplateResult;
  trigger: string[];
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    layout: string;
  };
  argTypes: {
    disabled: {
      control: 'boolean';
    };
    maxWidth: {
      control: 'number';
    };
    open: {
      control: 'boolean';
    };
    position: {
      control: 'inline-radio';
      options: string[];
    };
    showHoverBridge: {
      control: 'boolean';
    };
    text: {
      control: 'text';
    };
    tooltip: {
      table: {
        disable: true;
      };
    };
    trigger: {
      control: 'inline-check';
      options: string[];
    };
    type: {
      control: 'inline-radio';
      options: string[];
    };
  };
  args: {
    text: string;
    type: 'description';
  };
  render: ({
    disabled,
    maxWidth,
    open,
    position,
    showHoverBridge,
    text,
    tooltip,
    trigger,
    type
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const ClickTrigger: Story;
export declare const Disabled: Story;
export declare const HoverBridge: Story;
export declare const Shared: Story;
export declare const All: Story;
