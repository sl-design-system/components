import { FlowLayout } from '@lit-labs/virtualizer/layouts/flow.js';
import {
  type ListDataSourceItem,
  ListDataSourcePlaceholder,
  isListDataSourceDataItem
} from '@sl-design-system/data-source';

// Bound retained content and recursive work independently of the dataset size.
const MAX_CONTENT_SNAPSHOT_VALUES = 256;
const MAX_CONTENT_SNAPSHOT_DEPTH = 16;

/** Flow layout with measurements scoped to the current data source items. */
export class GridFlowLayout extends FlowLayout {
  #itemsChanged = false;

  /** Content at measurement time, independent of mutable data references. */
  #contentSnapshots = new Map<number, { data: unknown; content?: unknown[] }>();

  /** Opaque graphs always invalidate; do not repeatedly traverse shared oversized objects. */
  #opaqueContent = new WeakSet<object>();

  constructor(...args: ConstructorParameters<typeof FlowLayout>) {
    super(...args);
    this._itemSize = { width: 100, height: 38 };
  }

  protected override _setItems(items: unknown[]): void {
    if (
      this.#hasContentChanges() ||
      (items !== this.items && !this.#areItemsEquivalent(this.items ?? [], items ?? []))
    ) {
      this.#itemsChanged = true;
    }

    super._setItems(items);
  }

  #hasContentChanges(): boolean {
    for (const { data, content } of this.#contentSnapshots.values()) {
      if (!content) {
        return true;
      }
      const current = this.#captureContent(data);
      if (
        !current ||
        content.length !== current.length ||
        content.some((value, index) => !Object.is(value, current[index]))
      ) {
        return true;
      }
    }

    return false;
  }

  /** Snapshot measured records only; never traverse the lazy items array. */
  #captureContent(data: unknown): unknown[] | undefined {
    const content: unknown[] = [],
      seen = new Map<object, number>();
    let remaining = MAX_CONTENT_SNAPSHOT_VALUES;
    const capture = (value: unknown, depth = 0): boolean => {
      if (remaining-- <= 0 || depth > MAX_CONTENT_SNAPSHOT_DEPTH) {
        return false;
      }
      if (typeof value === 'function') {
        return false;
      }
      if (value === null || typeof value !== 'object') {
        content.push(typeof value, value);
        return true;
      }
      if (this.#opaqueContent.has(value)) {
        return false;
      }
      const reference = seen.get(value);
      if (reference !== undefined) {
        content.push('reference', reference);
        return true;
      }
      seen.set(value, seen.size);

      const prototype: unknown = Object.getPrototypeOf(value);
      content.push('object', prototype);
      if (value instanceof Date) {
        content.push(value.getTime());
      } else if (
        prototype !== Object.prototype &&
        prototype !== Array.prototype &&
        prototype !== null
      ) {
        // Opaque objects may hold mutable state that own properties cannot describe.
        this.#opaqueContent.add(value);
        return false;
      }

      // Check large arrays before enumerating their indices, including lazy proxies.
      if (Array.isArray(value) && value.length > remaining) {
        this.#opaqueContent.add(value);
        return false;
      }
      const keys = Reflect.ownKeys(value);
      if (keys.length > remaining) {
        this.#opaqueContent.add(value);
        return false;
      }
      content.push(keys.length);
      for (const key of keys) {
        const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
        // Do not invoke application getters while measuring or comparing rows.
        if (!('value' in descriptor)) {
          this.#opaqueContent.add(value);
          return false;
        }
        content.push(key, descriptor.enumerable);
        if (!capture(descriptor.value as unknown, depth + 1)) {
          this.#opaqueContent.add(value);
          return false;
        }
      }
      return true;
    };

    return capture(data) ? content : undefined;
  }

  #areItemsEquivalent(prev: unknown[], next: unknown[]): boolean {
    if (prev === next) {
      return true;
    }
    if (prev.length !== next.length) {
      return false;
    }
    for (let i = 0; i < prev.length; i++) {
      const a = prev[i] as { id?: unknown; data?: unknown };
      const b = next[i] as { id?: unknown; data?: unknown };
      // Reading lazy array entries may fetch a page. Stop at the first unloaded
      // item rather than fetching the entire data source to compare placeholders.
      if (a?.id === ListDataSourcePlaceholder || b?.id === ListDataSourcePlaceholder) {
        return false;
      }
      if (a === b) {
        continue;
      }
      const dataA = a?.data;
      const dataB = b?.data;
      const idA =
        a?.id ??
        (dataA && typeof dataA === 'object' && 'id' in dataA
          ? (dataA as { id?: unknown }).id
          : dataA);
      const idB =
        b?.id ??
        (dataB && typeof dataB === 'object' && 'id' in dataB
          ? (dataB as { id?: unknown }).id
          : dataB);
      if ((idA !== undefined && idB !== undefined ? idA !== idB : a !== b) || dataA !== dataB) {
        return false;
      }
    }
    return true;
  }

  override _updateScrollSize(): void {
    super._updateScrollSize();
    this._scrollSize = Math.round(this._scrollSize);
  }

  override updateItemSizes(sizes: Parameters<FlowLayout['updateItemSizes']>[0]): void {
    // https://github.com/lit/lit/issues/4789
    // Flow caches measurements by index, including indices removed by filtering.
    // Invalidate only when replacement measurements arrive, so a reflow never
    // runs with an empty cache and falls back to the default row estimate.
    if (this.#itemsChanged) {
      this._metricsCache.clear();
      this.#contentSnapshots.clear();
      this.#itemsChanged = false;
    }

    super.updateItemSizes(sizes);

    for (const index of Object.keys(sizes).map(Number)) {
      const item = this.items[index] as ListDataSourceItem | undefined;
      if (isListDataSourceDataItem<unknown>(item) && item.id !== ListDataSourcePlaceholder) {
        this.#contentSnapshots.set(index, {
          data: item.data,
          content: this.#captureContent(item.data)
        });
      }
    }
  }
}
