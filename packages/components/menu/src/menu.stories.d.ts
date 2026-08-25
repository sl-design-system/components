import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Menu } from './menu.js';
type Props = Pick<Menu, 'selects' | 'emphasis'> & {
  menuItems(): TemplateResult;
  maxWidth: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    maxWidth: string;
    emphasis: 'subtle';
  };
  argTypes: {
    emphasis: {
      control: 'inline-radio';
      options: string[];
    };
    menuItems: {
      table: {
        disable: true;
      };
    };
  };
  parameters: {
    layout: string;
  };
  render: ({ maxWidth, menuItems, selects, emphasis }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Bold: Story;
export declare const Danger: Story;
export declare const Disabled: Story;
export declare const Divider: Story;
export declare const Icons: Story;
export declare const Group: Story;
export declare const GroupWithHeading: Story;
export declare const Overflow: Story;
export declare const Shortcut: Story;
export declare const Submenu: Story;
export declare const NestedSubmenu: Story;
export declare const Combination: Story;
export declare const All: Story;
