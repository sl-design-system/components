---
title: Data source
description: Data sources provide a unified way to manage, filter, sort, group, paginate, and select data for components such as grid, combobox, and listbox.
layout: "categories/getting-started.njk"
eleventyNavigation:
  parent: Utilities
  key: Data source
---

<section>

## Overview

The data source package (`@sl-design-system/data-source`) provides a set of classes for managing collections of data. Instead of passing raw arrays directly to components, you wrap your data in a data source. This gives you a consistent API for filtering, sorting, grouping, pagination, and selection — all of which are automatically reflected in the consuming component.

The class hierarchy is:

- **`DataSource`** — Abstract base class defining the shared interface (filter, sort)
  - **`ListDataSource`** — Abstract class that adds grouping, pagination, selection, and reordering
    - **`ArrayListDataSource`** — Concrete implementation for in-memory arrays
    - **`FetchListDataSource`** — Concrete implementation for lazily-fetched / server-side data

</section>

<section>

## DataSource

`DataSource` is the abstract base class that all data sources extend. It extends `EventTarget`, so any component can listen for the `sl-update` event to react to changes. It defines the core contract:

| Member | Description |
| --- | --- |
| `filters` | A `Map` of active filters keyed by id |
| `items` | The filtered and sorted array of view models |
| `size` | The total number of items after filtering |
| `sort` | The current sort configuration (property path or function + direction) |
| `addFilter(id, by, value?)` | Add a filter by property path or custom function |
| `removeFilter(id)` | Remove a filter by its id |
| `setSort(by, direction)` | Set a sort by property path or custom function |
| `removeSort()` | Clear the current sort |
| `update()` | Recompute items and emit `sl-update` |

{.ds-table .ds-table-align-top}

You never instantiate `DataSource` directly — use one of the concrete subclasses instead.

</section>

<section>

## ListDataSource

`ListDataSource` extends `DataSource` and adds support for grouping, pagination, selection, and reordering. Like `DataSource`, it is abstract — you use `ArrayListDataSource` or `FetchListDataSource` instead.

### Grouping

Items can be grouped by a property path. Groups are represented as `ListDataSourceGroupItem` entries interleaved with `ListDataSourceDataItem` entries in the `items` array. Groups can be collapsed and expanded:

| Method | Description |
| --- | --- |
| `setGroupBy(path, labelPath?)` | Group items by a property path, with an optional label path |
| `removeGroupBy()` | Remove grouping |
| `expandGroup(id)` | Expand a collapsed group |
| `collapseGroup(id)` | Collapse a group |
| `toggleGroup(id, force?)` | Toggle a group's collapsed state |
| `isGroupCollapsed(id)` | Check whether a group is collapsed |

{.ds-table .ds-table-align-top}

### Pagination

When the `pagination` option is enabled, only a slice of items is returned based on the current page and page size. This affects the value of `size`, while `totalSize` continues to report the total number of items available for pagination:

| Method / Property | Description |
| --- | --- |
| `page` | The current page index (zero-based) |
| `pageSize` | The number of items per page (default: 10) |
| `pagination` | Whether pagination is enabled |
| `size` | The number of items currently exposed by the data source (e.g. the items on the current page after filtering/pagination) |
| `totalSize` | The total number of items in the data source after filtering but before pagination; use this for paginator/selection logic and page count calculations |
| `setPage(page)` | Navigate to a specific page |
| `setPageSize(pageSize)` | Change the number of items per page |

{.ds-table .ds-table-align-top}

When pagination is disabled, `size` and `totalSize` are equal. When pagination is enabled, `size` usually equals `pageSize` (except on the last page), while `totalSize` stays constant for the active filters and is what components such as paginators should rely on.
### Selection

Selection can be configured as `'single'` or `'multiple'` via the `selects` option. The data source tracks selection state and emits `sl-selection-change` events:

| Method / Property | Description |
| --- | --- |
| `selects` | The selection mode: `'single'`, `'multiple'`, or `undefined` |
| `selected` | The number of currently selected items |
| `selection` | The set of selected (or deselected) item ids |
| `select(item)` | Select an item |
| `deselect(item)` | Deselect an item |
| `toggle(item, force?)` | Toggle selection state |
| `isSelected(item)` | Check whether an item is selected |
| `selectAll()` | Select all items (multiple mode only) |
| `deselectAll()` | Deselect all items |
| `areAllSelected()` | Whether all items are selected |
| `areSomeSelected()` | Whether some (but not all) items are selected |

{.ds-table .ds-table-align-top}

### Options

The `ListDataSourceOptions` object accepted by subclass constructors supports the following settings:

| Option | Description |
| --- | --- |
| `filters` | Initial set of filters |
| `groupBy` | Property path for grouping |
| `groupLabelPath` | Property path for the group label |
| `groupSortBy` | Custom sort function for groups |
| `groupSortDirection` | Sort direction for groups (`'asc'` or `'desc'`) |
| `pagination` | Enable pagination |
| `page` | Initial page number |
| `pageSize` | Items per page |
| `selects` | Selection mode (`'single'` or `'multiple'`) |
| `sortBy` | Initial sort property path or function |
| `sortDirection` | Initial sort direction |
| `getId(item)` | Return a unique id for an item |
| `getGroupId(item)` | Return the group id for an item |
| `isSelected(item)` | Return the initial selected state of an item |

{.ds-table .ds-table-align-top}

</section>

<section>

## ArrayListDataSource

`ArrayListDataSource` is the concrete data source for in-memory data. Provide it with a plain array and it handles filtering, sorting, grouping, and pagination entirely on the client side.

### Usage

```ts
import { ArrayListDataSource } from '@sl-design-system/data-source';

interface Person {
  name: string;
  age: number;
  department: string;
}

const people: Person[] = [
  { name: 'Alice', age: 30, department: 'Engineering' },
  { name: 'Bob', age: 25, department: 'Design' },
  { name: 'Carol', age: 35, department: 'Engineering' }
];

const ds = new ArrayListDataSource(people, {
  sortBy: 'name',
  sortDirection: 'asc'
});

// Access the processed items
console.log(ds.items);
```

### Updating data

Use `setData(items)` to replace the entire dataset. Existing selections are cleaned up to remove ids that no longer exist in the new data:

```ts
ds.setData(newPeople);
ds.update();
```

### Filtering

Add filters by property path or with a custom function:

```ts
// Filter by property value
ds.addFilter('dept', 'department', 'Engineering');

// Filter with a custom function
ds.addFilter('senior', (person) => person.age >= 30, true);

ds.update();

// Remove a filter
ds.removeFilter('dept');
ds.update();
```

### Sorting

Sort by a property path or a custom comparator:

```ts
ds.setSort('age', 'desc');
ds.update();
```

### Grouping

Group items by a property path:

```ts
const ds = new ArrayListDataSource(people, {
  groupBy: 'department'
});
```

### Reordering

`ArrayListDataSource` supports reordering items in the list:

```ts
const item = ds.items[2];
const target = ds.items[0];

ds.reorder(item, target, 'before');
```

### Getting selected items

Use `getSelectedItems()` to retrieve the raw data objects of all currently selected items:

```ts
const ds = new ArrayListDataSource(people, { selects: 'multiple' });

ds.select(ds.items.at(0)!);
ds.select(ds.items.at(2)!);

const selected = ds.getSelectedItems(); // [people[0], people[2]]
```

</section>

<section>

## FetchListDataSource

`FetchListDataSource` is the concrete data source for remote or lazily-loaded data. Instead of providing all items up front, you supply a `fetchPage` callback that is invoked on demand — for example when the user scrolls or navigates to a new page.

### Usage

```ts
import { FetchListDataSource } from '@sl-design-system/data-source';

const ds = new FetchListDataSource({
  pageSize: 20,
  fetchPage: async ({ page, pageSize, sort }) => {
    const response = await fetch(
      `/api/people?page=${page}&size=${pageSize}`
    );
    const json = await response.json();

    return {
      items: json.data,
      totalItems: json.total
    };
  }
});
```

### How it works

- **Lazy loading**: Items are not fetched until they are accessed (via the Proxy-based `items` array). Accessing an index triggers a page fetch automatically.
- **Placeholders**: While a page is loading, placeholder items are returned. Components can check for the `ListDataSourcePlaceholder` symbol to render loading indicators.
- **Page caching**: Each page is fetched only once. Calling `update()` resets the cache so the next access re-fetches data.

### Groups

You can provide an explicit list of groups. Groups are collapsed by default and their items are fetched on demand when expanded:

```ts
const ds = new FetchListDataSource({
  pageSize: 10,
  groups: [
    { id: 'eng', label: 'Engineering', size: 50 },
    { id: 'design', label: 'Design', size: 20 }
  ],
  fetchPage: async ({ group, page, pageSize }) => {
    const response = await fetch(
      `/api/people?dept=${group}&page=${page}&size=${pageSize}`
    );
    const json = await response.json();

    return { items: json.data, totalItems: json.total };
  }
});
```

### Custom fetch options

Override `getFetchOptions()` in a subclass to pass additional parameters (such as filters) to your API:

```ts
class MyDataSource extends FetchListDataSource<Person> {
  getFetchOptions(group, page, pageSize) {
    return {
      ...super.getFetchOptions(group, page, pageSize),
      search: this.searchTerm
    };
  }
}
```

</section>

<section>

## Using with components

A data source is passed to a component as a JavaScript property — not as an HTML attribute. In Lit templates, use the dot-prefix (`.dataSource`) to bind the property:

```ts
html`<sl-grid .dataSource=${dataSource}></sl-grid>`
```

In Angular templates:

```html
<sl-grid [dataSource]="dataSource"></sl-grid>
```

Or set it imperatively:

```ts
const grid = document.querySelector('sl-grid');
grid.dataSource = dataSource;
```

### Grid

The grid is the primary consumer of data sources. It supports both `ArrayListDataSource` and `FetchListDataSource`. You can also pass a plain `items` array, in which case the grid will create an `ArrayListDataSource` for you internally.

```ts
import { ArrayListDataSource } from '@sl-design-system/data-source';

const ds = new ArrayListDataSource(people, {
  pagination: true,
  pageSize: 10,
  sortBy: 'name'
});

return html`
  <sl-grid .dataSource=${ds}>
    <sl-grid-column path="name"></sl-grid-column>
    <sl-grid-column path="age"></sl-grid-column>
    <sl-grid-column path="department"></sl-grid-column>
  </sl-grid>
`;
```

Operations performed on the data source — such as filtering, sorting, or pagination — are automatically reflected in the grid.

### Grid with remote data

For server-side data, use `FetchListDataSource`. The grid will trigger page fetches automatically as the user scrolls or navigates:

```ts
import {
  FetchListDataSource,
  FetchListDataSourceError
} from '@sl-design-system/data-source';

const ds = new FetchListDataSource({
  pageSize: 10,
  pagination: true,
  fetchPage: async ({ page, pageSize }) => {
    const response = await fetch(
      `/api/people?page=${page}&size=${pageSize}`
    );

    if (!response.ok) {
      throw new FetchListDataSourceError('Failed to fetch', response);
    }

    const { data, total } = await response.json();
    return { items: data, totalItems: total };
  }
});

return html`
  <sl-grid .dataSource=${ds}>
    <sl-grid-column path="name"></sl-grid-column>
    <sl-grid-column path="department"></sl-grid-column>
  </sl-grid>
`;
```

### Paginator

The paginator component shares the same data source as the grid. Pass the same instance to both so the paginator can control pagination:

```ts
return html`
  <sl-grid .dataSource=${ds}>
    <sl-grid-column path="name"></sl-grid-column>
  </sl-grid>
  <sl-paginator .dataSource=${ds}></sl-paginator>
`;
```

### Tree

The tree component uses its own data source types — `FlatTreeDataSource` and `NestedTreeDataSource` — which are separate from the list data sources documented above. See the tree component documentation for details.

</section>

<section>

## Events

Data sources emit the following events:

| Event | Description |
| --- | --- |
| `sl-update` | Fired after `update()` completes. The detail contains a reference to the data source. |
| `sl-selection-change` | Fired when the selection changes (select, deselect, toggle, selectAll, deselectAll). |

{.ds-table .ds-table-align-top}

</section>

<section>

## Utility types and functions

The package exports several helper types and functions:

| Export | Description |
| --- | --- |
| `ListDataSourceDataItem<T>` | A data item wrapper with `id`, `data`, selection state, and optional group reference |
| `ListDataSourceGroupItem<T>` | A group item with `id`, `label`, `members`, and aggregated selection state |
| `isListDataSourceDataItem(item)` | Type guard for narrowing to `ListDataSourceDataItem` |
| `isListDataSourceGroupItem(item)` | Type guard for narrowing to `ListDataSourceGroupItem` |
| `ListDataSourcePlaceholder` | Symbol used as a placeholder for items that are being loaded |

{.ds-table .ds-table-align-top}

</section>
