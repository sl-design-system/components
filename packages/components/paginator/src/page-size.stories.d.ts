import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type PaginatorPageSize } from './page-size.js';
type Props = Pick<PaginatorPageSize, 'itemLabel' | 'pageSize' | 'pageSizes'>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    pageSize: number;
    pageSizes: number[];
  };
  render: ({ itemLabel, pageSize, pageSizes }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const DataSource: Story;
export declare const CustomItemLabel: Story;
