import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type VirtualList } from './virtual-list.js';
type Props = Pick<VirtualList, 'estimateSize' | 'gap' | 'overscan' | 'renderItem'> & {
  itemCount?: number;
  items?: unknown[];
  overflow?: boolean;
  behavior?: 'smooth' | 'auto';
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    chromatic: {
      disableSnapshot: boolean;
    };
    layout: string;
  };
  args: {
    behavior: 'auto';
    estimateSize: number;
    gap: number;
    itemCount: number;
    overscan: number;
  };
  argTypes: {
    renderItem: {
      table: {
        disable: true;
      };
    };
    items: {
      table: {
        disable: true;
      };
    };
    behavior: {
      control: {
        type: 'radio';
      };
      options: string[];
    };
  };
  render: ({
    estimateSize,
    gap,
    itemCount,
    items,
    overflow,
    overscan,
    renderItem,
    behavior
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Gap: Story;
export declare const Overflow: Story;
export declare const Size: Story;
