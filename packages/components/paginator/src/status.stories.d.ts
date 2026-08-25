import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { PaginatorStatus } from './status.js';
type Props = Pick<PaginatorStatus, 'itemLabel' | 'pageSize' | 'page' | 'totalItems'>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    totalItems: number;
    pageSize: number;
    page: number;
  };
  render: ({
    itemLabel,
    pageSize,
    page,
    totalItems
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const DataSource: Story;
export declare const CustomItemLabel: Story;
