import { type ReactiveControllerHost } from 'lit';

export interface SelectionControllerOptions {
  multiple: boolean;
}

/** Emits when the selection changes. */
export type SlSelectionChangeEvent<T> = CustomEvent<{ selection: SelectionController<T> }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SelectionController<T = any> {
  /** The active item. There can only be one active item at a time.*/
  #active?: T | null;

  /** The host element. */
  #host: ReactiveControllerHost & Element;

  /** Whether all items are selected or not. */
  #selectAll = false;

  /**
   * The current selection; these are either the selected items, or the unselected items,
   * depending on the value of #selectAll.
   */
  #selection = new Set<T>();

  /** Whether more than 1 item can be selected at a time. */
  multiple = false;

  /**
   * Returns the number of selected items. This may not match the size of the selection
   * Set. Depending on the selectAll state, the selection may only contain unselected items.
   */
  get selected(): number {
    if (this.#selectAll) {
      return this.size - this.#selection.size;
    } else {
      return this.#selection.size;
    }
  }

  /** Depending on the selectAll state, this may contain selected or unselected items. */
  get selection(): Set<T> {
    return this.#selection;
  }

  /** The total number of items in the selection. */
  size = 0;

  constructor(host: ReactiveControllerHost & Element, options?: Partial<SelectionControllerOptions>) {
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

    this.#updateHost();
  }

  selectAll(): void {
    this.#selectAll = true;
    this.#selection.clear();
    this.#updateHost();
  }

  deselect(item: T): void {
    if (this.#selectAll) {
      this.#selection.add(item);
    } else {
      this.#selection.delete(item);
    }

    this.#updateHost();
  }

  deselectAll(): void {
    this.#selectAll = false;
    this.#selection.clear();
    this.#updateHost();
  }

  toggle(item: T): void {
    if (this.isSelected(item)) {
      this.deselect(item);
    } else {
      this.select(item);
    }
  }

  toggleActive(item: T | undefined): T | undefined {
    this.#active = this.#active === item ? undefined : item;

    return this.#active;
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

  isActive(item: T): boolean {
    return this.#active === item;
  }

  isSelected(item: T): boolean {
    if (this.#selectAll) {
      return !this.#selection.has(item);
    } else {
      return this.#selection.has(item);
    }
  }

  isSelectAllToggled(): boolean {
    return this.#selectAll;
  }

  #updateHost(): void {
    this.#host.dispatchEvent(new CustomEvent('sl-selection-change', { bubbles: true, composed: true, detail: this }));
    this.#host.requestUpdate();
  }
}
