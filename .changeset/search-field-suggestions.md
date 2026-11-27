---
'@sl-design-system/search-field': minor
---

Add optional suggested searches to `sl-search-field`.

Autocomplete

- New `autocomplete` modes: `off` (default), `inline`, `list` and `both`.
- New `matching` property: `starts-with` (default) or `contains`. Matching ignores case, accents and repeated whitespace.
- New `suggestion-threshold` (default `3`) and `suggestion-placement` (`overlay` or `flow`) properties.
- Suggestions can be supplied as native `<option>` elements or through the `suggestions` property.
- New `loading` and `unavailable` properties for asynchronous suggestions.

Behavior

- Enter searches the typed words. An inline proposal is only accepted with Right Arrow or End.
- Unaccepted inline proposals are not part of `value`, form submission or validation.
- Suggestions can be chosen with the keyboard or the pointer. Inline and list suggestions respect `maxlength`.
- The suggestion list waits for the bold font (up to 300 ms) before it is first shown, so the emphasised text does not change font.

Design

- Suggestions, loading, empty and unavailable messages share one container with a "Suggested searches" heading.
- A phrase that matches the query exactly is fully emphasised, without a checkmark or selected background.

Accessibility

- Inline proposals are announced through `sl-announcer`.
- Loading, empty and unavailable states are exposed in a status message.
