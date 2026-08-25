import { ArrayListDataSource } from '@sl-design-system/data-source';
import { html } from 'lit';
import '../register.js';
export default {
  title: 'Navigation/Paginator/Status',
  args: {
    totalItems: 100,
    pageSize: 10,
    page: 5
  },
  render: ({ itemLabel, pageSize, page, totalItems }) => {
    return html`
      <sl-paginator-status
        .itemLabel=${itemLabel}
        .page=${page}
        .pageSize=${pageSize}
        .totalItems=${totalItems}></sl-paginator-status>
    `;
  }
};
export const Basic = {};
export const DataSource = {
  render: () => {
    const dataSource = new ArrayListDataSource(
      [
        { nr: 1, title: 'test 1' },
        { nr: 2, title: 'test 2' },
        { nr: 3, title: 'test 3' },
        { nr: 4, title: 'test 4' },
        { nr: 5, title: 'test 5' },
        { nr: 6, title: 'test 6' },
        { nr: 7, title: 'test 7' },
        { nr: 8, title: 'test 8' },
        { nr: 9, title: 'test 9' },
        { nr: 10, title: 'test 10' }
      ],
      { pagination: true }
    );
    dataSource.setPage(1);
    dataSource.setPageSize(5);
    dataSource.update();
    return html`<sl-paginator-status .dataSource=${dataSource}></sl-paginator-status>`;
  }
};
export const CustomItemLabel = {
  args: {
    itemLabel: 'books'
  }
};
//# sourceMappingURL=status.stories.js.map
