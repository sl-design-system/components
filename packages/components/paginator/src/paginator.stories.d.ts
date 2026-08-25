import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Paginator } from './paginator.js';
type Props = Pick<Paginator, 'emphasis' | 'page' | 'pageSize' | 'size' | 'totalItems' | 'width'>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    viewport: {
      disable: boolean;
    };
  };
  args: {
    page: number;
    pageSize: number;
    totalItems: number;
  };
  argTypes: {
    emphasis: {
      control: 'inline-radio';
      options: string[];
    };
    size: {
      control: 'radio';
      options: string[];
    };
    width: {
      control: 'radio';
      options: string[];
    };
  };
  render: ({
    emphasis,
    page,
    pageSize,
    size,
    totalItems,
    width
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Mobile: Story;
export declare const All: Story;
