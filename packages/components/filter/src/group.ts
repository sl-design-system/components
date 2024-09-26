import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Checkbox, CheckboxGroup } from '@sl-design-system/checkbox';
import { Combobox } from '@sl-design-system/combobox';
import { FormField } from '@sl-design-system/form';
import { Listbox, Option } from '@sl-design-system/listbox';
import { type DataSource } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { Tag, TagList } from '@sl-design-system/tag';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
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
      'sl-checkbox': Checkbox,
      'sl-checkbox-group': CheckboxGroup,
      'sl-combobox': Combobox,
      'sl-form-field': FormField,
      'sl-listbox': Listbox,
      'sl-option': Option,
      'sl-tag': Tag,
      'sl-tag-list': TagList
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

  override render(): TemplateResult {
    return html`
      <sl-form-field .label=${this.label}>${this.options?.length ? this.#renderOptions() : nothing}</sl-form-field>
    `;
  }

  #renderOptions(): TemplateResult {
    if (this.#options.length > FilterGroup.threshold) {
      return html`
        <sl-combobox @sl-change=${this.#onComboboxChange} multiple .placeholder=${msg('Select 1 or more options')}>
          <sl-listbox>
            ${this.#options.map(option => html`<sl-option .value=${option.value}>${option.label}</sl-option>`)}
          </sl-listbox>
        </sl-combobox>
      `;
    } else {
      return html`
        <sl-checkbox-group>
          ${this.#options.map(
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
      `;
    }
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

  #onComboboxChange(event: SlChangeEvent<string[]>): void {
    const ids = event.detail.map(value => `${this.path}-${value}`);

    for (const key of this.dataSource!.filters.keys()) {
      if (key.startsWith(this.path!) && !ids.includes(key)) {
        this.dataSource?.removeFilter(key);
      }
    }

    event.detail.forEach(value => {
      this.dataSource?.addFilter(`${this.path}-${value}`, this.path!, value);
    });

    this.dataSource?.update();
  }

  #onUpdate = (): void => {
    const filters = this.dataSource!.filters;

    this.#options = this.#options.map(option => {
      return { ...option, active: filters.has(`${this.path}-${option.value}`) };
    });

    this.requestUpdate('options');
  };
}
