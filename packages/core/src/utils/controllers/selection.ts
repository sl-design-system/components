import type { ReactiveControllerHost } from 'lit';

export interface SelectionControllerOptions {
  multiple: boolean;
}

export class SelectionController<T> {
  #host: ReactiveControllerHost;

  /** Whether all items are selected or not. */
  #selectAll = false;

  /**
   * The current selection; these are either the selected items, or the unselected items,
   * depending on the value of #selectAll.
   */
  #selection = new Set<T>();

  /** The total number of items in the selection. */
  size = 0;

  /** Whether more than 1 item can be selected at a time. */
  multiple = false;

  get selection(): Set<T> {
    return this.#selection;
  }

  constructor(host: ReactiveControllerHost, options?: Partial<SelectionControllerOptions>) {
    this.#host = host;
    this.multiple = !!options?.multiple;
  }

  select(item: T): void {
    if (this.#selectAll) {
      this.#selection.delete(item);
    } else {
      if (!this.multiple) {
        this.#selection.clear();
      }

      this.#selection.add(item);
    }

    this.#host.requestUpdate();
  }

  selectAll(): void {
    this.#selectAll = true;
    this.#selection.clear();
    this.#host.requestUpdate();
  }

  deselect(item: T): void {
    if (this.#selectAll) {
      this.#selection.add(item);
    } else {
      this.#selection.delete(item);
    }

    this.#host.requestUpdate();
  }

  deselectAll(): void {
    this.#selectAll = false;
    this.#selection.clear();
    this.#host.requestUpdate();
  }

  toggle(item: T): void {
    if (this.isSelected(item)) {
      this.deselect(item);
    } else {
      this.select(item);
    }
  }

  areAllSelected(): boolean {
    if (this.#selectAll) {
      return this.#selection.size === 0;
    } else {
      return this.#selection.size === this.size;
    }
  }

  areSomeSelected(): boolean {
    const { size } = this.#selection;

    if (this.#selectAll) {
      return size > 0 && size !== this.size;
    } else {
      return size > 0 && size < this.size;
    }
  }

  isSelected(item: T): boolean {
    if (this.#selectAll) {
      return !this.#selection.has(item);
    } else {
      return this.#selection.has(item);
    }
  }
}
