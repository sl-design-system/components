import '@sl-design-system/button/register.js';
import '@sl-design-system/card/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type PaginatorSize } from './paginator-size';
import { PaginatorStatus } from './paginator-status';
import { type Paginator, VisiblePagesSize } from './paginator.js';

type Props = Pick<Paginator, 'activePage' | 'itemsPerPage' | 'pageSizes' | 'total' | 'size'> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: VisiblePagesSize[] = ['xs', 'sm', 'md', 'lg'];

export default {
  title: 'Navigation/Paginator',
  tags: ['draft'],
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  args: {
    total: 100,
    itemsPerPage: 10,
    pageSizes: [5, 10, 15],
    activePage: 2,
    size: 'lg'
  },
  argTypes: {
    size: {
      control: 'radio',
      options: sizes
    } //,
    // actions: {
    //   table: { disable: true }
    // },
    // content: {
    //   table: { disable: true }
    // }
  }, // TODO: undefined option for size as well?
  render: ({ activePage, itemsPerPage, pageSizes, total, size }) => {
    return html`
      <sl-paginator
        .total=${total}
        .pageSizes=${pageSizes}
        .activePage=${activePage}
        .itemsPerPage=${itemsPerPage}
        .size=${size}
      ></sl-paginator>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Overflow: Story = {
  args: {
    total: 900
  }
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone5'
    }
  },
  args: {
    activePage: 5
  },
  render: ({ activePage, itemsPerPage, pageSizes, total }) => {
    return html`
      <sl-paginator
        .total=${total}
        .pageSizes=${pageSizes}
        .activePage=${activePage}
        .itemsPerPage=${itemsPerPage}
      ></sl-paginator>
    `;
  }
};

export const PageSizeComponent: Story = {
  render: ({ pageSizes, itemsPerPage }) => {
    return html`<sl-paginator-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-paginator-size>`;
  }
};

export const ItemsCounterComponent: Story = {
  render: ({ activePage, itemsPerPage, total }) => html`
    <sl-paginator-status .total=${total} .activePage=${activePage} .itemsPerPage=${itemsPerPage}></sl-paginator-status>
  `
};

export const All: Story = {
  args: {
    total: 200
  },
  render: ({ activePage, itemsPerPage, pageSizes, size, total }) => {
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
        pageSize = document.querySelector('sl-paginator-size') as PaginatorSize,
        visibleItems = document.querySelector('sl-paginator-status') as PaginatorStatus;

      paginator?.addEventListener('sl-page-change', (event: SlChangeEvent) => {
        visibleItems.activePage = event.detail as number;
      });

      pageSize?.addEventListener('sl-page-size-change', (event: SlChangeEvent) => {
        const detail = event.detail as number;
        paginator.itemsPerPage = detail;
        visibleItems.itemsPerPage = detail;
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

        sl-paginator-size {
          justify-content: end;
        }
      </style>
      <div class="pagination">
        <sl-paginator-status
          .total=${total}
          .activePage=${activePage}
          .itemsPerPage=${itemsPerPage}
        ></sl-paginator-status>
        <sl-paginator
          .total=${total}
          .pageSizes=${pageSizes}
          .activePage=${activePage}
          .itemsPerPage=${itemsPerPage}
          .size=${size}
        ></sl-paginator>
        <sl-paginator-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-paginator-size>
      </div>
    `;
  }
};
