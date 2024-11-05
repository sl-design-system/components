import '@sl-design-system/button/register.js';
import '@sl-design-system/card/register.js';
import { ArrayDataSource } from '@sl-design-system/data-source';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { PaginatorStatus } from './paginator-status';
import { type Paginator } from './paginator.js';

type Props = Pick<PaginatorStatus, 'pageSize' | 'page' | 'totalItems'> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Paginator/Paginator status',
  tags: ['draft'],
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  args: {
    totalItems: 100,
    pageSize: 10,
    page: 5
  },
  render: ({ pageSize, page, totalItems }) => {
    return html`
      <sl-paginator-status .totalItems=${totalItems} .page=${page} .pageSize=${pageSize}></sl-paginator-status>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const WithDataSource: Story = {
  render: () => {
    const items = [
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
    ];

    const dataSource = new ArrayDataSource(items);

    requestAnimationFrame(() => {
      const totalItems = dataSource.items.length;
      dataSource.paginate(2, 5, totalItems);
      dataSource.update();
    });

    return html` <sl-paginator-status .dataSource=${dataSource}></sl-paginator-status> `;
  }
};

export const WithPaginator: Story = {
  args: {
    page: 3,
    totalItems: 200
  },
  render: ({ page, pageSize, totalItems }) => {
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
        visibleItems = document.querySelector('sl-paginator-status') as PaginatorStatus;

      paginator?.addEventListener('sl-page-change', (event: SlChangeEvent) => {
        visibleItems.page = event.detail as number;
      });
    });
    return html`
      <style>
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        sl-paginator {
          flex: 1;
        }
      </style>
      <div class="pagination">
        <sl-paginator-status .totalItems=${totalItems} .page=${page} .pageSize=${pageSize}></sl-paginator-status>
        <sl-paginator .totalItems=${totalItems} .page=${page} .pageSize=${pageSize}></sl-paginator>
      </div>
    `;
  }
};
