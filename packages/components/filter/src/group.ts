import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox, CheckboxGroup } from '@sl-design-system/checkbox';
import { FormField, Label } from '@sl-design-system/form';
import { type DataSource } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './group.scss.js';

export type FilterOption = {
  label: string;
  value: string;
  active?: boolean;
};

@localized()
export class FilterGroup<T = unknown> extends ScopedElementsMixin(LitElement) {
  /**
   * The threshold at which the component switches from using a checkbox-group
   * to using a combobox for rendering the options.
   */
  static threshold = 6;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-checkbox-group': CheckboxGroup,
      'sl-form-field': FormField,
      'sl-label': Label
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The source of information for this component. */
  #dataSource?: DataSource<T>;

  /** The filter options. */
  #options: FilterOption[] = [];

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

  /** The label for this group. */
  @property() label?: string;

  get options() {
    return this.#options;
  }

  /** The options that can be filtered. */
  @property({ type: Array })
  set options(value: string[] | FilterOption[] | undefined) {
    this.#options =
      value?.map(option => (typeof option === 'string' ? { label: option, value: option } : option)) ?? [];
  }

  /** The path to the property in the data model to filter on. */
  @property() path?: string;

  /** @internal Whether to show all options when the amount exceeds the threshold. */
  @state() showMore?: boolean;

  override render(): TemplateResult {
    const exceedsThreshold = this.#options.length > FilterGroup.threshold,
      options = this.#options.slice(0, this.showMore ? this.#options.length : FilterGroup.threshold);

    return html`
      <sl-form-field>
        <sl-label>
          ${this.label} ${exceedsThreshold ? html`<span part="count">(${this.#options.length})</span>` : nothing}
        </sl-label>
        <sl-checkbox-group>
          ${options.map(
            option => html`
              <sl-checkbox
                @sl-change=${(event: SlChangeEvent<string>) => this.#onCheckboxChange(event, option)}
                .checked=${option.active}
                .value=${option.value}
              >
                ${option.label}
              </sl-checkbox>
            `
          )}
        </sl-checkbox-group>
        ${exceedsThreshold
          ? html`
              <sl-button @click=${this.#onClick} fill="link">
                ${this.showMore ? msg('Show less') : msg('Show more')}
              </sl-button>
            `
          : nothing}
      </sl-form-field>
    `;
  }

  #onCheckboxChange(event: SlChangeEvent<string>, option: FilterOption): void {
    const id = `${this.path}-${option.value}`;

    if (event.detail) {
      this.dataSource?.addFilter(id, this.path!, option.value);
    } else {
      this.dataSource?.removeFilter(id);
    }

    this.dataSource?.update();
  }

  #onClick(): void {
    this.showMore = !this.showMore;
  }

  #onUpdate = (): void => {
    const filters = this.dataSource!.filters;

    this.#options = this.#options.map(option => {
      return { ...option, active: filters.has(`${this.path}-${option.value}`) };
    });

    this.requestUpdate('options');
  };
}
