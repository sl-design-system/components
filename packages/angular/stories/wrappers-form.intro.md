For examples of the different types of forms and how to bind and read values you can look at the `Forms` section in the root of the Angular storybook.

In those examples you will also see there is a special directive that needs to be imported to get those form controls working properly in Angular.

## Search suggestions

`Search Field Autocomplete` shows Angular property bindings such as `[suggestions]` and the `(slSearch)` output. The searched phrase is displayed below the field so the distinction between typed words and accepted completions is visible.

`Search Field Async Suggestions` uses `(slChange)` to request suggestions and `(slClear)` to cancel a pending request and reset the query and suggestion state. Pasting the same query after clearing starts a new request. The example handles `(slSearch)` independently and shows loading, empty and unavailable suggestion states. In an application, cancel or ignore stale network responses in the provider.

Autocomplete searches or filters by a phrase. Use Combobox when the user is choosing a form value from options.

The examples use Angular signals so asynchronous responses update the view in zoneless applications. When copying the asynchronous example, import `Component` and `signal` from `@angular/core`. The synchronous example only needs the following state and event handler.

```typescript
import { signal } from '@angular/core';
import { type SlSearchEvent } from '@sl-design-system/search-field';

readonly suggestions = ['García', 'García Ruiz', 'High West Institute'];
readonly searchedQuery = signal('');

onSearch(event: SlSearchEvent): void {
  this.searchedQuery.set(event.detail);
}
```
