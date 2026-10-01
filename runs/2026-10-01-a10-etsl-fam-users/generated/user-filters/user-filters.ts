import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { FormField } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { SearchField } from '@sl-design-system/search-field';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './user-filters.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a10-add-user': SlA10AddUserEvent;
    'sl-a10-period-change': SlA10PeriodChangeEvent;
    'sl-a10-search-change': SlA10SearchChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a10-user-filters': A10UserFilters;
  }
}

/** The period the user list is filtered on. */
export type PeriodId = 'last-7-days' | 'last-30-days' | 'last-90-days';

/** The slice of the page's domain model this filter row renders. Owned by the page root. */
export interface UserFiltersModel {
  searchTerm: string;
  period: PeriodId;
}

/** Emitted with the search term, 200ms after the user stops typing. */
export type SlA10SearchChangeEvent = CustomEvent<string>;

/** Emitted with the id of the period the user picked. */
export type SlA10PeriodChangeEvent = CustomEvent<PeriodId>;

/** Emitted when the user presses "Add new user". */
export type SlA10AddUserEvent = CustomEvent<void>;

/**
 * Structural/presentation config: the period set never varies per user or per request, so it is a
 * module-level constant here rather than a field on `UserFiltersModel`. The model carries the
 * selected *key*; the labels belong to the component that renders them.
 */
const PERIOD_OPTIONS = [
  { id: 'last-7-days', label: 'Last 7 days' },
  { id: 'last-30-days', label: 'Last 30 days' }, // the design's selected value
  { id: 'last-90-days', label: 'Last 90 days' }
] as const satisfies ReadonlyArray<{ id: PeriodId; label: string }>;

/** Structural constant: the label above the search field. */
const SEARCH_LABEL = 'Search user';

/** Structural constant: the search field's placeholder. */
const SEARCH_PLACEHOLDER = 'Enter search text';

/** Structural constant: the label above the period select. */
const PERIOD_LABEL = 'Last login date';

/** Structural constant: the period select's placeholder, for when nothing is selected. */
const PERIOD_PLACEHOLDER = 'Select period';

/** Structural constant: the label of the primary action. */
const ADD_USER_LABEL = 'Add new user';

/**
 * How long to wait after the last keystroke before republishing the search term. The design has
 * no annotation for this; 200ms is the decomposition's chosen default (OQ-6). Deliberately not
 * `sl-search-field`'s own `sl-search`, which debounces at 300ms and additionally fires on Enter.
 */
const SEARCH_DEBOUNCE = 200;

/**
 * The filter row of the FAM Users page: a labelled search field, a labelled period select, and
 * the primary "Add new user" action pinned to the inline end of the 1200px content column.
 *
 * Presentational — it renders the `model` the page gives it and emits when the user changes
 * something; the page owns the filter state and pushes the next `model` back in.
 *
 * This is **not** a submitting form: the three controls act independently and there is no
 * Save/Cancel pair, so there is no `<sl-form>` and no `FormController` — just a neutral `<div>`.
 * Both controls are still wrapped in `<sl-form-field>`: Code Connect gives the select one, and
 * the search field needs the same 20px label + 4px gap + 36px control stack to keep the two
 * 60px blocks dimensionally identical (and it gets proper `<label for>` wiring for free).
 *
 * Scoped child of the page root: it does not register a custom element of its own.
 *
 * ```html
 * <sl-a10-user-filters .model=${model}></sl-a10-user-filters>
 * ```
 *
 * @fires sl-a10-search-change - Emitted with the search term, debounced 200ms.
 * @fires sl-a10-period-change - Emitted with the id of the period the user picked.
 * @fires sl-a10-add-user - Emitted when the user presses "Add new user".
 */
export class A10UserFilters extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-form-field': FormField,
      'sl-icon': Icon,
      // `sl-option` is registered by the listbox package, not by select.
      'sl-option': Option,
      'sl-search-field': SearchField,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Pending debounced search emission, cleared on every keystroke and on disconnect. */
  #searchTimer?: ReturnType<typeof setTimeout>;

  /** Emitted when the user presses "Add new user". */
  @event({ name: 'sl-a10-add-user' }) addUserEvent!: EventEmitter<SlA10AddUserEvent>;

  /** Emitted with the id of the period the user picked. */
  @event({ name: 'sl-a10-period-change' }) periodChangeEvent!: EventEmitter<SlA10PeriodChangeEvent>;

  /** Emitted with the search term, 200ms after the last keystroke. */
  @event({ name: 'sl-a10-search-change' }) searchChangeEvent!: EventEmitter<SlA10SearchChangeEvent>;

  /** The filter state to render. Owned by the page root. */
  @property({ attribute: false }) model!: UserFiltersModel;

  override disconnectedCallback(): void {
    this.#clearSearchTimer();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    const { period, searchTerm } = this.model;

    return html`
      <div class="filters">
        <sl-form-field class="field" .label=${SEARCH_LABEL}>
          <sl-search-field
            @input=${this.#onSearchInput}
            @sl-clear=${this.#onSearchClear}
            .value=${searchTerm}
            name="search"
            placeholder=${SEARCH_PLACEHOLDER}>
            <!--
              The search glyph is slotted rather than left to sl-search-field's own default, which
              renders it inside that component's shadow root where its colour is only reachable
              through the host's inherited "color" -- and that would drag the input text along
              with it. The design colours the two differently.
            -->
            <sl-icon name="search" slot="prefix"></sl-icon>
          </sl-search-field>
        </sl-form-field>

        <sl-form-field class="field" .label=${PERIOD_LABEL}>
          <sl-select
            @sl-change=${this.#onPeriodChange}
            .value=${period}
            name="period"
            placeholder=${PERIOD_PLACEHOLDER}>
            ${PERIOD_OPTIONS.map(
              ({ id, label }) => html`<sl-option value=${id}>${label}</sl-option>`
            )}
          </sl-select>
        </sl-form-field>

        <sl-button @click=${this.#onAddUserClick} class="add-user" variant="primary">
          <!--
            The Code Connect snippet for this node names the glyph with a Font Awesome style
            prefix ("far-" + the glyph name). That mapping is valid Code Connect but wrong for
            this frame: themes/editorial-suite/icons.ts registers the unprefixed "plus", so the
            prefixed name resolves to nothing registered and the button would render no glyph
            at all.
          -->
          <sl-icon name="plus"></sl-icon>
          ${ADD_USER_LABEL}
        </sl-button>
      </div>
    `;
  }

  /**
   * The search term is republished on a 200ms debounce. The value is read synchronously, because
   * by the time the timer fires the event is done dispatching and `currentTarget` is `null`.
   */
  #onSearchInput(event: Event): void {
    const value = (event.currentTarget as SearchField).value ?? '';

    this.#clearSearchTimer();

    this.#searchTimer = setTimeout(() => {
      this.#searchTimer = undefined;
      this.searchChangeEvent.emit(value);
    }, SEARCH_DEBOUNCE);
  }

  /**
   * The clear button sets the field's value directly without firing `input`, so the debounced
   * path above never sees it. Clearing is an explicit act, so it is republished immediately.
   */
  #onSearchClear(): void {
    this.#clearSearchTimer();

    this.searchChangeEvent.emit('');
  }

  /**
   * `sl-select` emits the generic `sl-change` with the selected option's value, which is one of
   * `PERIOD_OPTIONS`' ids — or `undefined` when the selection is cleared, which this select never
   * does (it is not `clearable`).
   */
  #onPeriodChange(event: CustomEvent<PeriodId | undefined>): void {
    if (event.detail) {
      this.periodChangeEvent.emit(event.detail);
    }
  }

  #onAddUserClick(): void {
    this.addUserEvent.emit();
  }

  #clearSearchTimer(): void {
    if (this.#searchTimer !== undefined) {
      clearTimeout(this.#searchTimer);
      this.#searchTimer = undefined;
    }
  }
}
