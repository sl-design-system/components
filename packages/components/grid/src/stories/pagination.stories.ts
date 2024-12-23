import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { ArrayDataSource } from '@sl-design-system/data-source';
import { type Person, getPeople } from '@sl-design-system/example-data';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';

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
    const people2 = people as Person[];

    const update = ({ page, pageSize }: { page?: number; pageSize?: number }) => {
      const grid = document.querySelector('sl-grid')!,
        paginator = document.querySelector('sl-paginator')!,
        size = document.querySelector('sl-paginator-page-size')!,
        status = document.querySelector('sl-paginator-status')!;

      page ??= paginator.page;
      pageSize ??= paginator.pageSize;

      paginator.page = status.page = page;
      paginator.pageSize = size.pageSize = status.pageSize = pageSize;

      const startIndex = page * pageSize,
        endIndex = Math.min(startIndex + pageSize, people2.length - 1);

      grid.items = people2.slice(startIndex, endIndex);
    };

    const onPageChange = ({ detail: page }: SlChangeEvent<number>) => update({ page }),
      onPageSizeChange = ({ detail: pageSize }: SlChangeEvent<number>) => update({ pageSize });

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
      <sl-grid .items=${people2.slice(0, 10)}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
        <sl-grid-column path="status"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .totalItems=${people2.length}></sl-paginator-status>
        <sl-paginator @sl-page-change=${onPageChange} .totalItems=${people2.length}></sl-paginator>
        <sl-paginator-page-size
          @sl-page-size-change=${onPageSizeChange}
          page-sizes="[5,10,15]"
        ></sl-paginator-page-size>
      </div>
    `;
  }
};

export const DataSource: Story = {
  render: (_, { loaded: { people } }) => {
    const ds = new ArrayDataSource(people as Person[]);
    ds.setPage(2);
    ds.setPageSize(10);
    ds.update();

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
      <sl-grid .dataSource=${ds}>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName" direction="desc"></sl-grid-sort-column>
        <sl-grid-filter-column id="filter-profession" mode="text" path="profession"></sl-grid-filter-column>
        <sl-grid-filter-column id="filter-status" path="status"></sl-grid-filter-column>
        <sl-grid-filter-column id="filter-membership" path="membership"></sl-grid-filter-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .dataSource=${ds}></sl-paginator-status>
        <sl-paginator .dataSource=${ds}></sl-paginator>
        <sl-paginator-page-size .dataSource=${ds} page-sizes="[5,10,15,20]"></sl-paginator-page-size>
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
    dataSource.setPage(3);
    dataSource.setPageSize(10);
    dataSource.setSort('custom', sorter, 'asc');
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
        <sl-paginator .dataSource=${dataSource}></sl-paginator>
        <sl-paginator-page-size .dataSource=${dataSource} .pageSizes=${[10, 15, 20]}></sl-paginator-page-size>
      </div>
    `;
  }
};
