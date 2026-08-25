import '@sl-design-system/avatar/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/tooltip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type MenuButton } from './menu-button.js';
type Props = Pick<MenuButton, 'disabled' | 'fill' | 'position' | 'shape' | 'size' | 'variant'> & {
  alignSelf: string;
  ariaDisabled?: string;
  body: string | (() => TemplateResult);
  justifySelf: string;
  menuItems?(): TemplateResult;
  tooltip?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    alignSelf: string;
    body: string;
    disabled: false;
    justifySelf: string;
  };
  argTypes: {
    alignSelf: {
      control: 'inline-radio';
      options: string[];
    };
    ariaDisabled: {
      control: 'text';
    };
    body: {
      table: {
        disable: true;
      };
    };
    fill: {
      control: 'inline-radio';
      options: string[];
    };
    justifySelf: {
      control: 'inline-radio';
      options: string[];
    };
    menuItems: {
      table: {
        disable: true;
      };
    };
    position: {
      control: 'select';
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
    tooltip: {
      control: 'text';
    };
    variant: {
      control: 'inline-radio';
      options: string[];
    };
  };
  parameters: {
    chromatic: {
      disableSnapshot: boolean;
    };
  };
  render: ({
    alignSelf,
    ariaDisabled,
    body,
    disabled,
    fill,
    justifySelf,
    menuItems,
    position,
    shape,
    size,
    tooltip,
    variant
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const OpenCloseEvent: Story;
export declare const Disabled: Story;
export declare const AriaDisabled: Story;
export declare const IconAndText: Story;
export declare const Text: Story;
export declare const LongMenu: Story;
export declare const Submenu: Story;
export declare const WithGroups: Story;
export declare const Avatar: Story;
export declare const All: Story;
