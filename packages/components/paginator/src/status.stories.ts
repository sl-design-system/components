import { ArrayDataSource } from '@sl-design-system/data-source';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { PaginatorStatus } from './status.js';

type Props = Pick<PaginatorStatus, 'pageSize' | 'page' | 'totalItems'>;
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Paginator/Status',
  tags: ['draft'],
  args: {
    totalItems: 100,
    pageSize: 10,
    page: 5
  },
  render: ({ pageSize, page, totalItems }) => {
    return html`
      <sl-paginator-status .page=${page} .pageSize=${pageSize} .totalItems=${totalItems}></sl-paginator-status>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const DataSource: Story = {
  render: () => {
    const dataSource = new ArrayDataSource([
      { nr: 1, title: 'test 1' },
      { nr: 2, title: 'test 2' },
      { nr: 3, title: 'test 3' },
      { nr: 4, title: 'test 4' },
      { nr: 5, title: 'test 5' },
      { nr: 6, title: 'test 6' },
      { nr: 7, title: 'test 7' },
      { nr: 8, title: 'test 8' },
      { nr: 9, title: 'test 9' },
      { nr: 10, title: 'test 10' }
    ]);

    requestAnimationFrame(() => {
      const totalItems = dataSource.items.length;
      dataSource.paginate(2, 5, totalItems);
      dataSource.update();
    });

    return html`<sl-paginator-status .dataSource=${dataSource}></sl-paginator-status>`;
  }
};
