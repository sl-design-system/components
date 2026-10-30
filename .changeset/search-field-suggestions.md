---
'@sl-design-system/search-field': minor
'@sl-design-system/locales': patch
---

Add optional inline and list suggestions to the search field, with prefix or contains matching, configurable thresholds and placement, and loading, empty and unavailable states. Keep typed queries separate from unaccepted completions and support explicit keyboard and pointer selection of suggested searches.

Render inline proposals separately from the native input so form submission, validation and text selection use only accepted text. Preserve active suggestions across updates, hide closed lists in flow layouts, refresh localized suggestion messages and handle Unicode case folding and partial character expansions correctly. Deduplicate requests in the asynchronous example.
