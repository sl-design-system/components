import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Paginator } from './paginator.js';
import { type PageSize } from './page-size.js';

type Props = Pick<Paginator,  'itemsPerPage' | 'pageSizes' | 'total'> & {
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
    pageSizes: [5, 10, 15]
  },
  argTypes: {
    actions: {
      table: { disable: true }
    },
    content: {
      table: { disable: true }
    }
  },
  render: ({ pageSizes, total }) => { // itemsPerPage
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator;
      const pageSize = document.querySelector('sl-page-size') as PageSize;
      console.log('paginator story', paginator, 'pageSize', pageSize, pageSize.itemsPerPage);
      paginator.itemsPerPage = pageSize.itemsPerPage;
      paginator?.addEventListener('sl-page-change', event => {
        console.log('sl-page-change event', event, event.detail);
        pageSize.activePage = event.detail;
        // onTabChange();
        //
        // selectedTabIndex = event.detail;
      });
    }); // .itemsPerPage=${itemsPerPage}
    return html`
      <sl-paginator .total=${total} .pageSizes=${pageSizes}></sl-paginator>
      <sl-page-size .pageSizes=${pageSizes}></sl-page-size>
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
