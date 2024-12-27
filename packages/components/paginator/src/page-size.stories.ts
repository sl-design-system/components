import { ArrayDataSource } from '@sl-design-system/data-source';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type PaginatorPageSize } from './page-size.js';

type Props = Pick<PaginatorPageSize, 'pageSize' | 'pageSizes'>;
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Paginator/Page size',
  tags: ['draft'],
  args: {
    pageSize: 10,
    pageSizes: [5, 10, 15]
  },
  render: ({ pageSize, pageSizes }) => {
    return html`<sl-paginator-page-size .pageSize=${pageSize} .pageSizes=${pageSizes}></sl-paginator-page-size>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const DataSource: Story = {
  render: () => {
    const items = Array.from({ length: 80 }, (_, index) => ({ nr: index + 1 })),
      pageSizes = [5, 10, 15, 20, 25, 30];

    const dataSource = new ArrayDataSource(items);
    dataSource.setPage(2);
    dataSource.setPageSize(5);
    dataSource.update();

    return html`<sl-paginator-page-size .dataSource=${dataSource} .pageSizes=${pageSizes}></sl-paginator-page-size>`;
  }
};
