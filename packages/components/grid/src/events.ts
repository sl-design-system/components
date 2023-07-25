import type { GridColumn } from './column.js';
import type { Grid } from './grid.js';
import type { DataSourceSortDirection } from '@sl-design-system/shared';

export class GridEvent<T> extends Event {
  constructor(type: string, public readonly grid: Grid<T>) {
    super(type, { bubbles: true, composed: true });
  }
}

export class GridActiveItemChangeEvent<T> extends GridEvent<T> {
  constructor(grid: Grid<T>, public readonly item: T, public readonly relatedEvent: Event | null) {
    super('sl-active-item-change', grid);
  }
}

export class GridColumnEvent<T> extends GridEvent<T> {
  constructor(type: string, public readonly column: GridColumn<T>) {
    super(type, column.grid!);
  }
}

export class GridFilterValueChangeEvent<T> extends GridColumnEvent<T> {
  constructor(column: GridColumn<T>, public readonly value: string | string[] | undefined) {
    super('sl-filter-value-change', column);
  }
}

export class GridSortDirectionChangeEvent<T> extends GridColumnEvent<T> {
  constructor(column: GridColumn<T>, public readonly direction: DataSourceSortDirection | undefined) {
    super('sl-sort-direction-change', column);
  }
}
