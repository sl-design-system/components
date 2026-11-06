import { signal } from '@angular/core';
import { CheckboxComponent, CheckboxGroupComponent } from '@sl-design-system/angular/checkbox';
import { ComboboxComponent } from '@sl-design-system/angular/combobox';
import { DateFieldComponent } from '@sl-design-system/angular/date-field';
import { OptionComponent } from '@sl-design-system/angular/listbox';
import { NumberFieldComponent } from '@sl-design-system/angular/number-field';
import { RadioComponent, RadioGroupComponent } from '@sl-design-system/angular/radio-group';
import { SearchFieldComponent } from '@sl-design-system/angular/search-field';
import { SelectComponent } from '@sl-design-system/angular/select';
import { SwitchComponent } from '@sl-design-system/angular/switch';
import { TextAreaComponent } from '@sl-design-system/angular/text-area';
import { TextFieldComponent } from '@sl-design-system/angular/text-field';
import { TimeFieldComponent } from '@sl-design-system/angular/time-field';
import {
  type SlSearchEvent,
  type SearchField as SearchFieldElement
} from '@sl-design-system/search-field';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';

const createSearchAutocompleteProps = () => {
  const searchedQuery = signal('');
  return {
    suggestions: ['García', 'García Ruiz', 'High West Institute', 'Elementary High School'],
    searchedQuery,
    onSearch: (event: SlSearchEvent) => searchedQuery.set(event.detail)
  };
};

const createSearchAsyncProps = () => {
  const state = signal({ suggestions: [] as string[], loading: false, unavailable: false }),
    response = signal('available'),
    searchedQuery = signal('');
  let previousQuery: string | undefined,
    timer: ReturnType<typeof setTimeout> | undefined,
    field: SearchFieldElement | undefined;
  const loadSuggestions = (query: string, force = false): void => {
    if (!force && query === previousQuery) return;
    previousQuery = query;
    clearTimeout(timer);

    if (Array.from(query.replace(/\s/g, '')).length < 3) {
      state.set({ suggestions: [], loading: false, unavailable: false });
      return;
    }

    state.update(current => ({ ...current, loading: true, unavailable: false }));
    const requestedResponse = response();
    timer = setTimeout(() => {
      if (!field?.isConnected) return;
      state.set({
        suggestions: requestedResponse === 'available' ? ['García', 'Garden', 'Garland'] : [],
        loading: false,
        unavailable: requestedResponse === 'unavailable'
      });
    }, 700);
  };
  return {
    state,
    response,
    searchedQuery,
    onEdit: (event: SlChangeEvent<string>) => {
      field = event.target as SearchFieldElement;
      loadSuggestions(event.detail ?? '');
    },
    onResponseChange: (event: Event) => {
      response.set((event.target as HTMLSelectElement).value);
      loadSuggestions(previousQuery ?? '', true);
    },
    onSearch: (event: SlSearchEvent) => searchedQuery.set(event.detail)
  };
};

export default {
  title: 'Wrappers/Form',
  decorators: [
    moduleMetadata({
      imports: [
        CheckboxComponent,
        CheckboxGroupComponent,
        ComboboxComponent,
        DateFieldComponent,
        NumberFieldComponent,
        OptionComponent,
        RadioComponent,
        RadioGroupComponent,
        SearchFieldComponent,
        SelectComponent,
        SwitchComponent,
        TextFieldComponent,
        TextAreaComponent,
        TimeFieldComponent
      ]
    })
  ]
} as Meta;

export const Checkbox: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to buttons using the (sl-change) event to respond to value changes.',
    props: {
      action: (event: Event) => console.log('Checkbox toggled, current value:', event)
    },
    template: `
      <sl-checkbox-group (sl-change)="action($event)">
        <sl-checkbox>Checkbox 1</sl-checkbox>
        <sl-checkbox>Checkbox 2</sl-checkbox>
        <sl-checkbox>Checkbox 3</sl-checkbox>
      </sl-checkbox-group>
    `
  })
};

export const Combobox: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the combobox using the (sl-change) event to respond to value changes.',
    props: {
      action: (event: Event) => console.log('Combobox changed, current value:', event)
    },
    template: `
      <sl-combobox
        placeholder="Select an option"
        style="max-width: 500px"
        (sl-change)="action($event)">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
    `
  })
};

export const NumberField: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to buttons using the (sl-change) event to respond to value changes.',
    props: {
      action: (event: Event) => console.log('NumberField changed, current value:', event)
    },
    template: '<sl-number-field (sl-change)="action($event)"></sl-number-field>'
  })
};

export const RadioGroup: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to buttons using the (sl-change) event to respond to value changes.',
    props: {
      action: (event: Event) => console.log('RadioGroup changed, current value:', event)
    },
    template: `
      <sl-radio-group (sl-change)="action($event)">
        <sl-radio value="1">Radio 1</sl-radio>
        <sl-radio value="2">Radio 2</sl-radio>
        <sl-radio value="3">Radio 3</sl-radio>
      </sl-radio-group>
    `
  })
};

export const SearchField: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the search field using the (sl-search) event after typing pauses or when the user submits a search, or (sl-clear) when they clear the field.',
    props: {
      onSearch: (event: Event) => console.log('Search submitted:', event),
      onClear: (event: Event) => console.log('Search cleared:', event)
    },
    template:
      '<sl-search-field placeholder="Search..." (sl-search)="onSearch($event)" (sl-clear)="onClear($event)"></sl-search-field>'
  })
};

/** Keep the typed query or explicitly accept a suggested search phrase. */
export const SearchFieldAutocomplete: StoryObj = {
  render: () => ({
    description:
      'Type Gar or High. Enter searches the typed words; Right Arrow or End accepts an inline proposal. The searched phrase appears below the field.',
    props: createSearchAutocompleteProps(),
    template: `
      <div style="display: grid; gap: 1rem; max-width: 32rem">
        <sl-search-field
          aria-label="Search students"
          autocomplete="both"
          matching="contains"
          placeholder="Try Gar or High"
          [suggestions]="suggestions"
          (slSearch)="onSearch($event)"></sl-search-field>
        <p aria-live="polite">Searched phrase: {{ searchedQuery() || 'No search yet' }}</p>
      </div>
    `
  })
};

/** A simulated provider with cancellation, query deduplication and response states. */
export const SearchFieldAsyncSuggestions: StoryObj = {
  render: () => ({
    description:
      'Suggestions load independently of search. Changing response cancels the pending simulation. Repeated slChange events for an unchanged query do not restart loading. Empty and unavailable suggestions still allow searching.',
    props: createSearchAsyncProps(),
    template: `
      <div style="display: grid; gap: 1rem; max-width: 32rem">
        <label for="search-suggestion-response">Suggestion response</label>
        <select id="search-suggestion-response" [value]="response()" (change)="onResponseChange($event)">
          <option value="available">Suggestions available</option>
          <option value="empty">No suggestions</option>
          <option value="unavailable">Suggestions unavailable</option>
        </select>
        <sl-search-field
          aria-label="Search students"
          autocomplete="both"
          suggestion-placement="flow"
          placeholder="Try Gar"
          [suggestions]="state().suggestions"
          [loading]="state().loading"
          [unavailable]="state().unavailable"
          (slChange)="onEdit($event)"
          (slSearch)="onSearch($event)"></sl-search-field>
        <p aria-live="polite">Searched phrase: {{ searchedQuery() || 'No search yet' }}</p>
      </div>
    `
  })
};

export const Select: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the select using the (sl-change) event to respond to selection changes.',
    props: {
      action: (event: Event) => console.log('Select changed, current value:', event)
    },
    template: `
      <sl-select (sl-change)="action($event)">
        <sl-option value="1">Option 1</sl-option>
        <sl-option value="2">Option 2</sl-option>
        <sl-option value="3">Option 3</sl-option>
      </sl-select>
    `
  })
};

export const Switch: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the switch using the (sl-change) event to respond to toggle changes.',
    props: {
      action: (event: Event) => console.log('Switch toggled, current value:', event)
    },
    template: '<sl-switch (sl-change)="action($event)">Toggle me</sl-switch>'
  })
};

export const TextField: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the text field using the (sl-change) event to respond to input changes.',
    props: {
      action: (event: Event) => console.log('TextField changed, current value:', event)
    },
    template:
      '<sl-text-field (sl-change)="action($event)" placeholder="Type something..."></sl-text-field>'
  })
};

export const TextArea: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the text area using the (sl-change) event to respond to input changes.',
    props: {
      action: (event: Event) => console.log('TextArea changed, current value:', event)
    },
    template:
      '<sl-text-area (sl-change)="action($event)" placeholder="Enter text..."></sl-text-area>'
  })
};

export const DateField: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the date field using the (sl-change) event to respond to date selection changes.',
    props: {
      action: (event: Event) => console.log('DateField changed, current value:', event)
    },
    template: '<sl-date-field (sl-change)="action($event)"></sl-date-field>'
  })
};

export const TimeField: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the time field using the (sl-change) event to respond to time selection changes.',
    props: {
      action: (event: Event) => console.log('TimeField changed, current value:', event)
    },
    template: '<sl-time-field (sl-change)="action($event)"></sl-time-field>'
  })
};
