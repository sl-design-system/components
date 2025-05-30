import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource, FetchListDataSource, FetchListDataSourceError } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../register.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Pagination',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { students } }) => {
    const ds = new ArrayListDataSource(students as Student[], {
      pagination: true,
      page: 2,
      pageSize: 10,
      sortBy: 'fullName'
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
          justify-content: center;
        }
      </style>
      <p>
        This is an example of how to paginate data in a grid. It uses the <code>ArrayListDataSource</code> with the
        <code>pagination</code> option enabled. You can change the page it starts on by setting the
        <code>page</code> option. The page size can be changed by setting the <code>pageSize</code> option.
      </p>
      <sl-grid .dataSource=${ds}>
        <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column ellipsize-text header="School" path="school.name"></sl-grid-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .dataSource=${ds}></sl-paginator-status>
        <sl-paginator .dataSource=${ds}></sl-paginator>
        <sl-paginator-page-size .dataSource=${ds} page-sizes="[5,10,15,20]"></sl-paginator-page-size>
      </div>
    `;
  }
};

export const Filtering: Story = {
  render: (_, { loaded: { students } }) => {
    const ds = new ArrayListDataSource(students as Student[], {
      filters: [
        {
          id: 'filter-school',
          by: 'school.id',
          value: 'school-1'
        }
      ],
      pagination: true,
      page: 2,
      pageSize: 10
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
          justify-content: center;
        }
      </style>
      <p>
        This example shows you can combine filtering with pagination. The <code>sl-paginator-status</code> component
        will always reflect the filtered size of the data source, not the total number of items in the data source.
      </p>
      <sl-grid .dataSource=${ds}>
        <sl-grid-filter-column
          direction="asc"
          grow="3"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-filter-column>
        <sl-grid-filter-column
          id="filter-school"
          header="School"
          label-path="school.name"
          mode="select"
          path="school.id"
        ></sl-grid-filter-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .dataSource=${ds}></sl-paginator-status>
        <sl-paginator .dataSource=${ds}></sl-paginator>
        <sl-paginator-page-size .dataSource=${ds} page-sizes="[5,10,15,20]"></sl-paginator-page-size>
      </div>
    `;
  }
};

export const LazyLoad: Story = {
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
      <p>
        This example shows how you can combine <code>FetchListDataSource</code> with pagination to lazy load data when
        you change pages. You should try to make sure the <code>pageSize</code> in the grid is the same as the batch
        size from the remote endpoint. That way each page will only need 1 endpoint call. It uses data from
        <a href="https://dummyjson.com" target="_blank">https://dummyjson.com</a>.
      </p>
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

export const Manual: Story = {
  render: (_, { loaded: { students } }) => {
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
        endIndex = Math.min(startIndex + pageSize, (students as Student[]).length - 1);

      grid.items = (students as Student[]).slice(startIndex, endIndex);
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
          justify-content: center;
        }
      </style>
      <p>
        This example shows how you can manually paginate the data in the grid, without using a data source. This is not
        really meant to be used as an example. It's a more proof of what is technically possible.
      </p>
      <sl-grid .items=${(students as Student[]).slice(0, 10)}>
        <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
        <sl-grid-column
          grow="3"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column ellipsize-text header="School" path="school.name"></sl-grid-column>
      </sl-grid>
      <div class="pagination">
        <sl-paginator-status .totalItems=${(students as Student[]).length}></sl-paginator-status>
        <sl-paginator @sl-page-change=${onPageChange} .totalItems=${(students as Student[]).length}></sl-paginator>
        <sl-paginator-page-size
          @sl-page-size-change=${onPageSizeChange}
          page-size="10"
          page-sizes="[5,10,15]"
        ></sl-paginator-page-size>
      </div>
    `;
  }
};
