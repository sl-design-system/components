import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource, FetchListDataSource, FetchListDataSourceError } from '@sl-design-system/data-source';
import { type Person, getPeople } from '@sl-design-system/example-data';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { avatarRenderer } from './story-utils.js';

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

      if (typeof pageSize === 'number' && pageSize !== paginator.pageSize) {
        page = 0;
      } else {
        page ??= paginator.page;
      }

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
  name: 'Array Data Source',
  render: (_, { loaded: { people } }) => {
    const ds = new ArrayListDataSource(people as Person[], { pagination: true });
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
          justify-content: center;
        }
      </style>
      <sl-grid .dataSource=${ds}>
        <sl-grid-filter-column
          direction="desc"
          .filter=${(item: Person, value: string | string[] | undefined) => {
            if (!value) {
              return true;
            }

            const values = Array.isArray(value) ? value : [value];
            return values.every(v => {
              const regex = new RegExp(v, 'i');
              return item.firstName.match(regex) || item.lastName.match(regex);
            });
          }}
          header="Name"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
          .sorter=${(a: Person, b: Person) => {
            const result = a.lastName.localeCompare(b.lastName);
            return result !== 0 ? result : a.firstName.localeCompare(b.firstName);
          }}
        ></sl-grid-filter-column>
        <sl-grid-filter-column path="profession"></sl-grid-filter-column>
        <sl-grid-filter-column mode="select" path="status"></sl-grid-filter-column>
        <sl-grid-filter-column mode="select" path="membership"></sl-grid-filter-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .dataSource=${ds}></sl-paginator-status>
        <sl-paginator .dataSource=${ds}></sl-paginator>
        <sl-paginator-page-size .dataSource=${ds} page-sizes="[5,10,15,20]"></sl-paginator-page-size>
      </div>
    `;
  }
};

export const DataSource2: Story = {
  name: 'Fetch Data Source',
  loaders: [],
  render: () => {
    interface Quote {
      id: string;
      quote: string;
      author: string;
    }

    interface QuotesResponse {
      quotes: Quote[];
      total: number;
      skip: number;
      limit: number;
    }

    const ds = new FetchListDataSource<Quote>({
      pageSize: 10,
      pagination: true,
      fetchPage: async ({ page, pageSize }) => {
        const response = await fetch(`https://dummyjson.com/quotes?skip=${page * pageSize}&limit=${pageSize}`);

        if (response.ok) {
          const { quotes, total } = (await response.json()) as QuotesResponse;

          return { items: quotes, totalItems: total };
        } else {
          throw new FetchListDataSourceError('Failed to fetch data', response);
        }
      }
    });
    ds.setPage(2);
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
          justify-content: center;
        }
      </style>
      <sl-grid .dataSource=${ds}>
        <sl-grid-column path="id" grow="0" width="50"></sl-grid-column>
        <sl-grid-column path="quote" grow="3"></sl-grid-column>
        <sl-grid-column path="author"></sl-grid-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .dataSource=${ds}></sl-paginator-status>
        <sl-paginator .dataSource=${ds}></sl-paginator>
        <sl-paginator-page-size .dataSource=${ds} page-sizes="[5,10,15,20]"></sl-paginator-page-size>
      </div>
    `;
  }
};
