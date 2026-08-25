import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Accordion } from './accordion.js';
export type Props = Pick<Accordion, 'iconType' | 'single'> & {
  items(): TemplateResult;
};
export type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    iconType: 'plusminus';
    single: false;
  };
  argTypes: {
    iconType: {
      control: 'inline-radio';
      options: string[];
    };
    items: {
      table: {
        disable: true;
      };
    };
  };
  render: ({ iconType, items, single }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Extras: Story;
export declare const IconType: Story;
export declare const NoBottomBorder: Story;
export declare const Overflow: Story;
export declare const Single: Story;
export declare const Sticky: Story;
export declare const ToggleExternally: Story;
export declare const All: Story;
