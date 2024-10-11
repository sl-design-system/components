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
    total: 52,
    itemsPerPage: 15,
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
    // itemsPerPage
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator;
      const pageSize = document.querySelector('sl-page-size') as PageSize;
      const visibleItems = document.querySelector('sl-items-counter') as ItemsCounter;
      console.log('paginator story', paginator, 'pageSize', pageSize, pageSize.itemsPerPage);
      // paginator.itemsPerPage = pageSize.itemsPerPage;
      paginator?.addEventListener('sl-page-change', event => {
        console.log('sl-page-change event', event, event.detail);
        // pageSize.activePage = event.detail;
        visibleItems.activePage = event.detail;
        // visibleItems.requestUpdate();
        //
        // selectedTabIndex = event.detail;
      });
      pageSize?.addEventListener('sl-page-size-change', event => {
        console.log('sl-page-size-change event', event, event.detail);
        paginator.itemsPerPage = event.detail;
        visibleItems.itemsPerPage = event.detail;
        // paginator.requestUpdate();
        //
        // selectedTabIndex = event.detail;
      });
    }); // .itemsPerPage=${itemsPerPage}
    return html`
      <sl-paginator
        .total=${total}
        .pageSizes=${pageSizes}
        .activePage=${activePage}
        .itemsPerPage=${itemsPerPage}
      ></sl-paginator>
      <sl-page-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-page-size>
      <sl-items-counter .total=${total} .activePage=${activePage} .itemsPerPage=${itemsPerPage}></sl-items-counter>
    `;
  }
} satisfies Meta<Props>;

// TODO: is slot necessary?

// <h2>With links</h2>
// <sl-paginator .total=${total} .itemsPerPage=${itemsPerPage} .pageSizes=${pageSizes} .links=${['javascript:void(0)', 'javascript:void(0)', 'javascript:void(0)', 'javascript:void(0)', 'javascript:void(0)', 'javascript:void(0)']}></sl-paginator>

export const Basic: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<p>Panel content</p>`
  }
};

export const Overflow: Story = {
  args: {
    ...Basic.args,
    total: 1000
  }
};

// TODO: Mobile
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

export const ItemsPerPage: Story = {
  args: {
    ...Basic.args,
    total: 100
  },
  render: ({ pageSizes, itemsPerPage }) => {
    let pageSize = document.querySelector('sl-page-size') as PageSize;
    setTimeout(() => {
      pageSize = document.querySelector('sl-page-size') as PageSize;

      pageSize?.addEventListener('sl-page-size-change', event => {
        console.log('sl-page-size-change event', event, event.detail);
        itemsPerPage = event.detail;
        const pEl = document.querySelector('p.info');
        console.log('pEl', pEl);
      });
    });
    return html`
      <style>
        #root-inner {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      </style>
      <h2>TODO...</h2>
      <sl-page-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-page-size>
      <p class="info">There will be shown ${itemsPerPage} items per page. ${pageSize?.itemsPerPage}</p>
    `;
  }
};

export const VisibleItemsAmount: Story = {
  render: () => html`
    <style>
      #root-inner {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    </style>
    <h2>TODO...</h2>
  `
};

// export const Links: Story = {
//   args: {
//     ...Basic.args,
//     total: 100
//   }
// };

// export const LinksSlotted: Story = {
//   args: {
//     total: 52,
//     itemsPerPage: 15,
//     pageSizes: [5, 10, 15]
//   },
//   argTypes: {
//     actions: {
//       table: { disable: true }
//     },
//     content: {
//       table: { disable: true }
//     }
//   },
//   render: ({total, itemsPerPage, pageSizes}) => html`
//     <style>
//       #root-inner {
//         display: flex;
//         flex-direction: column;
//         gap: 1rem;
//       }
//     </style>
//     <sl-paginator .total=${total} .itemsPerPage=${itemsPerPage} .pageSizes=${pageSizes}>
//       <a href="javascript:void(0)">1</a>
//       <a href="javascript:void(0)" class="active">2</a>
//       <a href="javascript:void(0)">3</a>
//     </sl-paginator>
//   `
// };

export const ExampleWithCards: Story = {
  render: () => {
    // setTimeout(() => {
    const total = 100;
    const pageSizes = [5, 10, 15];
    const itemsPerPage = 10;
    const activePage = 2;
    let items: TemplateResult[] = [];
    let start = 1;
    let end = 1;
    let currentlyVisibleItems = 15;

    const pages = Math.ceil(total / itemsPerPage) || 2;

    if (activePage === pages) {
      console.log('last page is active');
      currentlyVisibleItems = total % itemsPerPage;
    } else {
      currentlyVisibleItems = itemsPerPage;
    }

    start = activePage === 1 ? 0 : (activePage - 1) * itemsPerPage;
    end = activePage === pages ? total : activePage * currentlyVisibleItems;

    console.log(
      '1in example start and end',
      start,
      end,
      Array.from({ length: total })
        .slice(start, end)
        .map((_, index) => index)
    );

    items = Array.from({ length: total }).map(
      // TODO: slice the array
      (_, index) => html`
        <sl-card responsive padding>
          <h2>Card number ${index + 1}</h2>
          <p slot="body">Example body text</p>
        </sl-card>
      `
    );

    // items.slice(start, end);

    requestAnimationFrame(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator;
      console.log('paginator in example cards', paginator, paginator?.activePage);

      // TODO: use itemsPerPage and activePage
      items = Array.from({ length: total }).map(
        // TODO: slice the array
        (_, index) => html`
          <sl-card responsive padding>
            <h2>Card number ${index + 1}</h2>
            <p slot="body">Example body text</p>
          </sl-card>
        `
      );

      const pages = Math.ceil(total / itemsPerPage) || 2;

      // TODO: use paginator activePage and so on
      start = paginator.activePage === 1 ? 1 : (paginator.activePage - 1) * itemsPerPage + 1;
      end = paginator.activePage === pages ? total : paginator.activePage * paginator.currentlyVisibleItems;

      console.log('in example start and end', start, end);

      paginator?.addEventListener('sl-page-change', event => {
        console.log('sl-page-change event', event, event.detail);

        start = event.detail === 1 ? 0 : (event.detail - 1) * itemsPerPage;
        end = event.detail === pages ? total : event.detail * currentlyVisibleItems;

        const toRemove = document.querySelector('.results')?.children;

        console.log('in example start and end on page change', start, end, items.slice(start, end), toRemove);

        // toRemove?.remove();
        // document drop and appendchild with new items?

        // TODO: request update??
      });
    });

    // TODO: use paginator activePage and so on
    // const start = this.activePage === 1 ? 1 : ((this.activePage - 1) * itemsPerPage) + 1;
    // const end = this.activePage === this.#pages ? this.total : this.activePage * this.currentlyVisibleItems;

    /*      // TODO: use itemsPerPage and activePage
      const items = Array.from({length: total}).map( // TODO: slice the array
        (_, index) => html`
          <sl-card responsive padding>
            <h2>Card number ${index + 1}</h2>
            <p slot="body">Example body text</p>
          </sl-card>
        `
      );*/
    // });

    console.log('items and sliced', items, items.slice(start, end));

    return html`
      <style>
        #root-inner {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .results {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
      </style>
      <h2>Paginator with example content</h2>
      <div class="results">start: ${start} end: ${end} ${items.slice(start, end)}</div>
      <sl-card responsive padding>
        <h2>Captivating Nyhavn Moments</h2>
        <p slot="body">Example body text</p>
      </sl-card>
      <sl-paginator .activePage=${activePage} .total=${total} .pageSizes=${pageSizes}></sl-paginator>
    `;
  }
};

export const All: Story = {
  render: () => html`
    <style>
      #root-inner {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    </style>
    <h2>TODO...</h2>
  `
};

// TODO: example with cards

// TODO: example with grid and dataSource
