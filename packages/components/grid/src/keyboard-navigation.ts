import { msg, str } from '@lit/localize';
import { type VirtualizerHostElement, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { ListDataSourcePlaceholder } from '@sl-design-system/data-source';
import { type Grid } from './grid.js';

interface Position {
  row: number;
  column: number;
  id?: unknown;
  type?: string;
  columnId?: string;
}

interface Cell {
  element: HTMLTableCellElement;
  start: number;
  end: number;
  controls: HTMLElement[];
  target: HTMLElement;
  access?: HTMLButtonElement;
  editor?: HTMLInputElement;
}

const controlSelector =
  'a[href], button, input:not([type="hidden"]), select, textarea, summary, [contenteditable="true"], [tabindex], [role="button"], [role="link"], [role="combobox"]';

function isDisabled(control: HTMLElement): boolean {
  return control.matches(':disabled, [disabled], [aria-disabled="true"]');
}

export class GridKeyboardNavigation {
  #cells = new Map<HTMLTableCellElement, Cell>();
  #rows = new Map<number, Cell[]>();
  #active?: Position;
  #session?: { cell: Cell; draft?: string };
  #tabIndices = new Map<HTMLElement, string | null>();
  #disabledControls = new Set<HTMLElement>();
  #temporarilyEnabled = new Set<HTMLElement>();
  #accessButtons = new Map<HTMLTableCellElement, HTMLButtonElement>();
  #observers = new Map<Node, MutationObserver>();
  #move = 0;
  #parkingFocus = false;
  #pointerDown = false;

  constructor(private grid: Grid) {}

  disconnect(): void {
    this.#move++;
    this.#pointerDown = false;
    this.#finish(false, false);
    this.#observers.forEach(observer => observer.disconnect());
    this.#observers.clear();
    this.#temporarilyEnabled.forEach(control => control.setAttribute('disabled', ''));
    this.#temporarilyEnabled.clear();
    this.#tabIndices.forEach((value, element) => this.#restoreTabIndex(element, value));
    this.#tabIndices.clear();
    this.#disabledControls.forEach(control => control.removeAttribute('aria-disabled'));
    this.#disabledControls.clear();
    this.#accessButtons.forEach(button => button.remove());
    this.#accessButtons.clear();
    this.#cells.clear();
    this.#rows.clear();
  }

  refresh = (): void => {
    const { table, thead, tbody, dataSource } = this.grid;
    if (this.grid.keyboardNavigation !== 'arrows' || !table || !this.grid.isConnected) return;

    const roots = new Set<Node>([table]),
      managed = new Set<HTMLElement>(),
      accessCells = new Set<HTMLTableCellElement>(),
      disabledControls = new Set<HTMLElement>();

    this.#rows.clear();
    this.#cells.clear();
    const addRow = (row: HTMLTableRowElement, index: number): void => {
      const cells: Cell[] = [];
      Array.from(row.cells).forEach((element, columnIndex) => {
        if (element.closest('[hidden], [inert]') || getComputedStyle(element).display === 'none')
          return;

        const start = Number(element.getAttribute('aria-colindex')) || columnIndex + 1,
          span = row.part.contains('group')
            ? Number(table.getAttribute('aria-colcount')) || 1
            : element.colSpan,
          editor = element.querySelector<HTMLInputElement>('[data-grid-editor]') ?? undefined,
          controls = this.#getControls(element, roots),
          editButton = element.querySelector<HTMLButtonElement>('[data-grid-edit]'),
          needsAccess =
            !editButton &&
            (controls.length > 1 ||
              controls.some(control =>
                control.matches(
                  'select, textarea, [role="combobox"], [contenteditable="true"], input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"])'
                )
              ));
        let access: HTMLButtonElement | undefined;
        if (needsAccess) {
          accessCells.add(element);
          access = this.#accessButtons.get(element);
          if (!access) {
            access = document.createElement('button');
            access.type = 'button';
            access.dataset.gridAccess = '';
            access.setAttribute('aria-describedby', 'grid-access-instructions');
            access.textContent = msg('Actions', { id: 'sl.grid.actions' });
            element.prepend(access);
            this.#accessButtons.set(element, access);
          }
          const context = this.#getCellContext(element, start);
          const label = context
            ? msg(str`Actions for ${context}`, { id: 'sl.grid.actionsForCell' })
            : msg('Cell actions', { id: 'sl.grid.cellActions' });
          access.setAttribute('aria-label', label);
          managed.add(access);
        }

        controls.forEach(control => {
          if (
            (control.matches(':disabled') || this.#temporarilyEnabled.has(control)) &&
            (!control.hasAttribute('aria-disabled') || this.#disabledControls.has(control))
          ) {
            if (!control.hasAttribute('aria-disabled'))
              control.setAttribute('aria-disabled', 'true');
            disabledControls.add(control);
          }
          managed.add(control);
        });
        managed.add(element);
        if (editor) managed.add(editor);
        if (editButton) managed.add(editButton);
        controls.forEach(control => {
          if (this.#disabledControls.has(control) && !disabledControls.has(control)) {
            control.removeAttribute('aria-disabled');
          }
        });
        if (access) {
          const accessDisabled = String(controls.every(isDisabled));
          if (access.getAttribute('aria-disabled') !== accessDisabled) {
            access.setAttribute('aria-disabled', accessDisabled);
          }
        }
        const target =
            editButton ??
            access ??
            controls.find(control => !isDisabled(control)) ??
            (controls.length === 1 ? controls[0] : undefined) ??
            element,
          cell = { element, start, end: start + span - 1, controls, target, access, editor };
        if (!editButton && !access && controls.length === 1 && isDisabled(controls[0])) {
          this.#prepareDisabledControls(cell);
        }
        cells.push(cell);
        this.#cells.set(element, cell);
      });
      if (cells.length) this.#rows.set(index, cells);
    };

    Array.from(thead.rows).forEach((row, index) => addRow(row, index - thead.rows.length));
    Array.from(tbody.rows).forEach(row => {
      if (row.hasAttribute('index')) addRow(row, Number(row.getAttribute('index')));
    });

    this.#accessButtons.forEach((button, cell) => {
      if (!accessCells.has(cell)) {
        button.remove();
        this.#accessButtons.delete(cell);
      }
    });
    this.#disabledControls.forEach(control => {
      if (!disabledControls.has(control)) control.removeAttribute('aria-disabled');
    });
    this.#disabledControls = disabledControls;

    const session = this.#session;
    if (session) {
      const current = this.#cells.get(session.cell.element);
      if (current?.target === session.cell.target) {
        session.cell = current;
      } else {
        this.#finish(false, false, false);
      }
    }

    if (this.#active && this.#active.row >= 0 && this.#active.id !== ListDataSourcePlaceholder) {
      const { id, type, row } = this.#active,
        items = dataSource?.items ?? [];
      if (items[row]?.id !== id || items[row]?.type !== type) {
        const index = items.findIndex(item => item.id === id && item.type === type);
        const fallback = Math.min(row, items.length - 1);
        if (index < 0 && fallback < 0) {
          this.#active = undefined;
        } else {
          this.#active = {
            ...this.#active,
            row: index < 0 ? fallback : index,
            ...this.#rowIdentity(index < 0 ? fallback : index)
          };
        }
      }
    }

    const firstRow = this.#rows.keys().next().value;
    if (!this.#active && firstRow !== undefined) {
      this.#active = this.#position(firstRow, this.#rows.get(firstRow)![0]);
    } else if (this.#active && this.#active.row < -thead.rows.length) {
      this.#active =
        firstRow === undefined ? undefined : this.#position(firstRow, this.#rows.get(firstRow)![0]);
    }
    const active = this.#active && this.#cellAt(this.#active);
    const entry = active?.target ?? table;
    managed.add(table);
    this.#tabIndices.forEach((value, element) => {
      if (!managed.has(element)) {
        this.#restoreTabIndex(element, value);
        this.#tabIndices.delete(element);
      }
    });
    managed.forEach(element => {
      this.#setTabIndex(element, !this.#session && element === entry ? 0 : -1);
    });

    this.#observers.forEach((observer, root) => {
      if (!roots.has(root)) {
        observer.disconnect();
        this.#observers.delete(root);
      }
    });
    roots.forEach(root => {
      if (this.#observers.has(root)) return;
      const observer = new MutationObserver(this.refresh);
      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-disabled', 'disabled', 'hidden', 'inert', 'href']
      });
      this.#observers.set(root, observer);
    });
  };

  onPointerDown = (): void => {
    if (this.grid.keyboardNavigation !== 'arrows') return;
    this.#pointerDown = true;
    const clear = (): void => {
      setTimeout(() => {
        this.#pointerDown = false;
        if (this.#session?.cell.access) {
          this.#session.cell.access.hidden = true;
        }
      });
    };
    window.addEventListener('mouseup', clear, { once: true });
    window.addEventListener('pointercancel', clear, { once: true });
  };

  onFocusIn = (event: FocusEvent): void => {
    if (this.grid.keyboardNavigation !== 'arrows') return;
    const [target] = event.composedPath();
    if (target === this.grid.table) {
      if (this.#active && !this.#parkingFocus) void this.#focus(this.#active);
      return;
    }
    const cell = this.#eventCell(event);
    if (!cell || this.#session?.cell.element === cell.element) return;
    if (this.#session) this.#finish(false, false);

    const row = this.#rowIndex(cell.element);
    if (
      target !== cell.target &&
      cell.access &&
      cell.controls.some(control => event.composedPath().includes(control))
    ) {
      if (!this.#pointerDown) cell.access.hidden = true;
      this.#session = { cell };
      this.#prepareDisabledControls(cell);
    }
    this.#active = this.#position(row, cell);
    this.refresh();
  };

  onFocusOut = (event: FocusEvent): void => {
    if (this.grid.keyboardNavigation !== 'arrows') return;
    const session = this.#session;
    if (!session) {
      if (event.relatedTarget && !this.grid.table.contains(event.relatedTarget as Node))
        this.#move++;
      return;
    }
    // A popup can briefly leave focus on the body before restoring it to its trigger.
    queueMicrotask(() => {
      if (this.#session === session && !session.cell.element.matches(':focus-within')) {
        this.#finish(false, false);
      }
    });
  };

  onClick = (event: MouseEvent): void => {
    this.#pointerDown = false;
    if (this.grid.keyboardNavigation !== 'arrows') return;
    const cell = this.#eventCell(event);
    if (!cell) return;
    const path = event.composedPath();
    if (
      cell.controls.some(control => path.includes(control) && isDisabled(control)) ||
      (path.includes(cell.target) && isDisabled(cell.target))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    } else if (path.includes(cell.target) && (cell.access || cell.editor)) {
      event.stopPropagation();
      this.#enter(cell);
    } else if (cell.access && cell.controls.some(control => path.includes(control))) {
      cell.access.hidden = true;
    }
  };

  onNavigationKeyDown = (event: KeyboardEvent): void => {
    if (this.grid.keyboardNavigation !== 'arrows' || event.isComposing) return;
    const cell = this.#eventCell(event);
    if (!cell) return;
    const path = event.composedPath(),
      onDisabledControl =
        cell.controls.some(control => path.includes(control) && isDisabled(control)) ||
        (path.includes(cell.target) && isDisabled(cell.target));
    if (
      this.#session?.cell.element === cell.element &&
      onDisabledControl &&
      event.key !== 'Tab' &&
      event.key !== 'Escape'
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (
      this.#session?.cell.element !== cell.element &&
      onDisabledControl &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.#hasOpenPopup(event)) return;
    if (this.#session?.cell.element === cell.element) {
      this.#handleSessionKey(event, cell);
    } else {
      this.#navigate(event, cell);
    }
  };

  #handleSessionKey(event: KeyboardEvent, cell: Cell): void {
    const { key } = event;
    if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.#finish(false, true);
    } else if (cell.editor && key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.#finish(true, true);
    } else if (key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      const controls = cell.editor
          ? [cell.editor]
          : cell.controls.filter(control => !control.matches(':disabled')),
        index = controls.findIndex(control => event.composedPath().includes(control));
      controls[index + (event.shiftKey ? -1 : 1)]?.focus();
    }
  }

  #navigate(event: KeyboardEvent, cell: Cell): void {
    const { key } = event;
    if (
      event.altKey ||
      event.metaKey ||
      event.shiftKey ||
      (event.ctrlKey && key !== 'Home' && key !== 'End')
    )
      return;
    const row = this.#rowIndex(cell.element),
      column = Math.max(cell.start, Math.min(this.#active?.column ?? cell.start, cell.end)),
      siblings = this.#rows.get(row)!,
      index = siblings.indexOf(cell),
      first = -this.grid.thead.rows.length,
      last = (this.grid.dataSource?.items.length ?? 0) - 1,
      pageSize =
        Number.isFinite(this.grid.keyboardPageSize) && this.grid.keyboardPageSize >= 1
          ? Math.floor(this.grid.keyboardPageSize)
          : 10;
    let next: Position | undefined;
    switch (key) {
      case 'ArrowLeft':
      case 'ArrowRight': {
        const right = key === 'ArrowRight',
          rtl = getComputedStyle(this.grid).direction === 'rtl',
          target = siblings[index + (right === rtl ? -1 : 1)];
        if (target) next = this.#position(row, target);
        break;
      }
      case 'ArrowUp':
      case 'ArrowDown':
      case 'PageUp':
      case 'PageDown': {
        const offset = key.startsWith('Page') ? pageSize : 1;
        next = {
          row: Math.max(first, Math.min(last, row + (key.endsWith('Up') ? -offset : offset))),
          column
        };
        break;
      }
      case 'Home':
      case 'End': {
        const start = key === 'Home';
        if (event.ctrlKey) {
          const targetRow = start ? first : last,
            cells = this.#rows.get(targetRow),
            target = start ? cells?.[0] : cells?.at(-1);
          next = target
            ? this.#position(targetRow, target)
            : {
                row: targetRow,
                column: start ? 1 : Number(this.grid.table.getAttribute('aria-colcount'))
              };
        } else {
          next = this.#position(row, start ? siblings[0] : siblings.at(-1)!);
        }
        break;
      }
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (next && (next.row !== row || next.column !== column)) void this.#focus(next);
  }

  #getControls(cell: HTMLTableCellElement, roots: Set<Node>): HTMLElement[] {
    const controls: HTMLElement[] = [];
    const isControl = (node: Element): node is HTMLElement => {
      if (
        !(node instanceof HTMLElement) ||
        node.matches('sl-button, sl-menu-button') ||
        (!node.matches(controlSelector) &&
          !this.#tabIndices.has(node) &&
          !node.hasAttribute('data-grid-control'))
      ) {
        return false;
      }
      if (node.hasAttribute('data-grid-control')) return true;
      const tabIndex = this.#tabIndices.has(node)
        ? this.#tabIndices.get(node)
        : node.getAttribute('tabindex');
      return (
        tabIndex !== '-1' ||
        (isDisabled(node) && node.matches('[role="button"], [role="link"], [role="combobox"]'))
      );
    };
    const walk = (node: Element): void => {
      if (
        node.matches(
          '[hidden], [inert], [data-grid-access], [data-grid-edit], [data-grid-editor], [popover]'
        ) ||
        getComputedStyle(node).display === 'none'
      )
        return;

      if (node instanceof HTMLSlotElement) {
        const assigned = node.assignedElements({ flatten: true });
        (assigned.length ? assigned : Array.from(node.children)).forEach(walk);
      } else if (node instanceof HTMLElement && node.hasAttribute('data-grid-control')) {
        controls.push(node);
      } else if (node.shadowRoot) {
        const before = controls.length;
        roots.add(node.shadowRoot);
        Array.from(node.shadowRoot.children).forEach(walk);
        if (controls.length === before) {
          Array.from(node.children).forEach(walk);
        }
        if (controls.length === before && isControl(node)) {
          controls.push(node);
        }
      } else if (isControl(node)) {
        controls.push(node);
      } else {
        Array.from(node.children).forEach(walk);
      }
    };
    Array.from(cell.children).forEach(walk);
    return controls;
  }

  #getCellContext(cell: HTMLTableCellElement, column: number): string {
    const header = Array.from(this.grid.thead.rows)
        .reverse()
        .flatMap(row => Array.from(row.cells))
        .find(header => header.id && Number(header.getAttribute('aria-colindex')) === column),
      label = header?.getAttribute('aria-label') || header?.textContent?.trim(),
      row = this.#rowIndex(cell) + 1,
      context = cell
        .querySelector('[data-grid-actions-label]')
        ?.getAttribute('data-grid-actions-label');
    return (
      context ||
      (row > 0
        ? msg(str`${label || msg('Cell', { id: 'sl.grid.cell' })}, row ${row}`, {
            id: 'sl.grid.actionCellContext'
          })
        : label || '')
    );
  }

  #rowIndex(cell: HTMLTableCellElement): number {
    const row = cell.parentElement as HTMLTableRowElement;
    return row.hasAttribute('index')
      ? Number(row.getAttribute('index'))
      : row.sectionRowIndex - this.grid.thead.rows.length;
  }

  #rowIdentity(row: number): Pick<Position, 'id' | 'type'> {
    const item = this.grid.dataSource?.items[row];
    return { id: item?.id, type: item?.type };
  }

  #position(row: number, cell: Cell): Position {
    return {
      row,
      column: cell.start,
      columnId: cell.element.id || cell.element.getAttribute('data-grid-column') || undefined,
      ...this.#rowIdentity(row)
    };
  }

  #cellAt({ row, column, columnId }: Position): Cell | undefined {
    const cells = this.#rows.get(row);
    return (
      cells?.find(
        cell =>
          columnId &&
          (cell.element.id === columnId ||
            cell.element.getAttribute('data-grid-column') === columnId)
      ) ??
      cells?.find(cell => cell.start <= column && column <= cell.end) ??
      cells?.find(cell => cell.start > column) ??
      cells?.at(-1)
    );
  }

  #eventCell(event: Event): Cell | undefined {
    for (const node of event.composedPath()) {
      if (node instanceof HTMLTableCellElement && this.#cells.has(node))
        return this.#cells.get(node);
    }
    return undefined;
  }

  async #focus(position: Position): Promise<void> {
    const move = ++this.#move;
    let cell = this.#cellAt(position);
    if (!cell && position.row >= 0) {
      // Keep focus in the grid while the virtualizer removes the previously focused row.
      this.#parkingFocus = true;
      this.grid.table.focus({ preventScroll: true });
      this.#parkingFocus = false;
      const virtualizer = (this.grid.tbody as VirtualizerHostElement)[virtualizerRef];
      virtualizer?.element(position.row)?.scrollIntoView({ block: 'nearest' });
      try {
        await virtualizer?.layoutComplete;
      } catch {
        return;
      }
      if (move !== this.#move || !this.grid.isConnected) return;
      this.refresh();
      cell = this.#cellAt(position);
    }
    if (!cell || !this.grid.table.matches(':focus-within')) return;
    cell.target.focus();
    this.#active = { ...this.#position(position.row, cell), column: position.column };
    this.refresh();
  }

  #enter(cell: Cell): void {
    if (this.#session?.cell.element === cell.element) return;
    this.#finish(false, false);
    this.#active = this.#position(this.#rowIndex(cell.element), cell);
    this.#session = { cell, draft: cell.editor?.value };
    cell.target.hidden = true;
    if (cell.editor) {
      cell.editor.hidden = false;
      cell.editor.focus();
    } else {
      this.#prepareDisabledControls(cell);
      cell.controls.find(control => !isDisabled(control))?.focus();
    }
    this.refresh();
  }

  #prepareDisabledControls(cell: Cell): void {
    // Retain the disabled announcement and block activation while making the control focusable.
    cell.controls.forEach(control => {
      if (control.matches(':disabled[disabled]') && control.hasAttribute('aria-disabled')) {
        this.#temporarilyEnabled.add(control);
        control.removeAttribute('disabled');
      }
    });
  }

  #finish(commit: boolean, restoreFocus: boolean, refresh = true): void {
    if (!this.#session) return;
    const { cell, draft } = this.#session;
    this.#session = undefined;
    if (cell.editor) {
      if (commit) cell.editor.dispatchEvent(new Event('sl-grid-edit-commit'));
      else cell.editor.value = draft ?? '';
      cell.editor.hidden = true;
    }
    cell.controls.forEach(control => {
      if (this.#temporarilyEnabled.delete(control)) {
        control.setAttribute('disabled', '');
      }
    });
    cell.target.hidden = false;
    if (restoreFocus) cell.target.focus();
    if (refresh) this.refresh();
  }

  #hasOpenPopup(event: Event): boolean {
    return event
      .composedPath()
      .some(
        node =>
          node instanceof HTMLElement &&
          (node.matches(
            ':popover-open, [aria-expanded="true"][aria-haspopup], [role="combobox"][aria-expanded="true"]'
          ) ||
            !!node.shadowRoot?.querySelector(':popover-open'))
      );
  }

  #setTabIndex(element: HTMLElement, value: number): void {
    if (!this.#tabIndices.has(element))
      this.#tabIndices.set(element, element.getAttribute('tabindex'));
    if (element.getAttribute('tabindex') !== String(value))
      element.setAttribute('tabindex', String(value));
  }

  #restoreTabIndex(element: HTMLElement, value: string | null): void {
    if (value === null) element.removeAttribute('tabindex');
    else element.setAttribute('tabindex', value);
  }
}
