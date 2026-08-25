import { getStringByPath, getValueByPath } from '@sl-design-system/shared';
import {
  ListDataSource,
  isListDataSourceDataItem,
  isListDataSourceGroupItem
} from './list-data-source.js';
export class ArrayListDataSource extends ListDataSource {
  /** The groups within the data source. */
  #groups;
  /** The filtered, grouped and sorted items. */
  #items = [];
  /** The mapped array of items, as provided in the constructor. */
  #mappedItems = [];
  /** The options for the data source. */
  #options;
  /** Optional manual group order, set when groups are explicitly reordered. */
  #reorderedGroupIds;
  /** The items, including any group items. This is used for rendering the list. */
  #viewItems = [];
  get items() {
    return this.#viewItems;
  }
  get size() {
    return this.#items.length;
  }
  get totalSize() {
    return this.#mappedItems.length;
  }
  get unfilteredItems() {
    return this.#mappedItems;
  }
  constructor(items, options = {}) {
    super(options);
    this.#options = options;
    this.setData(items);
    this.update(false);
  }
  reorder(item, relativeItem, position) {
    if (isListDataSourceDataItem(item) && isListDataSourceDataItem(relativeItem)) {
      const from2 = this.#mappedItems.findIndex(mappedItem2 => mappedItem2.id === item.id),
        to2 = this.#mappedItems.findIndex(mappedItem2 => mappedItem2.id === relativeItem.id);
      if (from2 === -1 || to2 === -1 || from2 === to2) {
        return;
      }
      const [mappedItem] = this.#mappedItems.splice(from2, 1);
      this.#mappedItems.splice(
        to2 + (position === 'before' ? 0 : 1) + (from2 < to2 ? -1 : 0),
        0,
        mappedItem
      );
      this.update(false);
      return;
    }
    if (!isListDataSourceGroupItem(item)) {
      return;
    }
    const targetGroupId = isListDataSourceGroupItem(relativeItem)
      ? relativeItem.id
      : relativeItem.groupId;
    if (targetGroupId === void 0 || targetGroupId === item.id) {
      return;
    }
    const groupIds = Array.from(new Set(this.#mappedItems.map(({ groupId }) => groupId))),
      from = groupIds.indexOf(item.id),
      to = groupIds.indexOf(targetGroupId);
    if (from === -1 || to === -1 || from === to) {
      return;
    }
    const orderedGroupIds = [...groupIds],
      [draggedGroupId] = orderedGroupIds.splice(from, 1);
    orderedGroupIds.splice(
      to + (position === 'before' ? 0 : 1) + (from < to ? -1 : 0),
      0,
      draggedGroupId
    );
    this.#reorderedGroupIds = orderedGroupIds;
    const itemsByGroup = this.#mappedItems.reduce((acc, mappedItem) => {
      const key = mappedItem.groupId;
      if (!acc.has(key)) {
        acc.set(key, []);
      }
      acc.get(key).push(mappedItem);
      return acc;
    }, /* @__PURE__ */ new Map());
    this.#mappedItems = orderedGroupIds.flatMap(groupId => itemsByGroup.get(groupId) ?? []);
    this.update(false);
  }
  /** Returns the selected data objects (raw {@link T} items). */
  getSelectedItems() {
    return this.#mappedItems.filter(item => this.isSelected(item)).map(item => item.data);
  }
  /** Update the data source with a new array of items. */
  setData(items) {
    const options = this.#options;
    this.#groups = void 0;
    this.#mappedItems = items.map(item => ({
      id: options.getId?.(item) ?? item.id ?? item,
      groupId:
        options.getGroupId?.(item) ??
        (options.groupBy ? getValueByPath(item, options.groupBy) : void 0),
      type: 'data',
      data: item,
      selected: options.isSelected?.(item)
    }));
    if (this.#reorderedGroupIds?.length) {
      const availableGroupIds = Array.from(new Set(this.#mappedItems.map(item => item.groupId)));
      this.#reorderedGroupIds = this.#reorderedGroupIds.filter(groupId =>
        availableGroupIds.includes(groupId)
      );
      availableGroupIds.forEach(groupId => {
        if (!this.#reorderedGroupIds.includes(groupId)) {
          this.#reorderedGroupIds.push(groupId);
        }
      });
    }
    const validIds = new Set(this.#mappedItems.map(item => item.id));
    let selectionChanged = false;
    for (const id of this.selection) {
      if (!validIds.has(id)) {
        this.selection.delete(id);
        selectionChanged = true;
      }
    }
    if (selectionChanged) {
      this.dispatchEvent(
        new CustomEvent('sl-selection-change', {
          detail: { selection: this.selection }
        })
      );
    }
  }
  update(emitEvent = true) {
    let items = this.#mappedItems.map(item => ({ ...item, selected: this.isSelected(item) }));
    if (this.filters.size) {
      const filters = Array.from(this.filters.values());
      const pathFilters = filters
        .filter(f => typeof f.by === 'string')
        .reduce((acc, { by, value }) => {
          const path = by;
          if (!acc[path]) {
            acc[path] = [];
          }
          if (Array.isArray(value)) {
            acc[path].push(...value);
          } else {
            acc[path].push(value);
          }
          return acc;
        }, {});
      for (const [path, values] of Object.entries(pathFilters)) {
        items = items.filter(
          ({ data: item }) =>
            item && values.includes(getValueByPath(item, path)?.toString()?.trim() ?? '')
        );
      }
      filters
        .filter(f => typeof f.by === 'function')
        .forEach(({ by, value }) => {
          items = items.filter(({ data: item }) => item && by(item, value));
        });
    }
    if (this.sort) {
      let sortFn;
      if (typeof this.sort.by === 'function') {
        sortFn = this.sort.by;
      } else {
        const path = this.sort.by;
        sortFn = (a, b) => {
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
      }
      items.sort(({ data: a }, { data: b }) => {
        const result = sortFn(a, b);
        return this.sort?.direction === 'asc' ? result : -result;
      });
    }
    this.#items = items;
    let viewItems = [...items];
    if (this.groupBy) {
      const groupedItems = [...items];
      this.#groups ??= this.#determineGroups();
      if (this.#reorderedGroupIds?.length) {
        groupedItems.sort((a, b) => {
          const idxA = this.#reorderedGroupIds.indexOf(a.groupId),
            idxB = this.#reorderedGroupIds.indexOf(b.groupId);
          if (idxA !== -1 && idxB !== -1 && idxA !== idxB) {
            return idxA - idxB;
          }
          const labelA = this.#groups?.get(a.groupId)?.label ?? '',
            labelB = this.#groups?.get(b.groupId)?.label ?? '';
          return labelA.localeCompare(labelB);
        });
      } else {
        groupedItems.sort((a, b) => {
          const labelA = this.#groups?.get(a.groupId)?.label ?? '',
            labelB = this.#groups?.get(b.groupId)?.label ?? '';
          return labelA.localeCompare(labelB);
        });
      }
      const grouped = [];
      let currentGroup = void 0,
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
        if (!this.isGroupCollapsed(currentGroup?.id)) {
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
      if (this.groupSort) {
        const sortFn =
          this.groupSort.by ??
          ((a, b) => {
            const valueA = isListDataSourceGroupItem(a)
                ? (a.label ?? String(a.id))
                : (a.group?.label ?? String(a.group?.id)),
              valueB = isListDataSourceGroupItem(b)
                ? (b.label ?? String(b.id))
                : (b.group?.label ?? String(b.group?.id));
            const result = valueA.localeCompare(valueB);
            return this.groupSort?.direction === 'desc' ? -result : result;
          });
        grouped.sort(sortFn);
      }
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
  #determineGroups() {
    const groups = /* @__PURE__ */ new Map(),
      groupLabels = /* @__PURE__ */ new Map();
    this.unfilteredItems.forEach(item => {
      const group = item.groupId;
      if (!groups.has(group)) {
        let label = groupLabels.get(group);
        if (!label) {
          label = this.groupLabelPath
            ? getStringByPath(item.data, this.groupLabelPath)
            : String(group);
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
//# sourceMappingURL=array-list-data-source.js.map
