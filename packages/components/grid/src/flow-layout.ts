import { FlowLayout } from '@lit-labs/virtualizer/layouts/flow.js';

/** Flow layout with measurements scoped to the current data source items. */
export class GridFlowLayout extends FlowLayout {
  #itemsChanged = false;

  constructor(...args: ConstructorParameters<typeof FlowLayout>) {
    super(...args);
    this._itemSize = { width: 100, height: 38 };
  }

  protected override _setItems(items: unknown[]): void {
    if (items !== this.items && !this.#areItemsEquivalent(this.items ?? [], items ?? [])) {
      this.#itemsChanged = true;
    }

    super._setItems(items);
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
      if (idA !== undefined && idB !== undefined ? idA !== idB : a !== b) {
        return false;
      }
    }
    return true;
  }

  override _updateScrollSize(): void {
    const prev = this._scrollSize;
    super._updateScrollSize();
    if (prev > 1 && Math.abs(this._scrollSize - prev) <= 3) {
      this._scrollSize = prev;
    } else {
      this._scrollSize = Math.round(this._scrollSize);
    }
  }

  override updateItemSizes(sizes: Parameters<FlowLayout['updateItemSizes']>[0]): void {
    // https://github.com/lit/lit/issues/4789
    // Flow caches measurements by index, including indices removed by filtering.
    // Invalidate only when replacement measurements arrive, so a reflow never
    // runs with an empty cache and falls back to the default row estimate.
    if (this.#itemsChanged) {
      this._metricsCache.clear();
      this.#itemsChanged = false;
    }

    super.updateItemSizes(sizes);
  }
}
