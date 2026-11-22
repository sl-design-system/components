import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import {
  type DataSourceSortDirection,
  type DataSourceSortFunction
} from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event, getNameByPath } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type GridColumn } from './column.js';
import styles from './sorter.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-sorter-change': SlSorterChangeEvent;
    'sl-sorter-register': SlSorterRegisterEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-grid-sorter': GridSorter;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlSorterChangeEvent<T = any> = CustomEvent<{
  column: GridColumn<T>;
  direction?: DataSourceSortDirection;
}>;

export type SlSorterRegisterEvent = CustomEvent<void>;

/** Component that is used as the column header for a sortable column. */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSorter<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The grid column. */
  @property({ attribute: false }) column!: GridColumn<T>;

  /** The direction in which to sort the items. */
  @property({ reflect: true }) direction?: DataSourceSortDirection;

  /** The path to the field to sort on. */
  @property() path?: string;

  /** An optional custom sort function. */
  @property({ attribute: false }) sorter?: DataSourceSortFunction<T>;

  /** @internal Emits when the direction has changed. */
  @event({ name: 'sl-sorter-change' }) sorterChangeEvent!: EventEmitter<SlSorterChangeEvent<T>>;

  /** @internal Emits when the sorter has been added or removed. */
  @event({ name: 'sl-sorter-register' }) sorterRegisterEvent!: EventEmitter<SlSorterRegisterEvent>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.sorterRegisterEvent.emit();
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <sl-button
        @click=${this.#onClick}
        aria-label=${
          this.direction === 'asc'
            ? msg('Sort descending', { id: 'sl.grid.sortDescending' })
            : this.direction === 'desc'
              ? msg('Remove sort', { id: 'sl.grid.removeSort' })
              : msg('Sort ascending', { id: 'sl.grid.sortAscending' })
        }
        .fill=${this.direction ? 'solid' : 'ghost'}
        size="sm"
        variant=${ifDefined(this.direction ? 'primary' : undefined)}>
        ${choose(
          this.direction,
          [
            ['asc', () => html`<sl-icon name="sort-up"></sl-icon>`],
            ['desc', () => html`<sl-icon name="sort-down"></sl-icon>`]
          ],
          () => html`<sl-icon name="sort"></sl-icon>`
        )}
      </sl-button>
    `;
  }

  /**
   * Resets the sorter to its initial state. This does not emit a change event. It is used
   * internally by the grid component to reset the sorter.
   */
  reset(): void {
    this.direction = undefined;
  }

  #onClick(): void {
    this.#toggleDirection();
    this.sorterChangeEvent.emit({ column: this.column, direction: this.direction });
    this.#announceSort();
  }

  #announceSort(): void {
    const columnName = this.#getColumnName();

    if (!columnName) {
      return;
    }

    const message =
      this.direction === 'asc'
        ? msg(str`${columnName} sorting ascending`, { id: 'sl.grid.sortingAscending' })
        : this.direction === 'desc'
          ? msg(str`${columnName} sorting descending`, { id: 'sl.grid.sortingDescending' })
          : msg(str`${columnName} sorting removed`, { id: 'sl.grid.sortingRemoved' });

    announce(message, 'polite');
  }

  #getColumnName(): string {
    const nodes =
        this.renderRoot.querySelector('slot')?.assignedNodes({ flatten: true }) ??
        Array.from(this.childNodes),
      slottedText = nodes
        .map(node => this.#getNodeText(node))
        .filter(Boolean)
        .join(' ');

    return (
      slottedText || this.column?.headerLabelText || (this.path ? getNameByPath(this.path) : '')
    );
  }

  #getNodeText(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.trim() ?? '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      if (
        element.localName === 'sl-infotip' ||
        element.localName === 'sl-tooltip' ||
        element.getAttribute('aria-hidden') === 'true'
      ) {
        return '';
      }

      return Array.from(element.childNodes)
        .map(child => this.#getNodeText(child))
        .filter(Boolean)
        .join(' ');
    }

    return '';
  }

  #toggleDirection(): void {
    if (this.direction === 'asc') {
      this.direction = 'desc';
    } else if (this.direction === 'desc') {
      this.direction = undefined;
    } else {
      this.direction = 'asc';
    }
  }
}
