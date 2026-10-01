import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { SearchField } from '@sl-design-system/search-field';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property } from 'lit/decorators.js';
import { registerRunIcons } from '../run-icons.js';
import styles from './my-groups-filter-card.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-my-groups-filter-card': MyGroupsFilterCard;
  }

  interface GlobalEventHandlersEventMap {
    'sl-my-groups-filter-clear': SlMyGroupsFilterClearEvent;
    'sl-my-groups-filter-search': SlMyGroupsFilterSearchEvent;
  }
}

// The design's `magnifying-glass` and `xmark` glyphs. `@fortawesome/*` is not installed in this
// checkout, so the run ships its own approximations — see `../run-icons.ts`.
registerRunIcons();

/** The group status the list is filtered on. */
export type GroupStatusFilter = 'any' | 'active' | 'archived';

/** The group type the list is filtered on. */
export type GroupTypeFilter = 'any' | 'class' | 'study-group';

/** The complete state of the group filter form. */
export interface GroupFilterValue {
  query: string;
  groupStatus: GroupStatusFilter;
  groupType: GroupTypeFilter;
  schoolYear: string; // 'any' | '2024-2025' | '2023-2024'
}

/** Emitted with the complete filter state when the user submits the filter form. */
export type SlMyGroupsFilterSearchEvent = CustomEvent<GroupFilterValue>;

/** Emitted when the user clears every filter. */
export type SlMyGroupsFilterClearEvent = CustomEvent<void>;

/** A single option in one of the filter dropdowns. */
interface FilterOption {
  label: string;
  value: string;
}

/** One labelled dropdown in the filter row. */
interface FilterSelect {
  label: string;
  name: 'groupStatus' | 'groupType' | 'schoolYear';
  options: FilterOption[];
}

/**
 * Structural constant: the three dropdowns, their labels and their option sets. Only the current
 * values are visible in the design, so the option sets are presentation config that belongs to
 * this component — they are not model fields the data owner passes in.
 */
const FILTER_SELECTS: readonly FilterSelect[] = [
  {
    label: 'Group status',
    name: 'groupStatus',
    options: [
      { label: 'Any', value: 'any' },
      { label: 'Active', value: 'active' },
      { label: 'Archived', value: 'archived' }
    ]
  },
  {
    label: 'Group type',
    name: 'groupType',
    options: [
      { label: 'Any', value: 'any' },
      { label: 'Class', value: 'class' },
      { label: 'Study group', value: 'study-group' }
    ]
  },
  {
    label: 'School year',
    name: 'schoolYear',
    options: [
      { label: 'Any', value: 'any' },
      { label: '2024-2025', value: '2024-2025' },
      { label: '2023-2024', value: '2023-2024' }
    ]
  }
];

/** Structural constant: the search field has no visible label in the design. */
const SEARCH_LABEL = 'Search groups';

/** Structural constant: the search field's placeholder. */
const SEARCH_PLACEHOLDER = 'Search groups';

/** The filter state "Clear filters" puts the form back into. */
const CLEARED_FILTER_VALUE: GroupFilterValue = {
  query: '',
  groupStatus: 'any',
  groupType: 'any',
  schoolYear: 'any'
};

/**
 * The filter state the design shows. Used only until the data owner pushes a `value` in, so the
 * card renders the design's content on its own.
 */
const DESIGN_FILTER_VALUE: GroupFilterValue = {
  // Figma placeholder text: the design's search field literally reads "Input Value" (OQ6). It is
  // rendered verbatim so the visual diff matches the mock.
  query: 'Input Value',
  groupStatus: 'active',
  groupType: 'any',
  schoolYear: 'any'
};

/**
 * The elevated filter card of the "My Groups" page: a search field, three filter dropdowns and
 * the Clear/Search actions. It owns the filter *form state* — a single `<sl-form>` with all four
 * named controls and both action buttons lives in this one shadow tree — while the page stays the
 * owner of the filter *data* and pushes it in through `value`.
 *
 * ```html
 * <sl-my-groups-filter-card .value=${filters}></sl-my-groups-filter-card>
 * ```
 *
 * @fires sl-my-groups-filter-search - Emitted with the complete filter state on submit.
 * @fires sl-my-groups-filter-clear - Emitted when the user clears every filter.
 */
export class MyGroupsFilterCard extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-icon': Icon,
      'sl-option': Option,
      'sl-search-field': SearchField,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for the single filter form this component owns. */
  #form = new FormController<GroupFilterValue>(this);

  /** The filter state last pushed into the form, so it is only written when it actually changes. */
  #appliedValue?: GroupFilterValue;

  /** Emitted when the user clears every filter. */
  @event({ name: 'sl-my-groups-filter-clear' })
  clearEvent!: EventEmitter<SlMyGroupsFilterClearEvent>;

  /** Emitted with the complete filter state when the user submits the form. */
  @event({ name: 'sl-my-groups-filter-search' })
  searchEvent!: EventEmitter<SlMyGroupsFilterSearchEvent>;

  /** The filter state to show. Owned by the page; this component only reflects it into the form. */
  @property({ attribute: false }) value?: GroupFilterValue;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    const value = this.value ?? DESIGN_FILTER_VALUE;

    // The whole form is set at once from the incoming value — never a per-field `.value` binding.
    if (value !== this.#appliedValue) {
      this.#appliedValue = value;
      this.#form.value = value;
    }
  }

  override render(): TemplateResult {
    return html`
      <section aria-label="Filter groups">
        <sl-form @sl-submit=${this.#onSubmit}>
          <sl-search-field
            aria-label=${SEARCH_LABEL}
            name="query"
            placeholder=${SEARCH_PLACEHOLDER}
          ></sl-search-field>

          ${FILTER_SELECTS.map(
            ({ label, name, options }) => html`
              <sl-form-field .label=${label}>
                <sl-select name=${name}>
                  ${options.map(
                    option => html`<sl-option value=${option.value}>${option.label}</sl-option>`
                  )}
                </sl-select>
              </sl-form-field>
            `
          )}

          <div class="actions">
            <sl-button @click=${this.#onClear} fill="link" variant="primary">
              <sl-icon name="xmark"></sl-icon>
              Clear filters
            </sl-button>
            <sl-button fill="solid" shape="pill" type="submit" variant="primary">
              <sl-icon name="magnifying-glass"></sl-icon>
              Search
            </sl-button>
          </div>
        </sl-form>
      </section>
    `;
  }

  #onClear(): void {
    this.#appliedValue = CLEARED_FILTER_VALUE;
    this.#form.value = CLEARED_FILTER_VALUE;

    this.clearEvent.emit();
  }

  #onSubmit(): void {
    this.searchEvent.emit({ ...CLEARED_FILTER_VALUE, ...this.#form.value });
  }
}
