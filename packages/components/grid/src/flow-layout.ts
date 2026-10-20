import { FlowLayout } from '@lit-labs/virtualizer/layouts/flow.js';

/** Flow layout with measurements scoped to the current data source items. */
export class GridFlowLayout extends FlowLayout {
  #itemsChanged = false;

  protected override _setItems(items: unknown[]): void {
    if (items !== this.items) {
      this.#itemsChanged = true;
    }

    super._setItems(items);
  }

  override updateItemSizes(sizes: Parameters<FlowLayout['updateItemSizes']>[0]): void {
    // https://github.com/lit/lit/issues/4789
    // Flow caches measurements by index, including indices removed by filtering.
    // Invalidate only when replacement measurements arrive, so a reflow never
    // runs with an empty cache and falls back to the default 100px row estimate.
    if (this.#itemsChanged) {
      this._metricsCache.clear();
      this.#itemsChanged = false;
    }

    super.updateItemSizes(sizes);
  }
}
