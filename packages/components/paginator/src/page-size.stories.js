import { ArrayListDataSource } from '@sl-design-system/data-source';
import { html } from 'lit';
import '../register.js';
export default {
  title: 'Navigation/Paginator/Page size',
  args: {
    pageSize: 10,
    pageSizes: [5, 10, 15]
  },
  render: ({ itemLabel, pageSize, pageSizes }) => {
    return html`
      <sl-paginator-page-size
        .itemLabel=${itemLabel}
        .pageSize=${pageSize}
        .pageSizes=${pageSizes}></sl-paginator-page-size>
    `;
  }
};
export const Basic = {};
export const DataSource = {
  render: () => {
    const items = Array.from({ length: 80 }, (_, index) => ({ nr: index + 1 })),
      pageSizes = [5, 10, 15, 20, 25, 30];
    const dataSource = new ArrayListDataSource(items, { pagination: true });
    dataSource.setPage(2);
    dataSource.setPageSize(5);
    dataSource.update();
    return html`
      <sl-paginator-page-size
        .dataSource=${dataSource}
        .pageSizes=${pageSizes}></sl-paginator-page-size>
    `;
  }
};
export const CustomItemLabel = {
  args: {
    itemLabel: 'Students'
  }
};
//# sourceMappingURL=page-size.stories.js.map
