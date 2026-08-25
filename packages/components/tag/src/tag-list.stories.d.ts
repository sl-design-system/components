import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type TagList } from './tag-list.js';
type Props = Pick<TagList, 'size' | 'stacked' | 'variant'> & {
  count: number;
  disabled?: boolean;
  removable?: boolean;
  tags?(): TemplateResult[];
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    count: number;
    removable: false;
    stacked: false;
  };
  argTypes: {
    size: {
      control: 'inline-radio';
      options: string[];
    };
    variant: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    count,
    disabled,
    removable,
    size,
    stacked,
    tags,
    variant
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Info: Story;
export declare const Large: Story;
export declare const Removable: Story;
export declare const InfoRemovable: Story;
export declare const RemovableDisabled: Story;
export declare const Stacked: Story;
export declare const StackedOver100: Story;
export declare const StackedRemovable: Story;
