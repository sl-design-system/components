import '@sl-design-system/button/register.js';
import '@sl-design-system/card/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/paginator/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { ItemsCounter } from './items-counter';
import { type PageSize } from './page-size.js';
import { type Paginator } from './paginator.js';

type Props = Pick<Paginator, 'activePage' | 'itemsPerPage' | 'pageSizes' | 'total'> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Paginator',
  tags: ['draft'],
  args: {
    total: 100,
    itemsPerPage: 10,
    pageSizes: [5, 10, 15],
    activePage: 2
  },
  argTypes: {
    actions: {
      table: { disable: true }
    },
    content: {
      table: { disable: true }
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
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
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Overflow: Story = {
  args: {
    ...Basic.args,
    total: 900
  }
};

export const Mobile: Story = {
  args: {
    ...Basic.args,
    activePage: 5,
    total: 150
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone5'
    }
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
  args: {
    ...Basic.args
  },
  render: ({ pageSizes, itemsPerPage }) => {
    return html`<sl-page-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-page-size>`;
  }
};

export const ItemsCounterComponent: Story = {
  args: {
    ...Basic.args
  },
  render: ({ activePage, itemsPerPage, total }) => html`
    <sl-items-counter .total=${total} .activePage=${activePage} .itemsPerPage=${itemsPerPage}></sl-items-counter>
  `
};

export const All: Story = {
  args: {
    ...Basic.args,
    total: 200
  },
  render: ({ activePage, itemsPerPage, pageSizes, total }) => {
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
        pageSize = document.querySelector('sl-page-size') as PageSize,
        visibleItems = document.querySelector('sl-items-counter') as ItemsCounter;

      paginator?.addEventListener('sl-page-change', event => {
        visibleItems.activePage = event.detail;
      });

      pageSize?.addEventListener('sl-page-size-change', event => {
        paginator.itemsPerPage = event.detail;
        visibleItems.itemsPerPage = event.detail;
      });
    });
    return html`
      <style>
        .pagination {
          display: grid;
          grid-template-columns: 20% 50% 20%;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        sl-paginator {
          flex: 1;
        }

        sl-page-size {
          justify-content: end;
        }
      </style>
      <div class="pagination">
        <sl-items-counter .total=${total} .activePage=${activePage} .itemsPerPage=${itemsPerPage}></sl-items-counter>
        <sl-paginator
          .total=${total}
          .pageSizes=${pageSizes}
          .activePage=${activePage}
          .itemsPerPage=${itemsPerPage}
        ></sl-paginator>
        <sl-page-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-page-size>
      </div>
    `;
  }
};
