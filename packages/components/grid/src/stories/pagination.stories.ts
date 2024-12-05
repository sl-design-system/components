import '@sl-design-system/announcer/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { ArrayDataSource } from '@sl-design-system/data-source';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { Paginator, PaginatorSize, PaginatorStatus } from '@sl-design-system/paginator';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { Grid } from '../grid.js';

type Story = StoryObj;

export default {
  title: 'Grid/Pagination',
  tags: ['draft'],
  loaders: [async () => ({ people: (await getPeople()).people as unknown[] })],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { people } }) => {
    const people2 = people as unknown[];
    const pageSizes = [5, 10, 15];
    let page = 1,
      pageSize = pageSizes[1],
      startIndex = (page - 1) * pageSize,
      endIndex = startIndex + pageSize;

    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
        paginatorSize = document.querySelector('sl-paginator-size') as PaginatorSize,
        visibleItems = document.querySelector('sl-paginator-status') as PaginatorStatus,
        grid = document.querySelector('sl-grid') as Grid;

      paginator?.addEventListener('sl-page-change', (event: SlChangeEvent) => {
        const detail = event.detail as number;
        visibleItems.page = detail;
        page = detail;
        startIndex = (detail - 1) * pageSize;
        endIndex = startIndex + pageSize;
        grid.items = people2.slice(startIndex, endIndex);
      });

      paginatorSize?.addEventListener('sl-page-size-change', (event: SlChangeEvent) => {
        const detail = event.detail as number;
        paginator.pageSize = detail;
        visibleItems.pageSize = detail;
        pageSize = detail;
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
      <sl-grid .items=${people2.slice(startIndex, endIndex)}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
        <sl-grid-column path="status"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .totalItems=${people2.length} .page=${page} .pageSize=${pageSize}></sl-paginator-status>
        <sl-paginator
          .totalItems=${people2.length}
          .pageSizes=${pageSizes}
          .page=${page}
          .pageSize=${pageSize}
        ></sl-paginator>
        <sl-paginator-size .pageSizes=${pageSizes} .pageSize=${pageSize}></sl-paginator-size>
      </div>
    `;
  }
};

export const PaginatedDataSourceWithFilter: Story = {
  render: (_, { loaded: { people } }) => {
    const pageSizes = [5, 10, 15, 20],
      dataSource = new ArrayDataSource(people as Person[]);

    const total = dataSource.items.length;
    dataSource.paginate(2, 15, total);
    dataSource.update();

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
        <sl-paginator-status .dataSource=${dataSource}></sl-paginator-status>
        <sl-paginator .dataSource=${dataSource} .pageSizes=${pageSizes}></sl-paginator>
        <sl-paginator-size .dataSource=${dataSource} .pageSizes=${pageSizes}></sl-paginator-size>
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
    const total = dataSource.items.length;
    dataSource.paginate(3, 10, total);
    dataSource.update();

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
        <sl-paginator-status .dataSource=${dataSource}></sl-paginator-status>
        <sl-paginator .dataSource=${dataSource} .pageSizes=${pageSizes}></sl-paginator>
        <sl-paginator-size .dataSource=${dataSource} .pageSizes=${pageSizes}></sl-paginator-size>
      </div>
    `;
  }
};
