import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Listbox } from './listbox.js';
type Props = Pick<
  Listbox,
  | 'emphasis'
  | 'options'
  | 'optionGroupPath'
  | 'optionLabelPath'
  | 'optionSelectedPath'
  | 'optionValuePath'
> & {
  slot?(): TemplateResult;
  behavior?: 'smooth' | 'auto';
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  argTypes: {
    behavior: {
      control: 'radio';
      options: string[];
    };
    emphasis: {
      control: 'inline-radio';
      options: string[];
    };
    options: {
      table: {
        disable: true;
      };
    };
    slot: {
      table: {
        disable: true;
      };
    };
  };
  render: ({
    behavior,
    emphasis,
    options,
    optionGroupPath,
    optionLabelPath,
    optionSelectedPath,
    optionValuePath,
    slot
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const Divider: Story;
export declare const Emphasis: Story;
export declare const Groups: Story;
export declare const Overflow: Story;
export declare const RichContent: Story;
export declare const VirtualList: Story;
export declare const VirtualListWithGroups: Story;
export declare const VirtualListUnconstrained: Story;
