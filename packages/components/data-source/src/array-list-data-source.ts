import { type PathKeys, getStringByPath, getValueByPath } from '@sl-design-system/shared';
import {
  type DataSourceFilterByFunction,
  type DataSourceFilterByPath,
  type DataSourceSortFunction
} from './data-source.js';
import {
  ListDataSource,
  type ListDataSourceDataItem,
  type ListDataSourceGroupItem,
  type ListDataSourceItem,
  type ListDataSourceOptions,
  isListDataSourceGroupItem
} from './list-data-source.js';

/**
 * A data source that can be used to filter, group by, sort,
 * and paginate an array of items. Use this data source when
 * you have all the data you need in memory and you don't need
 * to load any additional data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ArrayListDataSource<T = any> extends ListDataSource<T> {
  /** The groups within the data source. */
  #groups?: Map<unknown, ListDataSourceGroupItem>;

  /** The filtered, grouped and sorted items. */
  #items: Array<ListDataSourceDataItem<T>> = [];

  /** The mapped array of items, as provided in the constructor. */
  #mappedItems: Array<ListDataSourceDataItem<T>> = [];

  /** The items, including any group items. This is used for rendering the list. */
  #viewItems: Array<ListDataSourceItem<T>> = [];

  get items() {
    return this.#viewItems;
  }

  get size(): number {
    return this.#items.length;
  }

  get totalSize(): number {
    return this.#mappedItems.length;
  }

  get unfilteredItems() {
    return this.#mappedItems;
  }

  constructor(items: T[], options: ListDataSourceOptions<T> = {}) {
    super(options);

    if (options.groups) {
      this.#groups = new Map(
        options.groups.map(group => [
          group.id,
          {
            ...group,
            id: group.id ?? group,
            type: 'group'
          }
        ])
      );
    }

    this.#mappedItems = items.map(item => ({
      groupId: options.getGroupId?.(item) ?? (options.groupBy ? getValueByPath(item, options.groupBy) : undefined),
      id: options.getId?.(item) ?? item,
      item,
      selected: options.isSelected?.(item),
      type: 'item'
    }));

    this.update(false);
  }

  override expandGroup(id: unknown): void {
    const group = this.#groups?.get(id);
    if (group) {
      group.collapsed = false;
    }
  }

  override collapseGroup(id: unknown): void {
    const group = this.#groups?.get(id);
    if (group) {
      group.collapsed = true;
    }
  }

  override toggleGroup(id: unknown, force?: boolean): void {
    const group = this.#groups?.get(id);
    if (group) {
      group.collapsed = force ?? !group.collapsed;
    }
  }

  update(emitEvent = true): void {
    let items = this.#mappedItems.map(item => ({ ...item, selected: this.isSelected(item) }));

    if (this.filters.size) {
      const filters = Array.from(this.filters.values());

      const pathFilters = filters
        .filter((f): f is DataSourceFilterByPath<T> => 'path' in f && !!f.path)
        .reduce(
          (acc, { path, value }) => {
            if (!acc[path]) {
              acc[path] = [];
            }
            if (Array.isArray(value)) {
              acc[path].push(...value);
            } else {
              acc[path].push(value);
            }
            return acc;
          },
          {} as Record<PathKeys<T>, string[]>
        );

      for (const [path, values] of Object.entries<string[]>(pathFilters)) {
        /**
         * Convert the value to a string and trim it, so we can match
         * an empty string to:
         * - ''
         * - '   '
         * - null
         * - undefined
         */
        items = items.filter(
          ({ item }) =>
            item &&
            values.includes(
              getValueByPath(item, path as PathKeys<T>)
                ?.toString()
                ?.trim() ?? ''
            )
        );
      }

      filters
        .filter((f): f is DataSourceFilterByFunction<T> => 'filter' in f && !!f.filter)
        .forEach(f => {
          items = items.filter(({ item }) => item && f.filter(item, f.value));
        });
    }

    if (this.sort) {
      let sortFn: DataSourceSortFunction<T>;

      if ('path' in this.sort && this.sort.path) {
        const path = this.sort.path;

        sortFn = (a: T, b: T): number => {
          const valueA = getStringByPath(a, path),
            valueB = getStringByPath(b, path);

          const numberA = Number(valueA),
            numberB = Number(valueB);

          if (!isNaN(numberA) && !isNaN(numberB)) {
            return numberA - numberB;
          }

          return valueA.toLowerCase() === valueB.toLowerCase()
            ? 0
            : valueA.toLowerCase() < valueB.toLowerCase()
              ? -1
              : 1;
        };
      } else if ('sorter' in this.sort && this.sort.sorter) {
        sortFn = this.sort.sorter;
      }

      items.sort(({ item: a }, { item: b }) => {
        const result = sortFn(a, b);

        return this.sort?.direction === 'asc' ? result : -result;
      });
    }

    this.#items = items;

    // From here on out, we are only doing purely visual operations,
    // such as adding group items and pagination.
    const groupedItems = [...items];

    let viewItems: Array<ListDataSourceItem<T>> = [];

    if (this.groupBy) {
      this.#groups ??= this.#determineGroups();

      // Sort by group label
      groupedItems.sort((a, b) => {
        const labelA = this.#groups?.get(a.groupId)?.label ?? '',
          labelB = this.#groups?.get(b.groupId)?.label ?? '';

        return labelA.localeCompare(labelB);
      });

      // Insert group items into the viewItems array
      const grouped: Array<ListDataSourceItem<T>> = [];

      let currentGroup: ListDataSourceGroupItem<T> | undefined = undefined,
        currentGroupSelected = false,
        count = 0;

      for (const item of groupedItems) {
        count++;

        if (item.groupId !== currentGroup?.id) {
          currentGroup = this.#groups?.get(item.groupId);
          if (currentGroup) {
            currentGroupSelected = this.isSelected(currentGroup);
            currentGroup.members = [];
            grouped.push(currentGroup);
          }

          count = 1;
        }

        if (currentGroup) {
          currentGroup.count = count;
          currentGroup.members?.push(item);
          item.group = currentGroup;

          if (currentGroupSelected) {
            item.selected = true;
          }
        }

        // Only push the item if the group is not collapsed
        if (!currentGroup?.collapsed) {
          grouped.push(item);
        }
      }

      grouped
        .filter(item => isListDataSourceGroupItem(item))
        .forEach(item => {
          if (item.members?.every(member => member.selected)) {
            item.selected = 'all';
          } else if (item.members?.some(member => member.selected)) {
            item.selected = 'some';
          } else {
            item.selected = 'none';
          }
        });

      viewItems = grouped;
    }

    if (this.pagination) {
      const start = (this.page ?? 0) * this.pageSize,
        end = Math.min(start + this.pageSize, this.size);

      viewItems = viewItems.slice(start, end);
    }

    this.#viewItems = viewItems;

    if (emitEvent) {
      this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
    }
  }

  #determineGroups(): Map<unknown, ListDataSourceGroupItem> {
    const groups = new Map<unknown, ListDataSourceGroupItem>(),
      groupLabels = new Map<unknown, string>();

    this.unfilteredItems.forEach(item => {
      const group = item.groupId;

      if (!groups.has(group)) {
        let label = groupLabels.get(group);
        if (!label) {
          label = this.groupLabelPath ? getStringByPath(item.item, this.groupLabelPath) : String(group);
          groupLabels.set(group, label);
        }

        groups.set(group, {
          id: group,
          label,
          type: 'group'
        });
      }
    });

    return groups;
  }
}
