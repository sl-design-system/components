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
import { type PaginatorSize } from './paginator-size';
import { type Paginator } from './paginator.js';

type Props = Pick<PaginatorSize, 'pageSize' | 'pageSizes'> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Paginator/Paginator size',
  tags: ['draft'],
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  args: {
    pageSize: 10,
    pageSizes: [5, 10, 15]
  },
  render: ({ pageSize, pageSizes }) => {
    return html` <sl-paginator-size .pageSizes=${pageSizes} .pageSize=${pageSize}></sl-paginator-size> `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const WithDataSource: Story = {
  render: () => {
    const items = Array.from({ length: 80 }, (_, index) => ({
      nr: index + 1
    }));

    const pageSizes = [5, 10, 15, 20, 25, 30];

    const dataSource = new ArrayDataSource(items);

    requestAnimationFrame(() => {
      const totalItems = dataSource.items.length;
      dataSource.paginate(2, 5, totalItems);
      dataSource.update();
    });

    return html` <sl-paginator-size .dataSource=${dataSource} .pageSizes=${pageSizes}></sl-paginator-size>`;
  }
};

export const WithPaginator: Story = {
  args: {
    pageSize: 30,
    pageSizes: [5, 15, 30, 45]
  },
  render: ({ pageSize, pageSizes }) => {
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
        pageSize = document.querySelector('sl-paginator-size') as PaginatorSize;

      pageSize?.addEventListener('sl-page-size-change', (event: SlChangeEvent) => {
        const detail = event.detail as number;
        paginator.pageSize = detail;
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
        <sl-paginator totalItems="120" .pageSize=${pageSize}></sl-paginator>
        <sl-paginator-size .pageSizes=${pageSizes} .pageSize=${pageSize}></sl-paginator-size>
      </div>
    `;
  }
};
