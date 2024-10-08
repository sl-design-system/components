import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { ArrayDataSource } from '@sl-design-system/data-source';
import {PageSize, Paginator, ItemsCounter} from "@sl-design-system/paginator";
import '@sl-design-system/paginator/register.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { Grid } from '../grid.js';

type Story = StoryObj;

export default {
  title: 'Grid/Pagination',
  tags: ['draft'],
  loaders: [async () => ({ people: (await getPeople()).people })],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { people } }) => {
    const pageSizes = [5, 10, 15];
    let activePage = 1,
     itemsPerPage = pageSizes[1],
     startIndex = (activePage - 1) * itemsPerPage,
     endIndex = startIndex + itemsPerPage;

    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
       pageSize = document.querySelector('sl-page-size') as PageSize,
       visibleItems = document.querySelector('sl-items-counter') as ItemsCounter,
       grid = document.querySelector('sl-grid') as Grid;

      paginator?.addEventListener('sl-page-change', event => {
        visibleItems.activePage = event.detail;
        activePage = event.detail;
        startIndex = (event.detail - 1) * itemsPerPage;
        endIndex = startIndex + itemsPerPage;
        grid.items = people.slice(startIndex, endIndex);
      });

      pageSize?.addEventListener('sl-page-size-change', event => {
        paginator.itemsPerPage = event.detail;
        visibleItems.itemsPerPage = event.detail;
        itemsPerPage = event.detail;
      });
    });

    return html`
      <style>
        .pagination {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-block: 1rem;
          justify-content: space-between;
        }

        sl-paginator {
          flex: 1;
        }
      </style>
      <sl-grid .items=${people.slice(startIndex, endIndex)}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
        <sl-grid-column path="status"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
      <div class="pagination">
        <sl-items-counter .total=${people.length} .activePage=${activePage} .itemsPerPage=${itemsPerPage}></sl-items-counter>
        <sl-paginator .total=${people.length} .pageSizes=${pageSizes} .activePage=${activePage}
                      .itemsPerPage=${itemsPerPage}></sl-paginator>
        <sl-page-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-page-size>
      </div>
    `
  }
};

export const PaginatedDataSourceWithFilter: Story = {
  render: (_, { loaded: { people } }) => {
    const pageSizes = [5, 10, 15, 20],
     dataSource = new ArrayDataSource(people as Person[]);

    let total = dataSource.paginatedItems.length;
    dataSource.paginate(1, 10);

    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
       pageSize = document.querySelector('sl-page-size') as PageSize,
       visibleItems = document.querySelector('sl-items-counter') as ItemsCounter,
       grid = document.querySelector('sl-grid') as Grid;

      paginator?.addEventListener('sl-page-change', event => {
        dataSource.paginate(event.detail, paginator.itemsPerPage ?? pageSizes[0]);
        visibleItems.activePage = event.detail;
      });

      pageSize?.addEventListener('sl-page-size-change', event => {
        paginator.itemsPerPage = event.detail;
        visibleItems.itemsPerPage = event.detail;
        dataSource.paginate(paginator.activePage, event.detail);
      });

      dataSource?.addEventListener('sl-update', () => {
        paginator.total = dataSource.paginatedItems.length;
        visibleItems.total = dataSource.paginatedItems.length;
      });

      grid?.addEventListener('sl-filter-value-change', () => {
        // go back to the first page on filter change
        paginator.activePage = 1;
      });
    });

    return html`
      <style>
        .pagination {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-block: 1rem;
          justify-content: space-between;
        }

        sl-paginator {
          flex: 1;
        }
      </style>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-filter-column id="filter-profession" mode="text" path="profession"></sl-grid-filter-column>
        <sl-grid-filter-column id="filter-status" path="status"></sl-grid-filter-column>
        <sl-grid-filter-column id="filter-membership" path="membership"></sl-grid-filter-column>
      </sl-grid>
      <div class="pagination">
        <sl-items-counter .total=${total} .activePage=${1} .itemsPerPage=${10}></sl-items-counter>
        <sl-paginator .total=${total} .pageSizes=${pageSizes} .activePage=${1} .itemsPerPage=${10}></sl-paginator>
        <sl-page-size .pageSizes=${pageSizes} .itemsPerPage=${10}></sl-page-size>
      </div>
    `;
  }
};

export const PaginatedDataSourceWithSorter: Story = {
  render: (_, { loaded: { people } }) => {
    const sorter = (a: Person, b: Person): number => {
      const lastNameCmp = a.lastName.localeCompare(b.lastName);

      if (lastNameCmp === 0) {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return lastNameCmp;
      }
    };

    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setSort('custom', sorter, 'asc');

    const pageSizes = [10, 15, 20];
    let total = dataSource.paginatedItems.length;
    dataSource.paginate(1, 10);

    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
       pageSize = document.querySelector('sl-page-size') as PageSize,
       visibleItems = document.querySelector('sl-items-counter') as ItemsCounter,
       grid = document.querySelector('sl-grid') as Grid;

      paginator?.addEventListener('sl-page-change', event => {
        dataSource.paginate(event.detail, paginator.itemsPerPage ?? pageSizes[0]);
        visibleItems.activePage = event.detail;
      });

      pageSize?.addEventListener('sl-page-size-change', event => {
        paginator.itemsPerPage = event.detail;
        visibleItems.itemsPerPage = event.detail;
        dataSource.paginate(paginator.activePage, event.detail);
      });

      dataSource?.addEventListener('sl-update', () => {
        paginator.total = dataSource.paginatedItems.length;
        visibleItems.total = dataSource.paginatedItems.length;
      });

      grid?.addEventListener('sl-sort-direction-change', () => {
        // go back to the first page on filter change
        paginator.activePage = 1;
      });
    });

    return html`
          <style>
        .pagination {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-block: 1rem;
          justify-content: space-between;
        }

        sl-paginator {
          flex: 1;
        }
      </style>
      <p>This grid sorts people by last name, then first name, via a custom sorter on the data directly.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
      <div class="pagination">
        <sl-items-counter .total=${total} .activePage=${1} .itemsPerPage=${10}></sl-items-counter>
        <sl-paginator .total=${total} .pageSizes=${pageSizes} .activePage=${1} .itemsPerPage=${10}></sl-paginator>
        <sl-page-size .pageSizes=${pageSizes} .itemsPerPage=${10}></sl-page-size>
      </div>
    `;
  }
};


