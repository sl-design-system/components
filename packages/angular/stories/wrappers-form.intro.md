For examples of the different types of forms and how to bind and read values you can look at the `Forms` section in the root of the Angular storybook.

In those examples you will also see there is a special directive that needs to be imported to get those form controls working properly in Angular.

## Search suggestions

`Search Field Autocomplete` shows Angular property bindings such as `[suggestions]` and the `(slSearch)` output. The searched phrase is displayed below the field so the distinction between typed words and accepted completions is visible.

`Search Field Async Suggestions` listens to `(slChange)` for edits and handles `(slSearch)` independently. It deduplicates unchanged queries, cancels pending simulated requests, and exposes loading, empty and unavailable responses. In an application, cancel or ignore stale network responses in the provider. These response states describe suggestions; ordinary search remains available.

Autocomplete searches or filters by a phrase. Use Combobox when the user is choosing a form value from options.

The examples use Angular signals so asynchronous responses update the view in zoneless applications. For a synchronous example, the state and event handler can be as small as:

```typescript
import { signal } from '@angular/core';
import { type SlSearchEvent } from '@sl-design-system/search-field';

readonly suggestions = ['García', 'García Ruiz', 'High West Institute'];
readonly searchedQuery = signal('');

onSearch(event: SlSearchEvent): void {
  this.searchedQuery.set(event.detail);
}
```
