import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type DataSource, type DataSourceFilterByPath, getNameByPath } from '@sl-design-system/shared';
import { Tag, TagList } from '@sl-design-system/tag';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './status.scss.js';

type ActiveFilter = { id: string } & DataSourceFilterByPath;

/**
 * Displays the current filter status.
 */
@localized()
export class FilterStatus<T = unknown> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tag': Tag,
      'sl-tag-list': TagList
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The source of information for this component. */
  #dataSource?: DataSource<T>;

  get dataSource() {
    return this.#dataSource;
  }

  /** The data source used for displaying the filter status. */
  @property({ attribute: false })
  set dataSource(value: DataSource | undefined) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.#onUpdate);
    }

    this.#dataSource = value;
    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);
    this.#onUpdate();
  }

  /** @internal The total number of filtered items in the data source. */
  @state() filteredCount?: number;

  /** @internal The active filters. */
  @state() filters?: ActiveFilter[];

  /** @internal The total number of items in the data source. */
  @state() totalCount = 0;

  override render(): TemplateResult {
    return html`
      <span part="count">
        ${this.filteredCount !== undefined
          ? html`<span part="filtered-count">${msg(str`${this.filteredCount} of `)}</span>`
          : nothing}
        <span part="total-count">${msg(str`${this.totalCount} items`)}</span>
      </span>

      ${this.filters?.length
        ? html`
            <sl-tag-list part="filters" stacked>
              ${repeat(
                this.filters,
                ({ id }) => id,
                ({ id, path, value }) => html`
                  <sl-tag @sl-remove=${() => this.#onRemove(id)} removable>${getNameByPath(path)}: ${value}</sl-tag>
                `
              )}
            </sl-tag-list>
          `
        : nothing}
    `;
  }

  #onRemove(filterId: string): void {
    this.dataSource?.removeFilter(filterId);
    this.dataSource?.update();
  }

  #onUpdate = (): void => {
    this.totalCount = this.dataSource?.size ?? 0;

    if (this.dataSource?.filters.size) {
      this.filteredCount = this.dataSource?.filteredItems.length ?? 0;

      this.filters = Array.from(this.dataSource.filters.entries())
        .filter((filter): filter is [string, DataSourceFilterByPath] => Object.hasOwn(filter[1], 'path'))
        .map(([id, filter]) => ({ id, ...filter }));
    } else {
      this.filteredCount = undefined;
      this.filters = [];
    }
  };
}
